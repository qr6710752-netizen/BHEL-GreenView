
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2, Sprout, TreePine } from 'lucide-react';

const POINTS_PER_TREE = 100;

export function VirtualGarden() {
    const [user] = useAuthState(auth);
    const [treeCount, setTreeCount] = useState(0);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const userPoints = userData.points || 0;
                        setPoints(userPoints);
                        setTreeCount(Math.floor(userPoints / POINTS_PER_TREE));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                 setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }
    
    const pointsToNextTree = POINTS_PER_TREE - (points % POINTS_PER_TREE);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Forest</CardTitle>
                <CardDescription>A visual representation of your positive environmental impact.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 justify-center p-4 bg-green-50 rounded-lg border border-dashed border-green-200 min-h-[200px] items-center">
                    {treeCount > 0 ? (
                        Array.from({ length: treeCount }).map((_, index) => (
                           <TreePine key={index} className="h-12 w-12 text-green-600" />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Sprout className="h-10 w-10 mx-auto mb-2" />
                            <p>Your garden is just starting.</p>
                            <p>Earn points to plant your first tree!</p>
                        </div>
                    )}
                </div>
                 <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">Total Points: {points}</p>
                    <p className="text-muted-foreground">You are {pointsToNextTree} points away from planting your next tree.</p>
                </div>
            </CardContent>
        </Card>
    )
}

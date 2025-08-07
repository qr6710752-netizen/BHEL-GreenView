
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

type User = {
  name: string;
  points: number;
  avatar?: string;
};

export function LeaderboardCard() {
    const usersQuery = query(collection(db, "users"), orderBy("points", "desc"), limit(5));
    const [leaderboard, loading, error] = useCollectionData(usersQuery);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle>Top Green Champions</CardTitle>
        <CardDescription>This month's top contributors.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        {!loading && leaderboard && (
            <ul className="space-y-4">
            {leaderboard.map((user, index) => (
                <li key={index} className="flex items-center gap-4">
                <span className="font-bold text-lg w-6 text-center">
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                    {index === 2 && <Award className="w-5 h-5 text-yellow-700" />}
                    {index > 2 && index + 1}
                </span>
                <Avatar>
                    <AvatarImage src={user.avatar || `https://placehold.co/40x40.png`} data-ai-hint="profile picture"/>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.points} pts</p>
                </div>
                </li>
            ))}
            </ul>
        )}
         <Button variant="link" className="p-0 h-auto mt-4" asChild>
          <Link href="/leaderboard">View full leaderboard</Link>
         </Button>
      </CardContent>
    </Card>
  );
}

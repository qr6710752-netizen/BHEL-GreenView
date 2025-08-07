
"use client";

import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";

type User = {
  id: string;
  rank?: number;
  name: string;
  department: string;
  points: number;
  avatar?: string; // URL or initials
};

type Team = {
    id: string;
    rank?: number;
    name:string;
    points: number;
};

const mockIndividualLeaderboard: User[] = [
    { id: '1', name: 'Priya Singh', department: 'Engineering', points: 3250, avatar: 'PS' },
    { id: '2', name: 'Ravi Sharma', department: 'Marketing', points: 2980, avatar: 'RS' },
    { id: '3', name: 'Anil Kumar', department: 'Operations', points: 2750, avatar: 'AK' },
    { id: '4', name: 'Sunita Devi', department: 'Human Resources', points: 2600, avatar: 'SD' },
    { id: '5', name: 'Vijay Rathod', department: 'Facilities', points: 2450, avatar: 'VR' },
    { id: '6', name: 'Meena Kumari', department: 'Engineering', points: 2300, avatar: 'MK' },
    { id: '7', name: 'Sanjay Verma', department: 'IT', points: 2150, avatar: 'SV' },
    { id: '8', name: 'Pooja Reddy', department: 'Marketing', points: 1980, avatar: 'PR' },
    { id: '9', name: 'Amit Patel', department: 'Operations', points: 1800, avatar: 'AP' },
    { id: '10', name: 'Deepika Rao', department: 'Facilities', points: 1650, avatar: 'DR' },
];

const mockTeamLeaderboard: Team[] = [
    { id: 't1', name: 'Eco Warriors', points: 12500 },
    { id: 't2', name: 'Green Giants', points: 11200 },
    { id: 't3', name: 'Sustainability Squad', points: 9800 },
    { id: 't4', name: 'Power Savers', points: 8500 },
    { id: 't5', name: 'Waste Watchers', points: 7200 },
];


const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-yellow-700" />;
  return <span className="text-sm font-medium w-5 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
    const [individualLeaderboard, setIndividualLeaderboard] = useState<User[]>([]);
    const [teamLeaderboard, setTeamLeaderboard] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setIndividualLeaderboard(mockIndividualLeaderboard);
            setTeamLeaderboard(mockTeamLeaderboard);
            setLoading(false);
        }, 1000);
    }, []);
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Leaderboard" />

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      
      {!loading && (
        <Tabs defaultValue="individual" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="individual">
            <Card>
                <CardHeader>
                <CardTitle>Top Green Champions</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {individualLeaderboard.map((user, index) => (
                        <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                            <RankIcon rank={index + 1} />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell className="text-right font-semibold">{user.points.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="team">
            <Card>
                <CardHeader>
                <CardTitle>Top Performing Teams</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {teamLeaderboard.map((team, index) => (
                        <TableRow key={team.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                            <RankIcon rank={index + 1} />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="team logo" />
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{team.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{team.points.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

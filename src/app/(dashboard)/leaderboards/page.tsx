
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
import { useMemo } from "react";

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

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-yellow-700" />;
  return <span className="text-sm font-medium w-5 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
    const usersQuery = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
    const [users, loading, error] = useCollectionData(usersQuery, { idField: 'id' });

    const teamLeaderboard = useMemo(() => {
        if (!users) return [];
        const teams: { [key: string]: number } = {};
        users.forEach(user => {
            if (user.department) {
                if (!teams[user.department]) {
                    teams[user.department] = 0;
                }
                teams[user.department] += user.points;
            }
        });

        return Object.entries(teams)
            .map(([name, points]) => ({ id: name, name, points }))
            .sort((a, b) => b.points - a.points);
    }, [users]);
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Leaderboard" />

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {error && <p className="text-destructive">Error: {error.message}</p>}
      
      {!loading && users && (
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
                    {users.map((user, index) => (
                        <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                            <RankIcon rank={index + 1} />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.avatar || `https://placehold.co/40x40.png`} data-ai-hint="profile picture" />
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

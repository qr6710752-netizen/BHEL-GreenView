
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

type User = {
  id: string;
  rank: number;
  name: string;
  department: string;
  points: number;
  avatar: string; // URL or initials
};

type Team = {
    id: string;
    rank: number;
    name: string;
    points: number;
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-yellow-700" />;
  return <span className="text-sm font-medium w-5 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
    const usersRef = collection(db, "users");
    const teamsRef = collection(db, "leaderboards"); // Assuming teams are in a 'leaderboards' collection

    const userQuery = query(usersRef, orderBy("points", "desc"), limit(10));
    const teamQuery = query(teamsRef, orderBy("points", "desc"), limit(10));

    const [individualLeaderboard, usersLoading, usersError] = useCollectionData(userQuery, { idField: 'id' });
    const [teamLeaderboard, teamsLoading, teamsError] = useCollectionData(teamQuery, { idField: 'id' });
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    const loading = usersLoading || teamsLoading;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Leaderboard" />

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {(usersError || teamsError) && (
          <div className="p-4 text-red-500">
              {usersError && <p>Error loading individual leaderboard: {usersError.message}</p>}
              {teamsError && <p>Error loading team leaderboard: {teamsError.message}</p>}
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
                    {individualLeaderboard && (individualLeaderboard as User[]).map((user, index) => (
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
                    {teamLeaderboard && (teamLeaderboard as Team[]).map((team, index) => (
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

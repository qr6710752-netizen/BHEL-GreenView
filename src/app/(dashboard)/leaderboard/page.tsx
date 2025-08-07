import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award } from "lucide-react";

const individualLeaderboard = [
  { rank: 1, name: "Priya Singh", department: "Administration", points: 2450, avatar: "PS" },
  { rank: 2, name: "Ravi Sharma", department: "Maintenance", points: 2100, avatar: "RS" },
  { rank: 3, name: "Anil Kumar", department: "Facilities", points: 1850, avatar: "AK" },
  { rank: 4, name: "Sunita Gupta", department: "HR", points: 1600, avatar: "SG" },
  { rank: 5, name: "Vijay Verma", department: "Production", points: 1450, avatar: "VV" },
];

const teamLeaderboard = [
    { rank: 1, name: "Eco Warriors", points: 12500 },
    { rank: 2, name: "Green Giants", points: 11200 },
    { rank: 3, name: "Sustainability Squad", points: 9800 },
    { rank: 4, name: "Power Savers", points: 8500 },
    { rank: 5, name: "Waste Watchers", points: 7600 },
  ];

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-yellow-700" />;
  return <span className="text-sm font-medium w-5 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Leaderboard" />

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
                  {individualLeaderboard.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <RankIcon rank={user.rank} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" />
                            <AvatarFallback>{user.avatar}</AvatarFallback>
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
                  {teamLeaderboard.map((team) => (
                    <TableRow key={team.rank}>
                       <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <RankIcon rank={team.rank} />
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
    </main>
  );
}

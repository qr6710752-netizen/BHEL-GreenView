import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const leaderboard = [
  { name: "Priya Singh", points: 2450, avatar: "PS" },
  { name: "Ravi Sharma", points: 2100, avatar: "RS" },
  { name: "Anil Kumar", points: 1850, avatar: "AK" },
  { name: "Sunita Devi", points: 1700, avatar: "SD" },
  { name: "Vijay Rathod", points: 1550, avatar: "VR" },
];

export function LeaderboardCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle>Top Green Champions</CardTitle>
        <CardDescription>This month's top contributors.</CardDescription>
      </CardHeader>
      <CardContent>
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
                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture"/>
                <AvatarFallback>{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.points} pts</p>
              </div>
            </li>
          ))}
        </ul>
         <Button variant="link" className="p-0 h-auto mt-4" asChild>
          <Link href="/leaderboard">View full leaderboard</Link>
         </Button>
      </CardContent>
    </Card>
  );
}

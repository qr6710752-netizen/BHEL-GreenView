
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Power, Puzzle } from "lucide-react";
import Link from "next/link";

const games = [
    {
        title: "Eco-Quiz Challenge",
        description: "Test your sustainability knowledge and earn points!",
        href: "/games/eco-quiz",
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    },
    {
        title: "Energy Saver",
        description: "Turn off devices and save virtual energy!",
        href: "/games/energy-saver",
        icon: <Power className="h-8 w-8 text-primary" />,
    },
    {
        title: "Green Initiative Puzzle",
        description: "Match eco-actions to their benefits!",
        href: "/games/green-puzzle",
        icon: <Puzzle className="h-8 w-8 text-primary" />,
    }
]

export default function GamesPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Games & Challenges" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {games.map((game) => (
                <Link href={game.href} key={game.title}>
                    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                {game.icon}
                                <div>
                                    <CardTitle>{game.title}</CardTitle>
                                    <CardDescription>{game.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    </main>
  );
}

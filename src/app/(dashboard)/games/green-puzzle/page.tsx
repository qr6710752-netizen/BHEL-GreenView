
import { PageHeader } from "@/components/page-header";
import { GreenPuzzleGame } from "@/components/green-puzzle/green-puzzle-game";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GreenPuzzlePage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Green Initiative Puzzle" />
      </div>

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Puzzle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Connect the Concepts!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Match each eco-friendly action to its correct environmental benefit to score points. Test your knowledge and see how well you know your green initiatives!
        </Description>
      </Alert>

      <div className="mt-6">
        <GreenPuzzleGame />
      </div>
    </main>
  );
}

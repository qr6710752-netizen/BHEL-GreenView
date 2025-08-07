
import { PageHeader } from "@/components/page-header";
import { EcoQuizChallenge } from "@/components/eco-quiz/eco-quiz-challenge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EcoQuizPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Eco-Quiz Challenge" />
      </div>


      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Test Your Knowledge!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Answer the questions below to test your sustainability knowledge and earn points. Correct answers contribute to your leaderboard score!
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <EcoQuizChallenge />
      </div>
    </main>
  );
}

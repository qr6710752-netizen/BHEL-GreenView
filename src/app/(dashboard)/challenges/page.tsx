
import { PageHeader } from "@/components/page-header";
import { ChallengeList } from "@/components/challenges/challenge-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Target } from "lucide-react";

export default function ChallengesPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="Challenge Missions" />

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Target className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Complete Missions, Earn Rewards!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Take on weekly and monthly challenges to boost your sustainability impact and climb the leaderboard. Each completed mission earns you valuable points.
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <ChallengeList />
      </div>
    </main>
  );
}


import { PageHeader } from "@/components/page-header";
import { RecyclingRangerGame } from "@/components/recycling-ranger/recycling-ranger-game";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RecyclingRangerPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Recycling Ranger" />
      </div>

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Hand className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Be Quick!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Click on the recyclable items as they appear. Avoid clicking on the non-recyclable trash! You have 30 seconds to score as many points as possible.
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <RecyclingRangerGame />
      </div>
    </main>
  );
}

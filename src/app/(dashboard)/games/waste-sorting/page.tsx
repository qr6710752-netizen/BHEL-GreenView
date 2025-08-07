
import { PageHeader } from "@/components/page-header";
import { WasteSortingGame } from "@/components/waste-sorting/waste-sorting-game";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WasteSortingPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Waste Sorting Challenge" />
      </div>

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Recycle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Drag and Drop!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Drag each item into the correct bin (Recycling, Compost, or General Waste) to score points. Sorting correctly helps the environment!
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <WasteSortingGame />
      </div>
    </main>
  );
}

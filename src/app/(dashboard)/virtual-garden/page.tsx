
import { PageHeader } from "@/components/page-header";
import { VirtualGarden } from "@/components/virtual-garden/virtual-garden";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sprout } from "lucide-react";

export default function VirtualGardenPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="My Virtual Garden" />

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Sprout className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Watch Your Impact Grow!</AlertTitle>
        <AlertDescription className="text-primary/80">
          Earn points by participating in initiatives and playing games. For every 100 points you earn, a new tree is planted in your virtual garden!
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <VirtualGarden />
      </div>
    </main>
  );
}

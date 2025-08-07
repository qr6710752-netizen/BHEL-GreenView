import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageCircle, PlusCircle } from "lucide-react";

const initiatives = [
  {
    id: 1,
    title: "Install LED Lighting in Workshop A",
    author: "Ravi Sharma",
    department: "Maintenance",
    description: "Replacing all high-wattage sodium-vapor lamps with energy-efficient LEDs to reduce power consumption by an estimated 40%.",
    status: "In Progress",
    progress: 65,
    votes: 128,
    comments: 12,
  },
  {
    id: 2,
    title: "Paper Waste Reduction Program",
    author: "Priya Singh",
    department: "Administration",
    description: "Implementing double-sided printing by default and promoting digital documentation to cut down paper usage across all departments.",
    status: "Completed",
    progress: 100,
    votes: 215,
    comments: 25,
  },
  {
    id: 3,
    title: "Rainwater Harvesting for Landscaping",
    author: "Anil Kumar",
    department: "Facilities",
    description: "Setting up a rainwater harvesting system to collect and store rainwater for irrigating the green spaces around the facility.",
    status: "Proposed",
    progress: 0,
    votes: 95,
    comments: 8,
  },
];

export default function InitiativesPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Green Initiatives" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Suggestion
        </Button>
      </div>

      <div className="space-y-6 mt-6">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{initiative.title}</CardTitle>
              <CardDescription>
                Submitted by {initiative.author} ({initiative.department})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{initiative.description}</p>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{initiative.status}</span>
                  <span className="text-sm font-medium text-foreground">{initiative.progress}%</span>
                </div>
                <Progress value={initiative.progress} aria-label={`${initiative.title} progress`} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex gap-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{initiative.votes} Votes</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{initiative.comments} Comments</span>
                </Button>
              </div>
              <Button variant="outline">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}

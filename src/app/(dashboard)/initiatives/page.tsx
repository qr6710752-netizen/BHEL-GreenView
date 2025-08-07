
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, MessageCircle, PlusCircle, Loader2 } from "lucide-react";
import { collection, query, orderBy, Timestamp, where, getDoc, doc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "@/lib/firebase";
import { NewSuggestionDialog } from "@/components/initiatives/new-suggestion-dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Link from "next/link";

export type Initiative = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  department: string;
  description: string;
  status: "Proposed" | "In Progress" | "Completed";
  progress: number;
  votes: number;
  comments: number;
  createdAt: Timestamp;
};

const mockInitiatives: Initiative[] = [
    {
        id: '1',
        title: 'Switch to Renewable Energy Wind Power',
        author: 'Priya Singh',
        authorId: 'user001',
        department: 'Facilities',
        description: 'Proposal to switch our primary energy source to wind power by partnering with a local provider. This will significantly reduce our carbon footprint.',
        status: 'In Progress',
        progress: 60,
        votes: 152,
        comments: 18,
        createdAt: Timestamp.fromDate(new Date('2023-10-15T09:00:00')),
    },
    {
        id: '2',
        title: 'Paper Waste Reduction Initiative',
        author: 'Ravi Sharma',
        authorId: 'user002',
        department: 'Administration',
        description: 'A company-wide initiative to reduce paper consumption by 50% through promoting digital documents and double-sided printing.',
        status: 'Completed',
        progress: 100,
        votes: 210,
        comments: 25,
        createdAt: Timestamp.fromDate(new Date('2023-09-01T11:30:00')),
    },
    {
        id: '3',
        title: 'Company-Wide Recycling Program',
        author: 'Sunita Devi',
        authorId: 'user003',
        department: 'Operations',
        description: 'Implementing a comprehensive recycling program with designated bins for paper, plastic, glass, and e-waste across all floors.',
        status: 'In Progress',
        progress: 75,
        votes: 180,
        comments: 22,
        createdAt: Timestamp.fromDate(new Date('2023-11-05T14:00:00')),
    },
    {
        id: '4',
        title: 'Energy-Efficient Lighting Upgrade',
        author: 'Anil Kumar',
        authorId: 'user004',
        department: 'Maintenance',
        description: 'Replacing all conventional lighting fixtures with energy-efficient LED bulbs to lower electricity consumption.',
        status: 'Completed',
        progress: 100,
        votes: 195,
        comments: 15,
        createdAt: Timestamp.fromDate(new Date('2023-08-20T16:45:00')),
    },
    {
        id: '5',
        title: 'Water Conservation in Restrooms',
        author: 'Meena Kumari',
        authorId: 'user005',
        department: 'Human Resources',
        description: 'Installing low-flow faucets and toilets in all restrooms to conserve water, along with awareness posters.',
        status: 'Proposed',
        progress: 0,
        votes: 95,
        comments: 7,
        createdAt: Timestamp.fromDate(new Date('2023-11-10T10:15:00')),
    },
];


export default function InitiativesPage() {
  const [user] = useAuthState(auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const initiatives = mockInitiatives;
  const loading = false;
  const error = null;


  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Green Initiatives" />
        <NewSuggestionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Suggestion
            </Button>
        </NewSuggestionDialog>
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {!loading && initiatives && (
        <div className="space-y-6 mt-6">
          {(initiatives as Initiative[]).map((initiative) => (
            <Card key={initiative.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{initiative.title}</CardTitle>
                <CardDescription>
                  Submitted by {initiative.author} ({initiative.department})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{initiative.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{initiative.status}</span>
                    <span className="text-sm font-medium text-foreground">{initiative.progress || 0}%</span>
                  </div>
                  <Progress value={initiative.progress || 0} aria-label={`${initiative.title} progress`} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-4 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{initiative.votes || 0} Votes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{initiative.comments || 0} Comments</span>
                  </Button>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/initiatives/${initiative.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && initiatives?.length === 0 && (
        <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't submitted any initiatives yet.</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit Your First Suggestion
            </Button>
        </div>
      )}
    </main>
  );
}

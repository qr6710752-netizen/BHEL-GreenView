
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, MessageCircle, PlusCircle, Loader2 } from "lucide-react";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";

type Initiative = {
  id: string;
  title: string;
  author: string;
  department: string;
  description: string;
  status: "Proposed" | "In Progress" | "Completed";
  progress: number;
  votes: number;
  comments: number;
};

export default function InitiativesPage() {
  const initiativesRef = collection(db, "suggestions");
  const q = query(initiativesRef, orderBy("title"));
  const [initiatives, loading, error] = useCollectionData(q, {
    idField: 'id',
  });

  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Green Initiatives" />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Suggestion
        </Button>
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
      )}
    </main>
  );
}

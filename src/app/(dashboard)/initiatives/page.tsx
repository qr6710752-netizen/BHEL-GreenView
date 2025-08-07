
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, MessageCircle, PlusCircle, Loader2 } from "lucide-react";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "@/lib/firebase";
import { NewSuggestionDialog } from "@/components/initiatives/new-suggestion-dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
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


export default function InitiativesPage() {
  const [user] = useAuthState(auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const initiativesRef = collection(db, "suggestions");
  const initiativesQuery = query(initiativesRef, orderBy("createdAt", "desc"));
  const [initiativesSnapshot, loading, error] = useCollection(initiativesQuery);

  const initiatives = initiativesSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Initiative));

  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Green Initiatives" />
        <NewSuggestionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => setIsDialogOpen(true)} disabled={!user}>
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

      {!loading && initiatives && initiatives.length > 0 && (
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
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{initiative.votes || 0} Votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{initiative.comments || 0} Comments</span>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/initiatives/${initiative.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && (!initiatives || initiatives.length === 0) && (
        <div className="text-center py-12">
            <p className="text-muted-foreground">No initiatives have been submitted yet.</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)} disabled={!user}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit the First Suggestion
            </Button>
        </div>
      )}
    </main>
  );
}

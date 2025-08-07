
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Loader2, ThumbsUp, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Initiative } from "../page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function InitiativeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const initiativeId = Array.isArray(id) ? id[0] : id;

  const [initiative, loading, error] = useDocumentData(
    doc(db, "suggestions", initiativeId)
  );

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <p className="text-destructive">Error: {error.message}</p>
        <Button onClick={() => router.push('/initiatives')} variant="link" className="mt-4">
          Go Back
        </Button>
      </main>
    );
  }
  
  if (!initiative) {
    return (
       <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <p>Initiative not found.</p>
        <Button onClick={() => router.push('/initiatives')} variant="link" className="mt-4">
          Go Back
        </Button>
      </main>
    )
  }

  const { title, description, author, department, status, votes, comments, createdAt } = initiative as Initiative;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Initiative Details" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{title}</CardTitle>
                    <CardDescription>
                      Submitted by {author} ({department}) on {createdAt?.toDate().toLocaleDateString()}
                    </CardDescription>
                  </div>
                   <Badge
                    variant={
                      status === "Completed"
                        ? "default"
                        : status === "In Progress"
                        ? "secondary"
                        : "outline"
                    }
                    className={`text-sm ${status === "Completed" ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    {status}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
            </CardContent>
            <CardFooter>
                 <div className="flex gap-4 text-muted-foreground">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{votes || 0} Upvote</span>
                  </Button>
                </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Comment submission form */}
                <div className="space-y-2">
                   <Label htmlFor="new-comment">Leave a comment</Label>
                   <Textarea id="new-comment" placeholder="Share your thoughts..." />
                   <Button size="sm">Submit Comment</Button>
                </div>

                <Separator />
                
                {/* Placeholder for comments list */}
                 <div className="space-y-4">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="profile picture"/>
                            <AvatarFallback>SU</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Sample User</p>
                            <p className="text-sm text-muted-foreground">This is a great idea! I think it will save a lot of energy.</p>
                        </div>
                    </div>
                     <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="profile picture"/>
                            <AvatarFallback>AU</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Another User</p>
                            <p className="text-sm text-muted-foreground">We tried something similar in our department and it worked well.</p>
                        </div>
                    </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

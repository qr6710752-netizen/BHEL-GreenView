
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
import { arrayUnion, doc, getDoc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { ArrowLeft, Loader2, ThumbsUp, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Initiative } from "../page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";


type Comment = {
    text: string;
    author: string;
    authorId: string;
    createdAt: any;
};

export default function InitiativeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const initiativeId = Array.isArray(id) ? id[0] : id;
  const { toast } = useToast();
  const [user] = useAuthState(auth);

  const initiativeRef = doc(db, "suggestions", initiativeId);
  const [initiative, loading, error] = useDocumentData(initiativeRef);
  
  const commentsRef = collection(db, "suggestions", initiativeId, "comments");
  const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
  const [comments, commentsLoading, commentsError] = useCollection(commentsQuery);

  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  

  const handleUpvote = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "You must be logged in to vote." });
        return;
    }
    setIsVoting(true);
    try {
        await updateDoc(initiativeRef, {
            votes: increment(1),
            voters: arrayUnion(user.uid)
        });
        toast({ title: "Vote submitted!" });
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error submitting vote", description: e.message });
    } finally {
        setIsVoting(false);
    }
  };

  const handleCommentSubmit = async () => {
      if (!user) {
        toast({ variant: "destructive", title: "You must be logged in to comment." });
        return;
      }
      if (!newComment.trim()) {
          toast({ variant: "destructive", title: "Comment cannot be empty."});
          return;
      }
      setIsSubmittingComment(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        await addDoc(commentsRef, {
            text: newComment,
            author: userData?.name || "Anonymous",
            authorId: user.uid,
            createdAt: serverTimestamp()
        });

        await updateDoc(initiativeRef, {
            comments: increment(1)
        });
        
        setNewComment("");
        toast({ title: "Comment submitted!" });
      } catch(e: any) {
         toast({ variant: "destructive", title: "Error submitting comment", description: e.message });
      } finally {
          setIsSubmittingComment(false);
      }
  };
  
  const hasVoted = initiative?.voters?.includes(user?.uid);


  if (loading || commentsLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  if (error || commentsError) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <p className="text-destructive">Error: {error?.message || commentsError?.message}</p>
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

  const { title, description, author, department, status, votes, createdAt } = initiative as Initiative;

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
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleUpvote} disabled={isVoting || hasVoted}>
                    {isVoting ? <Loader2 className="h-4 w-4 animate-spin"/> : <ThumbsUp className="h-4 w-4" />}
                    <span>{votes || 0} {hasVoted ? 'Upvoted' : 'Upvote'}</span>
                  </Button>
                </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Comments ({initiative.comments || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Comment submission form */}
                <div className="space-y-2">
                   <Label htmlFor="new-comment">Leave a comment</Label>
                   <Textarea id="new-comment" placeholder="Share your thoughts..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={isSubmittingComment} />
                   <Button size="sm" onClick={handleCommentSubmit} disabled={isSubmittingComment}>
                    {isSubmittingComment && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Submit Comment
                   </Button>
                </div>

                <Separator />
                
                 <div className="space-y-4">
                    {comments && comments.docs.map(commentDoc => {
                        const comment = commentDoc.data() as Comment;
                        const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

                        return (
                            <div className="flex gap-3" key={commentDoc.id}>
                                <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture"/>
                                    <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{comment.author}</p>
                                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {comment.createdAt?.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                     {!comments?.docs.length && (
                        <p className="text-sm text-center text-muted-foreground py-4">Be the first to comment!</p>
                     )}
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

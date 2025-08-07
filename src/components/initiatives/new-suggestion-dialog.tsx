
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { analyzeInitiative, AnalyzeInitiativeOutput } from '@/ai/flows/analyze-initiative';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
});

type NewSuggestionDialogProps = {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewSuggestionDialog({ children, open, onOpenChange }: NewSuggestionDialogProps) {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeInitiativeOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  
  const handleAnalyze = async () => {
    const { title, description } = form.getValues();
    if (!title || !description) {
        toast({
            variant: "destructive",
            title: "Title and description required",
            description: "Please fill out the title and description before analyzing.",
        });
        return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeInitiative({ title, description });
        setAnalysisResult(result);
    } catch(e: any) {
        toast({ variant: "destructive", title: "Analysis failed", description: e.message });
    } finally {
        setIsAnalyzing(false);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to submit a suggestion.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        let descriptionWithAnalysis = values.description;
        if (analysisResult) {
            descriptionWithAnalysis += `\n\n--- AI Analysis ---\n`;
            descriptionWithAnalysis += `Potential Impact: ${analysisResult.impact}\n`;
            descriptionWithAnalysis += `Potential Benefits:\n- ${analysisResult.benefits.join('\n- ')}\n`;
            descriptionWithAnalysis += `Suggested Metrics:\n- ${analysisResult.metrics.join('\n- ')}\n`;
        }


        await addDoc(collection(db, 'suggestions'), {
            title: values.title,
            description: descriptionWithAnalysis,
            author: userData?.name || user.displayName || 'Anonymous',
            authorId: user.uid,
            department: userData?.department || 'Unassigned',
            status: 'Proposed',
            votes: 0,
            comments: 0,
            progress: 0,
            createdAt: serverTimestamp(),
            ...(analysisResult && { analysis: analysisResult }) // Store structured data too
        });
        
        // Award points to the user for submitting an idea
        await updateDoc(userRef, {
            points: increment(10)
        });

        toast({
            title: 'Suggestion Submitted!',
            description: 'Thank you for your contribution. You have earned 10 points!',
        });
        form.reset();
        setAnalysisResult(null);
        onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        form.reset();
        setAnalysisResult(null);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a Green Initiative</DialogTitle>
          <DialogDescription>
            Share your idea to help us become more sustainable.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiative Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Reduce paper usage in the office" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your idea, its potential impact, and how it could be implemented."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div>
                 <Button type="button" variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                    Analyze Idea with AI
                 </Button>
            </div>
            
            {analysisResult && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center text-primary text-lg">
                           <Sparkles className="mr-2 h-5 w-5"/> AI Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                       <div>
                         <p className="font-semibold">Potential Impact</p>
                         <Badge 
                            variant={analysisResult.impact === 'High' ? 'default' : 'secondary'}
                            className={analysisResult.impact === 'High' ? 'bg-primary text-primary-foreground' : ''}
                         >
                            {analysisResult.impact}
                        </Badge>
                       </div>
                       <div>
                          <p className="font-semibold">Potential Benefits</p>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {analysisResult.benefits.map(b => <li key={b}>{b}</li>)}
                          </ul>
                       </div>
                        <div>
                          <p className="font-semibold">Suggested Metrics</p>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {analysisResult.metrics.map(m => <li key={m}>{m}</li>)}
                          </ul>
                       </div>
                    </CardContent>
                </Card>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Idea
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

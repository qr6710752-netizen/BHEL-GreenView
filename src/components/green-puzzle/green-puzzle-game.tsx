
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, Check, Shuffle } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const puzzleItems = [
  { action: "Using LED bulbs", benefit: "Reduces electricity consumption" },
  { action: "Double-sided printing", benefit: "Cuts paper waste in half" },
  { action: "Fixing leaky faucets", benefit: "Saves thousands of liters of water annually" },
  { action: "Powering down computers at night", benefit: "Lowers phantom energy load" },
  { action: "Using reusable coffee cups", benefit: "Decreases single-use plastic waste" },
];

const POINTS_PER_CORRECT_ANSWER = 10;

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function GreenPuzzleGame() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [shuffledBenefits, setShuffledBenefits] = useState<string[]>([]);
  
  useEffect(() => {
    if (gameState === 'running') {
      const benefits = puzzleItems.map(item => item.benefit);
      setShuffledBenefits(shuffleArray(benefits));
    }
  }, [gameState]);


  const startGame = () => {
    setAnswers({});
    setFinalScore(0);
    setGameState('running');
  };
  
  const handleSelectChange = (action: string, benefit: string) => {
    setAnswers(prev => ({ ...prev, [action]: benefit }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let score = 0;
    for (const item of puzzleItems) {
      if (answers[item.action] === item.benefit) {
        score += POINTS_PER_CORRECT_ANSWER;
      }
    }
    setFinalScore(score);

    if (user && score > 0) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(score)
        });
        toast({ title: 'Puzzle Submitted!', description: `You've earned ${score} points!` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving score', description: error.message });
      }
    } else if (score === 0) {
        toast({ title: 'Puzzle Submitted!', description: "No points earned this time. Try again!" });
    }

    setGameState('finished');
    setIsSubmitting(false);
  };
  
  if (gameState === 'idle') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Green Initiative Puzzle</CardTitle>
                <CardDescription>Match the actions to their benefits.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p>Ready to test your knowledge?</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={startGame} className="w-full">
                    Start Puzzle
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (gameState === 'finished') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Puzzle Complete!</CardTitle>
                <CardDescription>Here's how you did.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-2xl font-bold">Your Score: {finalScore}</p>
                 {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mt-2" />
                ) : (
                    <p className="text-muted-foreground">Your points have been added to the leaderboard.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={startGame} className="w-full">
                    Play Again
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
         <CardTitle>Match the Action to the Benefit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {puzzleItems.map(item => (
          <div key={item.action} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label className="font-semibold">{item.action}</Label>
            <Select onValueChange={(value) => handleSelectChange(item.action, value)} value={answers[item.action] || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a benefit..." />
              </SelectTrigger>
              <SelectContent>
                {shuffledBenefits.map(benefit => (
                  <SelectItem key={benefit} value={benefit}>{benefit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length < puzzleItems.length} className="w-full">
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
           Submit Answers
        </Button>
      </CardFooter>
    </Card>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, Trash2, Leaf, Recycle, Check, X } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

type Item = {
  name: string;
  type: 'recycling' | 'compost' | 'general';
};

const ITEMS: Item[] = [
  { name: 'Plastic Bottle', type: 'recycling' },
  { name: 'Apple Core', type: 'compost' },
  { name: 'Paper Cup', type: 'general' },
  { name: 'Newspaper', type: 'recycling' },
  { name: 'Banana Peel', type: 'compost' },
  { name: 'Chip Bag', type: 'general' },
  { name: 'Aluminum Can', type: 'recycling' },
  { name: 'Egg Shells', type: 'compost' },
  { name: 'Styrofoam', type: 'general' },
];

const BINS = [
  { name: 'Recycling', type: 'recycling', icon: Recycle },
  { name: 'Compost', type: 'compost', icon: Leaf },
  { name: 'General Waste', type: 'general', icon: Trash2 },
];

const POINTS_PER_CORRECT_SORT = 10;

// Simple shuffle function
const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export function WasteSortingGame() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [items, setItems] = useState<Item[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (gameState === 'running') {
      setItems(shuffle(ITEMS));
      setCurrentItemIndex(0);
      setScore(0);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('running');
  };

  const handleDrop = async (binType: 'recycling' | 'compost' | 'general') => {
    if (feedback) return;

    const currentItem = items[currentItemIndex];
    if (currentItem.type === binType) {
      setScore(prev => prev + POINTS_PER_CORRECT_SORT);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    
    setTimeout(() => {
        setFeedback(null);
        if (currentItemIndex < items.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        } else {
            finishGame(currentItem.type === binType);
        }
    }, 1000);

  };

  const finishGame = async (wasLastCorrect: boolean) => {
    setGameState('finished');
    setIsSubmitting(true);
    const finalScore = score + (wasLastCorrect ? POINTS_PER_CORRECT_SORT : 0);
    
    if (user && finalScore > 0) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(finalScore)
        });
        toast({ title: 'Game Over!', description: `You've earned ${finalScore} points!` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving score', description: error.message });
      }
    }
    setScore(finalScore);
    setIsSubmitting(false);
  };
  
  if (gameState === 'idle') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Waste Sorting Challenge</CardTitle>
                <CardDescription>Sort the items into the correct bins to earn points.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p>Are you a sorting champion?</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={startGame} className="w-full">
                    Start Game
                </Button>
            </CardFooter>
        </Card>
    );
  }
  
  if (gameState === 'finished') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Over!</CardTitle>
                <CardDescription>Here's your score.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-2xl font-bold">Your Score: {score}</p>
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

  const currentItem = items[currentItemIndex];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
             <CardTitle>Sort the Item</CardTitle>
             <div className="text-right">
                <p className="font-bold text-2xl text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Score</p>
             </div>
        </div>
        <CardDescription>Item {currentItemIndex + 1} of {items.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("text-center p-8 mb-6 border-2 border-dashed rounded-lg text-lg font-semibold transition-colors", 
            feedback === 'correct' && 'bg-green-100 border-green-500 text-green-700',
            feedback === 'incorrect' && 'bg-red-100 border-red-500 text-red-700'
        )}>
            {currentItem?.name}
             {feedback === 'correct' && <Check className="inline-block ml-2 h-6 w-6" />}
             {feedback === 'incorrect' && <X className="inline-block ml-2 h-6 w-6" />}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {BINS.map(bin => {
            const BinIcon = bin.icon;
            return (
              <Button
                key={bin.type}
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => handleDrop(bin.type)}
                disabled={!!feedback}
              >
                <BinIcon className="h-8 w-8 text-primary" />
                <span>{bin.name}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, Computer, Lightbulb, Plug } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

const GAME_DURATION = 30; // seconds
const GRID_SIZE = 16;
const ICONS = [Computer, Lightbulb, Plug];

type GameItem = {
  id: number;
  icon: React.ElementType;
  on: boolean;
};

function generateInitialGrid(): GameItem[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    icon: ICONS[Math.floor(Math.random() * ICONS.length)],
    on: Math.random() > 0.5,
  }));
}

export function EnergySaverGame() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [grid, setGrid] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'running' && timeLeft === 0) {
      finishGame();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGrid(generateInitialGrid());
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('running');
  };

  const finishGame = useCallback(async () => {
    setGameState('finished');
    setIsSubmitting(true);
    if (user && score > 0) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(score)
        });
        toast({ title: 'Game Over!', description: `You've earned ${score} points!` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving score', description: error.message });
      }
    }
    setIsSubmitting(false);
  }, [user, score, toast]);

  const handleItemClick = (id: number) => {
    if (gameState !== 'running') return;

    const newGrid = [...grid];
    const item = newGrid.find(item => item.id === id);

    if (item && item.on) {
      item.on = false;
      setGrid(newGrid);
      setScore(prev => prev + 10);
    }
  };

  if (gameState === 'idle') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Energy Saver Challenge</CardTitle>
                <CardDescription>Turn off as many devices as you can in {GAME_DURATION} seconds.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p>Ready to save some energy?</p>
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
                <CardDescription>Here's how you did.</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
             <CardTitle>Turn them off!</CardTitle>
             <div className="text-right">
                <p className="font-bold text-2xl text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Score</p>
             </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
            {grid.map(item => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={cn(
                            "flex justify-center items-center aspect-square rounded-lg border transition-colors",
                            item.on ? "bg-yellow-300/50 border-yellow-500 text-yellow-800 shadow-lg" : "bg-muted text-muted-foreground",
                            "hover:bg-muted/50"
                        )}
                        disabled={!item.on}
                    >
                       <Icon className="h-8 w-8" />
                    </button>
                )
            })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
         <p className="text-lg font-bold">Time Left: <span className="text-primary">{timeLeft}s</span></p>
      </CardFooter>
    </Card>
  );
}

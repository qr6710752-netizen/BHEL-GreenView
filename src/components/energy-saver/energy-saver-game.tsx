
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, Computer, Lightbulb, Plug, Zap } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

const GAME_DURATION = 30; // seconds
const GRID_SIZE = 16;
const ICONS = [Computer, Lightbulb, Plug];

const LEVELS = {
  easy: { name: 'Easy', interval: 1500 }, // ms
  medium: { name: 'Medium', interval: 1000 },
  hard: { name: 'Hard', interval: 600 },
};

type Level = keyof typeof LEVELS;

type GameItem = {
  id: number;
  icon: React.ElementType;
  on: boolean;
};

function generateInitialGrid(): GameItem[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    icon: ICONS[Math.floor(Math.random() * ICONS.length)],
    on: Math.random() > 0.7, // Start with fewer items on
  }));
}

export function EnergySaverGame() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'level-select' | 'running' | 'finished'>('level-select');
  const [level, setLevel] = useState<Level>('medium');
  const [grid, setGrid] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Game loop for turning items on
  useEffect(() => {
    if (gameState !== 'running') return;

    const gameInterval = setInterval(() => {
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            const offItems = newGrid.filter(item => !item.on);
            if (offItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * offItems.length);
                const itemToTurnOn = offItems[randomIndex];
                const itemInGrid = newGrid.find(item => item.id === itemToTurnOn.id);
                if(itemInGrid) {
                    itemInGrid.on = true;
                }
            }
            return newGrid;
        });
    }, LEVELS[level].interval);

    return () => clearInterval(gameInterval);
  }, [gameState, level]);
  
  // Countdown timer
  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'running' && timeLeft === 0) {
      finishGame();
    }
  }, [gameState, timeLeft]);

  const selectLevel = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setGameState('idle');
  }

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
        toast({ title: 'Game Over!', description: `You've earned ${score} points for your efforts!` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving score', description: error.message });
      }
    } else if (score === 0) {
        toast({ title: 'Game Over!', description: "No points earned this time. Better luck next time!" });
    }
    setIsSubmitting(false);
  }, [user, score, toast]);

  const handleItemClick = (id: number) => {
    if (gameState !== 'running') return;

    setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        const item = newGrid.find(item => item.id === id);

        if (item && item.on) {
            item.on = false;
            setScore(prev => prev + 10);
        }
        return newGrid;
    });
  };

  if (gameState === 'level-select') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Difficulty</CardTitle>
                <CardDescription>Choose a level to begin the challenge.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Object.keys(LEVELS).map(key => (
                    <Button key={key} onClick={() => selectLevel(key as Level)} variant="outline">
                        {LEVELS[key as Level].name}
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
  }

  if (gameState === 'idle') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Energy Saver Challenge: <span className="text-primary">{LEVELS[level].name}</span></CardTitle>
                <CardDescription>Turn off as many devices as you can in {GAME_DURATION} seconds.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
                <Zap className="h-16 w-16 text-yellow-400 mx-auto" />
                <p className="mt-4 text-lg">Ready to save some energy?</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <Button onClick={startGame} className="w-full">
                    Start Game
                </Button>
                 <Button onClick={() => setGameState('level-select')} variant="ghost">
                    Change Level
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
                <CardDescription>You played on <span className="font-bold">{LEVELS[level].name}</span> difficulty.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-2xl font-bold">Your Score: {score}</p>
                 {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mt-2 text-muted-foreground" />
                ) : (
                    <p className="text-muted-foreground">Your points have been added to your total.</p>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                 <Button onClick={startGame} className="w-full">
                    Play Again
                </Button>
                 <Button onClick={() => setGameState('level-select')} className="w-full" variant="outline">
                    Change Level
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
             <div>
                <CardTitle>Turn them off!</CardTitle>
                <CardDescription>Level: {LEVELS[level].name}</CardDescription>
             </div>
             <div className="flex gap-6 text-center">
                <div>
                    <p className="font-bold text-3xl text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                </div>
                 <div>
                    <p className="font-bold text-3xl text-primary">{timeLeft}</p>
                    <p className="text-sm text-muted-foreground">Time Left</p>
                </div>
             </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
            {grid.map(item => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={cn(
                            "flex justify-center items-center aspect-square rounded-lg border-2 transition-all duration-150",
                            item.on 
                                ? "bg-yellow-300/50 border-yellow-500 text-yellow-800 shadow-lg scale-105" 
                                : "bg-muted text-muted-foreground scale-100",
                            "hover:bg-muted/50"
                        )}
                        disabled={!item.on}
                        aria-label={`Device ${item.id} is ${item.on ? 'on' : 'off'}`}
                    >
                       <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </button>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}

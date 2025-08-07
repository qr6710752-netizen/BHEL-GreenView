
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, Recycle, Trash2 } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

const GAME_DURATION = 30; // seconds
const GRID_SIZE = 9;

type ItemType = 'recyclable' | 'trash' | 'empty';

type GridItem = {
  id: number;
  type: ItemType;
};

export function RecyclingRangerGame() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Grid
  useEffect(() => {
    setGrid(Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, type: 'empty' })));
  }, []);

  // Game loop timer
  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'running' && timeLeft === 0) {
      finishGame();
    }
  }, [gameState, timeLeft]);

  // Item appearance loop
  useEffect(() => {
     if (gameState !== 'running') return;
     
     const interval = setInterval(() => {
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            // Reset one old item
            const oldItemIndex = newGrid.findIndex(item => item.type !== 'empty');
            if (oldItemIndex !== -1) {
                newGrid[oldItemIndex].type = 'empty';
            }
            
            // Add one new item
            const emptyCells = newGrid.map((item, index) => item.type === 'empty' ? index : -1).filter(index => index !== -1);
            if (emptyCells.length > 0) {
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                newGrid[randomIndex].type = Math.random() > 0.4 ? 'recyclable' : 'trash';
            }
            return newGrid;
        });
     }, 800);

     return () => clearInterval(interval);

  }, [gameState]);


  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('running');
  };

  const finishGame = useCallback(async () => {
    setGameState('finished');
    setGrid(Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, type: 'empty' }))); // Clear grid
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

  const handleItemClick = (item: GridItem) => {
    if (gameState !== 'running' || item.type === 'empty') return;

    if (item.type === 'recyclable') {
        setScore(prev => prev + 10);
    } else { // trash
        setScore(prev => prev - 5);
    }
    
    // Clear the clicked item immediately
    setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        const clickedIndex = newGrid.findIndex(i => i.id === item.id);
        if (clickedIndex !== -1) {
            newGrid[clickedIndex].type = 'empty';
        }
        return newGrid;
    });
  };

  if (gameState === 'idle') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recycling Ranger</CardTitle>
                <CardDescription>Click the recyclable items as they pop up!</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p>Ready to be a ranger?</p>
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
                <CardDescription>Well done, Ranger!</CardDescription>
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
             <div>
                <CardTitle>Click the Recyclables!</CardTitle>
                <p className="text-lg font-bold">Time Left: <span className="text-primary">{timeLeft}s</span></p>
            </div>
             <div className="text-right">
                <p className="font-bold text-2xl text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Score</p>
             </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
            {grid.map(item => (
                <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                        "flex justify-center items-center aspect-square rounded-lg border-2 transition-colors cursor-pointer",
                        item.type === 'empty' && "bg-muted hover:bg-muted/80",
                        item.type === 'recyclable' && "bg-green-100 border-green-400",
                        item.type === 'trash' && "bg-red-100 border-red-400",
                    )}
                >
                   {item.type === 'recyclable' && <Recycle className="h-10 w-10 text-green-600" />}
                   {item.type === 'trash' && <Trash2 className="h-10 w-10 text-red-600" />}
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

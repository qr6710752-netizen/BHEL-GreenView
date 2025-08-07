
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Award } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

const quizQuestions = [
  {
    question: "Which of the following is a renewable energy source?",
    options: ["Natural Gas", "Coal", "Solar Power", "Uranium"],
    answer: "Solar Power",
    points: 10,
  },
  {
    question: "What is the most effective way to reduce paper waste in an office?",
    options: ["Printing single-sided", "Using smaller fonts", "Promoting digital documents", "Recycling paper"],
    answer: "Promoting digital documents",
    points: 10,
  },
  {
    question: "Turning off your computer when not in use saves how much energy compared to leaving it in sleep mode?",
    options: ["1-5%", "10-20%", "30-40%", "60-70%"],
    answer: "60-70%",
    points: 15,
  },
  {
    question: "What does the 'e' in 'e-waste' stand for?",
    options: ["Environmental", "Effective", "Electronic", "Essential"],
    answer: "Electronic",
    points: 5,
  },
  {
    question: "Which type of light bulb is the most energy-efficient?",
    options: ["Incandescent", "Halogen", "Compact Fluorescent (CFL)", "Light Emitting Diode (LED)"],
    answer: "Light Emitting Diode (LED)",
    points: 10,
  },
];

export function EcoQuizChallenge() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  const handleNext = async () => {
    if (!selectedOption) {
      toast({ variant: 'destructive', title: 'Please select an answer.' });
      return;
    }
    
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }
    
    // Wait for a moment to show feedback
    setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    }, 1500);
  };
  
  const finishQuiz = async () => {
      setIsSubmitting(true);
      let finalScore = score;
      if (isCorrect) {
        finalScore += currentQuestion.points;
      }

      if (user) {
          try {
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, {
                  points: increment(finalScore)
              });
              toast({ title: 'Quiz Completed!', description: `You've earned ${finalScore} points!` });
          } catch (error: any) {
              toast({ variant: 'destructive', title: 'Error saving score', description: error.message });
          }
      }
      setScore(finalScore);
      setIsFinished(true);
      setIsSubmitting(false);
  }

  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setIsFinished(false);
  }

  if (isFinished) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Completed!</CardTitle>
                <CardDescription>Thanks for playing.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-2xl font-bold">Your Final Score: {score}</p>
                <p className="text-muted-foreground">Your points have been added to the leaderboard.</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleRestart} className="w-full">
                    Play Again
                </Button>
            </CardFooter>
        </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1}/{quizQuestions.length}</CardTitle>
        <CardDescription>{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption || ''}
          onValueChange={setSelectedOption}
          className="space-y-4"
          disabled={showFeedback}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const feedbackClass = showFeedback && isSelected
              ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
              : '';
              
            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={cn("flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors", feedbackClass)}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <span>{option}</span>
                {showFeedback && isSelected && (
                    isCorrect 
                        ? <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                        : <XCircle className="ml-auto h-5 w-5 text-red-600" />
                )}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Points for this question: {currentQuestion.points}</p>
        <Button onClick={handleNext} disabled={showFeedback || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}

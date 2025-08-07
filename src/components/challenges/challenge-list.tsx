
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const challengeMissions = [
  {
    id: 'mission1',
    title: 'Weekly Energy Saver',
    description: 'Reduce your department\'s average daily energy consumption by 5% this week.',
    points: 50,
    type: 'weekly',
    progress: 60,
    status: 'in-progress',
  },
  {
    id: 'mission2',
    title: 'Green Commuter',
    description: 'Use public transport, carpool, or cycle to work at least 3 times this week.',
    points: 30,
    type: 'weekly',
    progress: 0,
    status: 'not-started',
  },
  {
    id: 'mission3',
    title: 'Zero Waste Lunch',
    description: 'Have a lunch with zero disposable waste (no plastic containers, bags, or single-use cutlery) for a whole week.',
    points: 40,
    type: 'weekly',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'mission4',
    title: 'Suggestion Box Contributor',
    description: 'Submit at least two new, actionable green initiatives through the suggestion portal this month.',
    points: 100,
    type: 'monthly',
    progress: 50,
    status: 'in-progress',
  },
  {
    id: 'mission5',
    title: 'Eco-Knowledge Champion',
    description: 'Achieve a perfect score on the Eco-Quiz Challenge.',
    points: 25,
    type: 'ongoing',
    progress: 0,
    status: 'not-started',
  }
];

export function ChallengeList() {
    const { toast } = useToast();

    const handleClaimReward = (missionId: string) => {
        // In a real app, you'd verify completion and update user points in Firestore
        const mission = challengeMissions.find(m => m.id === missionId);
        if (mission) {
            toast({
                title: 'Reward Claimed!',
                description: `You have earned ${mission.points} points for completing the "${mission.title}" mission.`,
            });
            // Here you would typically update the mission status in the backend
        }
    };


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {challengeMissions.map((mission) => (
        <Card key={mission.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{mission.title}</CardTitle>
              <Badge variant={
                mission.type === 'weekly' ? 'secondary' 
                : mission.type === 'monthly' ? 'outline' 
                : 'default'
              } className={mission.type === 'ongoing' ? 'bg-primary/20 text-primary border-primary/20' : ''}>
                {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}
              </Badge>
            </div>
            <CardDescription>{mission.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
                 {mission.status === 'completed' ? (
                   <CheckCircle className="h-4 w-4 text-green-500" />
                 ) : (
                   <Clock className="h-4 w-4 text-muted-foreground" />
                 )}
                <p className="text-sm text-muted-foreground">
                    Status: <span className="font-semibold capitalize">{mission.status.replace('-', ' ')}</span>
                </p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium">Progress</p>
                <Progress value={mission.progress} />
             </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{mission.points} Points</span>
             </div>

            <Button
              size="sm"
              onClick={() => handleClaimReward(mission.id)}
              disabled={mission.status !== 'completed'}
            >
              Claim Reward
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

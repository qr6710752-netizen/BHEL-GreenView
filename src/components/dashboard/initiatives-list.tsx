
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

type Initiative = {
  id: string;
  title: string;
  department: string;
  status: "Proposed" | "In Progress" | "Completed";
};

export function InitiativesList() {
  const initiativesRef = collection(db, "suggestions");
  const initiativesQuery = query(initiativesRef, orderBy("createdAt", "desc"), limit(5));
  const [initiativesSnapshot, loading, error] = useCollection(initiativesQuery);

  const initiatives = initiativesSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Initiative));

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle>Recent Green Initiatives</CardTitle>
        <CardDescription>
          Latest employee-driven suggestions and projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        {!loading && initiatives && (
            <ul className="space-y-4">
            {initiatives.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.department}</p>
                </div>
                <Badge
                    variant={
                    item.status === "Completed"
                        ? "default"
                        : item.status === "In Progress"
                        ? "secondary"
                        : "outline"
                    }
                    className={item.status === "Completed" ? "bg-primary text-primary-foreground" : ""}
                >
                    {item.status}
                </Badge>
                </li>
            ))}
            </ul>
        )}
         {!loading && (!initiatives || initiatives.length === 0) && (
            <p className="text-sm text-center text-muted-foreground py-4">No recent initiatives.</p>
         )}
        <Button variant="link" className="p-0 h-auto mt-4" asChild>
          <Link href="/initiatives">View all initiatives</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

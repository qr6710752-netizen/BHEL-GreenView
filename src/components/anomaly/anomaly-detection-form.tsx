"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  detectAnomalies,
  type DetectAnomaliesOutput,
} from "@/ai/flows/detect-anomalies";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  metricsData: z.string().min(10, {
    message: "Metrics data must be at least 10 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
});

export function AnomalyDetectionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectAnomaliesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metricsData: "22, 21, 23, 22, 25, 24, 23, 22, 24, 23, 55, 24, 25, 26, 25",
      description: "Daily electricity consumption in MWh for Unit A over the last 15 days.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await detectAnomalies(values);
      setResult(analysisResult);
    } catch (error) {
      console.error("Anomaly detection failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform anomaly detection. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Analyze Metrics Data</CardTitle>
          <CardDescription>
            Enter the time-series data and a brief description for context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="metricsData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metrics Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 22, 21, 23, 22, 25, 24..."
                        className="min-h-[120px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated numerical values representing the time-series data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Daily energy consumption in kWh" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide context for the data (e.g., units, time frame, source).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Data
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Analysis Result
              <Badge variant={result.hasAnomalies ? "destructive" : "default"} className={!result.hasAnomalies ? 'bg-primary text-primary-foreground' : ''}>
                {result.hasAnomalies ? <ShieldAlert className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                {result.hasAnomalies ? "Anomalies Detected" : "No Anomalies Found"}
              </Badge>
            </CardTitle>
            <CardDescription>
              The AI model has completed the analysis of the provided data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Summary:</p>
            <p className="font-medium">{result.anomaliesSummary}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

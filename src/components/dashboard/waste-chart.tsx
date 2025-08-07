
"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
    { category: "Paper/Cardboard", weight: 450 },
    { category: "Plastics", weight: 320 },
    { category: "Organic Waste", weight: 280 },
    { category: "Glass", weight: 150 },
    { category: "Metal", weight: 120 },
    { category: "E-Waste", weight: 90 },
    { category: "Other", weight: 75 },
  ];
  
  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;

export function WasteChart() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Waste Generation by Type</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="weight" fill="var(--color-weight)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

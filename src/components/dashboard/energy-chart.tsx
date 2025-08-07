"use client";

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts";
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
  { month: "Jan", usage: 4000 },
  { month: "Feb", usage: 3000 },
  { month: "Mar", usage: 2000 },
  { month: "Apr", usage: 2780 },
  { month: "May", usage: 1890 },
  { month: "Jun", usage: 2390 },
  { month: "Jul", usage: 3490 },
];

const chartConfig = {
  usage: {
    label: "kWh",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function EnergyChart() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Energy Consumption Overview</CardTitle>
        <CardDescription>Last 7 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="usage"
              type="monotone"
              stroke="var(--color-usage)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

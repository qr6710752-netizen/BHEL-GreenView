
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
  { month: "January", usage: 3500 },
  { month: "February", usage: 3200 },
  { month: "March", usage: 2800 },
  { month: "April", usage: 2900 },
  { month: "May", usage: 2500 },
  { month: "June", usage: 2600 },
  { month: "July", usage: 3100 },
  { month: "August", usage: 3300 },
  { month: "September", usage: 3000 },
  { month: "October", usage: 2800 },
  { month: "November", usage: 2700 },
  { month: "December", usage: 4100 },
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
        <CardDescription>Last 12 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
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

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./charts"


type StatusCounts = {
  failed: number;
  sent: number;
};

type DataEntry = {
  count: number;
  country: string;
  operator: string;
  status: string;
};

type ChartData = {
  country: string;
  Sent: number;
  Failed: number;
};
type ChartDisplayProps = {
  data: ChartData[];
};
export const description = "A multiple bar chart"

const chartData = [
  { month: "India", Sent: 186, Failed: 80 },
  { month: "USA", Sent: 305, Failed: 200 },
  { month: "CANADA", Sent: 237, Failed: 120 },

]

const chartConfig = {
  Sent: {
    label: "Sent",
    color: "hsl(var(--chart-1))",
  },
  Failed: {
    label: "Failed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarGraph({data}:ChartDisplayProps) {
  console.log(data)
  return (
    <div className="max-w-md m-4 w-full">
      <Card className="flex flex-col h-[400px]">
        <CardHeader>
          <CardTitle>Bar Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ChartContainer config={chartConfig}>
            
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="country"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="Sent" fill="var(--color-Sent)" radius={4} />
              <Bar dataKey="Failed" fill="var(--color-Failed)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
       
      </Card>
    </div>
  )
}


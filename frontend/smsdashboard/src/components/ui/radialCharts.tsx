"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import { ChartConfig, ChartContainer } from "./charts"
import { useEffect, useState } from "react"

export const description = "A radial chart with text"

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "SMS Sent",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
interface Props{
    total:number,
    passed:number
}

  

export function RadialChart(props:Props) {
    const [angle,setangle]=useState(0)
    function calculateDegrees(total:number, passedCount:number) {
        // Calculate the failed count
        const failedCount = total - passedCount;
      
        // Calculate the degrees for passed and failed counts
        const passedDegrees = (passedCount / total) * 360;
        const failedDegrees = (failedCount / total) * 360;
      setangle(passedDegrees)
      chartData[0].visitors=passedCount
        return {
          passedDegrees,
          failedDegrees,
        };
      }
      useEffect(() => {
        calculateDegrees(props.total,props.passed)
      }, [props])
      
    return (
      <div className="max-w-lg m-4 w-full">
        <Card className="flex flex-col h-[400px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Radial Chart - Text</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={angle}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {chartData[0].visitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              SMS Sent
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          
        </Card>
      </div>
    )
  }
  

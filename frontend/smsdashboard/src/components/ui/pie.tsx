import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Tooltip } from "recharts"
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

// Define the type for the props
interface Props {
  data: [string, { [key: string]: number }]
}

// Define a list of colors for the pie chart sectors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4C4C"]

const chartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
}

export function PieCharts({ data }: Props) {
  const country = (data[0]).toLocaleUpperCase() // Accessing the country name (string)
  const telecomData = data[1] // Accessing the telecom data (object)

  // Correctly transforming telecomData to chartData with colors
  const chartData: { name: string; value: number; fill: string }[] = Object.entries(telecomData).map(
    ([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length], // Assign colors based on index
    })
  )

  return (
    <Card className="flex m-4 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{country}</CardTitle>
        <CardDescription>January - October 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig} // Provide the config if needed
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label
              outerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
       
        <div className="leading-none text-muted-foreground">
          Showing live data of current year
        </div>
      </CardFooter>
    </Card>
  )
}

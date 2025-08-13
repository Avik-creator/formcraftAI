"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Submissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface LineChartProps {
  chartData: {
    month: string
    submissions: number
  }[]
}

export function SubmissionsOvertimeLineChart({ chartData }: LineChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-full min-h-[200px] max-h-[230px] border border-zinc-700/70 rounded-lg bg-black/20"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              className="bg-black/90 border border-zinc-800 text-white"
              labelClassName="text-zinc-100"
            />
          }
        />
        <Line
          dataKey="submissions"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={3}
          dot={{
            fill: "var(--color-desktop)",
            strokeWidth: 2,
            stroke: "hsl(var(--background))",
          }}
          activeDot={{
            r: 6,
            stroke: "var(--color-desktop)",
            strokeWidth: 2,
            fill: "hsl(var(--background))",
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import { ListChecks, LayoutList } from "lucide-react"
import axios from 'axios';

[
  {
    "Activity": "QUOTE",
    "CommonTasks": 119
  },
  {
    "Activity": "ACCOUNT QUERIES",
    "CommonTasks": 83
  },
  {
    "Activity": "GRV",
    "CommonTasks": 72
  },
  {
    "Activity": "PERFORMANCE TRACKER ",
    "CommonTasks": 53
  },
  {
    "Activity": "STOCK",
    "CommonTasks": 39
  }
]


const chartConfig = {
  "QUOTE": {
    label: "Quote",
    color: "#00d384",
  },
  "ACCOUNT QUERIES": {
    label: "Account Queries",
    color: "#ff2257",
  },
  "GRV": {
    label: "GRV",
    color: "#FFC400",
  },
  "PERFORMANCE TRACKER ": {
    label: "Performance Tracker",
    color: "#1ec3ff",
  },
  "STOCK": {
    label: "STOCK",
    color: "#ff6600",
  },
} satisfies ChartConfig

interface TaskProps {
    Activity: string,
    CommonTasks: number
}
type TaskResponse = TaskProps[]


//http://localhost:4200/dashboard/getcommontasks
export function TasksPieChart() {
  const id = "pie-interactive"
  //const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)
  const [activeField, setActiveField] = React.useState("")
  const [commonTasks, setCommonTasks] = useState<TaskResponse | null>(null);
  const [newdesktopData, setNewdesktopData] = useState<{ field: string, desktop: number, fill: string }[]>([]);

  const getCommonTasks= async () => {
    try {
      //http://localhost:4200/dashboard/getcommontasks
      const commonerrorsurl = `dashboard/getcommontasks`;
      const response = await axios.get<TaskResponse>(`${apiEndPoint}/${commonerrorsurl}`);
      const data = response?.data;
      if (data) {
        setCommonTasks(data);
        const transformedData = data.map((item) => ({
          field: item.Activity,
          desktop: item.CommonTasks,
          fill: chartConfig[item.Activity as keyof typeof chartConfig].color,
        }));
        setNewdesktopData(transformedData);
      }
    } catch (error) {
      console.error('An error occurred while fetching the common tasks completed:', error);
    }
  }

  useEffect(() => { 
    getCommonTasks();
  }, []);

  const activeIndex = React.useMemo(
    () => newdesktopData.findIndex((item) => item.field === activeField),
    [activeField, newdesktopData]
  )
  const allFields = React.useMemo(() => newdesktopData.map((item) => item.field), [newdesktopData])

return (
  <Card data-chart={id} className="flex flex-col chart-background darker:chart-border">
    <ChartStyle id={id} config={chartConfig} />
    <CardHeader className="flex-row items-start space-y-0 pb-0">
      <div className="grid gap-1 chart-text">
        <CardTitle>Tasks</CardTitle>
        <CardDescription className="var(--dashboard-text-light)">Top 5 Common Tasks</CardDescription>
      </div>
      <Select value={activeField} onValueChange={setActiveField}>
        <SelectTrigger
          className="ml-auto chart-input pl-2.5"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl chartoption-item">
          {allFields.map((key) => {
            const config = chartConfig[key as keyof typeof chartConfig]

            if (!config) {
              return null
            }

            return (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg chartoption-item:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm text-black dark:text-white"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  {config?.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent className="flex flex-1 justify-center pb-0">
      <ChartContainer
        id={id}
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel className="chart-background chart-text gap-4" />}
          />
          <Pie
            data={newdesktopData}
            dataKey="desktop"
            nameKey="field"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={activeIndex}
            activeShape={({
              outerRadius = 0,
              ...props
            }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const selectedConfig = chartConfig[activeField as keyof typeof chartConfig];
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs header-text"
                      style={{ fill: 'var(--dashboard-text-light)' }}
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-current text-3xl font-bold"
                      >
                        {newdesktopData[activeIndex]?.desktop.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-current text-medium font-bold"
                      >
                        {selectedConfig?.label}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col gap-2 text-sm chart-text">
        <div className="flex items-center gap-2 font-medium leading-none">
          Common Employee Tasks <LayoutList size={18} strokeWidth={2} />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing employee tasks
        </div>
      </CardFooter>
  </Card>
)
}
//ListChecks, CircleXIcon, TicketXIcon, User
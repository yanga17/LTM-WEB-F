"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import axios from 'axios';


const chartConfig = {
  "CurrentActiveTickets": {
    label: "Active Tickets",
    color: "#00d384",
  },
  "CurrentLoggedTickets": {
    label: "Queued Tickets",
    color: "#ff2257",
  },
  "TasksCompleted": {
    label: "Tasks",
    color: "#FFC400",
  },
  "ErrorsCompleted": {
    label: "Errors",
    color: "#1ec3ff",
  },
  "OvrTicketsCompleted": {
    label: "Tickets Completed",
    color: "#ff6600",
  },
} satisfies ChartConfig

interface TicketSummaryProps {
  CurrentActiveTickets: number,
  CurrentLoggedTickets: number,
  TasksCompleted: number,
  ErrorsCompleted: number,
  OvrTicketsCompleted: number,
  CompletedFollowUps: number
}
type TicketSummaryResponse = TicketSummaryProps[]

export function SummaryPieChart() {
  const id = "pie-interactive"
  //const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)
  const [activeField, setActiveField] = React.useState("")
  const [ticketSummaryGridData, setTicketSummaryGridData] = useState<TicketSummaryProps | null>(null);
  const [newdesktopData, setNewdesktopData] = useState<{ field: string, desktop: number, fill: string }[]>([]);

  const getTicketSummGridData = async () => {
    try {
        const summaryurl = `dashboard/geticketsummary`
        const response = await axios.get<TicketSummaryResponse>(`${apiEndPoint}/${summaryurl}`);
        const data = response?.data?.[0];
        if (data) {
            setTicketSummaryGridData(data);
            const transformedData = [
                { field: "CurrentActiveTickets", desktop: data.CurrentActiveTickets, fill: "#00d384" },
                { field: "CurrentLoggedTickets", desktop: data.CurrentLoggedTickets, fill: "#ff2257" },
                { field: "TasksCompleted", desktop: data.TasksCompleted, fill: "#FFC400" },
                { field: "ErrorsCompleted", desktop: data.ErrorsCompleted, fill: "#1ec3ff" },
                { field: "OvrTicketsCompleted", desktop: data.OvrTicketsCompleted, fill: "#ff6600" },
            ];
            setNewdesktopData(transformedData);
        }
    } catch (error) {
        console.error('An error occurred while fetching Ticket Summary Grid Data:', error);
    }
  }

  useEffect(() => { 
      getTicketSummGridData();
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
        <CardTitle>Tickets</CardTitle>
        <CardDescription className="var(--dashboard-text-light)">No. Tickets Completed</CardDescription>
      </div>
      <Select value={activeField} onValueChange={setActiveField}>
        <SelectTrigger
          className="ml-auto h-10 w-[150px] rounded-lg pl-2.5"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          {allFields.map((key) => {
            const config = chartConfig[key as keyof typeof chartConfig]

            if (!config) {
              return null
            }

            return (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
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
            content={<ChartTooltipContent hideLabel className="pg-background gap-4" />}
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
                      className="text-xs dash-text"
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
          Daily Ticket Summary <Activity size={18} strokeWidth={2} />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total tickets for the today
        </div>
      </CardFooter>
  </Card>
)
}

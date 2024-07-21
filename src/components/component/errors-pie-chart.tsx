"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import { CircleXIcon } from "lucide-react";
import axios from 'axios';

const chartConfig = {
  "BACKOFFICE ERROR": {
    label: "Backoffice Error",
    color: "#00d384",
  },
  "TOUCH ERROR": {
    label: "Touch Error",
    color: "#ff2257",
  },
  "ACCOUNT QUERIES": {
    label: "Account Queries",
    color: "#FFC400",
  },
  "Printer Error": {
    label: "Printer Error",
    color: "#1ec3ff",
  },
  "QUOTE": {
    label: "Quote",
    color: "#ff6600",
  },
} satisfies ChartConfig

interface ErrorProps {
  Problem: string,
  CommonErrors: number
}
type ErrorsResponse = ErrorProps[]


export function ErrorsPieChart() {
  const id = "pie-interactive"
  //const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)
  const [activeField, setActiveField] = React.useState("")
  const [commonErrors, setCommonErrors] = useState<ErrorsResponse | null>(null);
  const [newdesktopData, setNewdesktopData] = useState<{ field: string, desktop: number, fill: string }[]>([]);

  const getTicketSummGridData = async () => {
    try {
      const commonerrorsurl = `dashboard/getcommonerrors`;
      const response = await axios.get<ErrorsResponse>(`${apiEndPoint}/${commonerrorsurl}`);
      const data = response?.data;
      if (data) {
        setCommonErrors(data);
        const transformedData = data.map((item) => ({
          field: item.Problem,
          desktop: item.CommonErrors,
          fill: chartConfig[item.Problem as keyof typeof chartConfig].color,
        }));
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
  <Card data-chart={id} className="flex flex-col">
    <ChartStyle id={id} config={chartConfig} />
    <CardHeader className="flex-row items-start space-y-0 pb-0">
      <div className="grid gap-1">
        <CardTitle>Errors</CardTitle>
        <CardDescription>Top 5 Common Errors</CardDescription>
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
            content={<ChartTooltipContent hideLabel className="bg-white gap-4" />}
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
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {newdesktopData[activeIndex]?.desktop.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-foreground text-medium font-bold"
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
    <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Common Client Errors <CircleXIcon size={18} strokeWidth={2} />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the 5 most common customer errors
        </div>
      </CardFooter>
  </Card>
)
}

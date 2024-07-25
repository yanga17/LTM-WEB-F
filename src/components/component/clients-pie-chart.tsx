"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from 'axios';

const chartConfig = {
  "Total Clients": {
    label: "Total Clients",
    color: "#00d384",
  },
  "Elite Package": {
    label: "Elite Package",
    color: "#ff2257",
  },
  "Basic Package": {
    label: "Basic Package",
    color: "#FFC400",
  },
  "No Package": {
    label: "No Package",
    color: "#1ec3ff",
  },
} satisfies ChartConfig

interface ClientProps {
  TotalClientsCount: number,
  ClientEliteCount: number,
  ClientBasicCount: number,
  ClientNoSupportPackCount: number
}
type ClientResponse = ClientProps[]

//http://localhost:4200/dashboard/getclientsummary
export function ClientsPieChart() {
  const id = "pie-interactive"
  const [activeField, setActiveField] = React.useState("")
  const [clientData, setClientData] = useState<ClientResponse | null>(null);
  const [newdesktopData, setNewdesktopData] = useState<{ field: string, desktop: number, fill: string }[]>([]);

  const getClientData = async () => {
    try {
      const commonclientsurl = `dashboard/getclientsummary`;
      const response = await axios.get<ClientResponse>(`${apiEndPoint}/${commonclientsurl}`);
      const data = response?.data?.[0];
      if (data) {
        setClientData([data]);
        const transformedData = [
          { field: "Total Clients", desktop: data.TotalClientsCount, fill: chartConfig["Total Clients"].color },
          { field: "Elite Package", desktop: data.ClientEliteCount, fill: chartConfig["Elite Package"].color },
          { field: "Basic Package", desktop: data.ClientBasicCount, fill: chartConfig["Basic Package"].color },
          { field: "No Package", desktop: data.ClientNoSupportPackCount, fill: chartConfig["No Package"].color },
        ];
        setNewdesktopData(transformedData);
      }
    } catch (error) {
      console.error('An error occurred while fetching the client data:', error);
    }
  }

  useEffect(() => { 
    getClientData();
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
          <CardTitle>Clients</CardTitle>
          <CardDescription>Summary of Client Data</CardDescription>
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
          Clients Summary <User size={18} strokeWidth={2} />
        </div>
        <div className="leading-none text-muted-foreground">
          Summary of the clients in the company
        </div>
      </CardFooter>
    </Card>
  )
}

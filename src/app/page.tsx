'use client'

import * as React from "react"
import { useState } from 'react'
import { TicketsModule } from "@/modules";
import { ActiveTicketsModule } from "@/modules";
import {  CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActivityIcon, PhoneIcon } from "@/components/component/tickets-table"
import { StartCall } from "@/components/component/start-call"
import { StartActivity } from "@/components/component/start-activity"
import { useRouter } from 'next/navigation';
import { HoverCard } from "@/components/component/hoverCard";
import { SummaryCard } from "@/components/component/summaryCard";
import { Toggler } from "@/components/component/toggler"

export default function Home() {
  const [startCallPopup, setStartCallPopup] = useState(false);
  const [startActivityPopup, setStartActivityPopup] = useState(false);

  const router = useRouter();

  const toggleStartCall = () => {
    setStartCallPopup(!startCallPopup);
  }

  const toggleStartActivity = () => {
    setStartActivityPopup(!startActivityPopup);
  }

  return (
    <div className="pg-background">
    <div className="h-screen w-full overflow-auto">
    <header className="text-gray-50 px-5 py-0 mt-4 flex justify-between">
      <div className="flex flex-wrap sm:flex-wrap md:flex-wrap lg:flex-wrap gap-2">
        <HoverCard />
        <SummaryCard />
      </div>
    <div className="relative flex ml-auto mt-4">
        <div className="absolute right-0 flex items-end">
            <Button
                size="lg"
                onClick={toggleStartCall}
                className="bg-purple mr-2"
            >
                <span>Start Call</span>
                <PhoneIcon className="h-4 w-4 mr-2 ml-2" />
            </Button>
            {startCallPopup && <StartCall onClose={toggleStartCall} />}
            <Button
                size="lg"
                onClick={toggleStartActivity}
                className="bg-purple mr-2"
            >
                <span>Start Activity</span>
                <ActivityIcon className="h-4 w-4 mr-2 ml-2" />
            </Button>
            {startActivityPopup && <StartActivity onClose={toggleStartActivity} />}
        </div>
    </div>
    </header>
      <div className="grid gap-6 w-full">
        <div className="max-h-[600px] overflow-auto">
          <div>
            <h6 className="ml-6 text-3xl py-4 font-bold text-hsl(var(--foreground))">Active Tickets</h6>
          </div>
          <Card className="bg-white ml-4 mr-4 shadow-md">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto table-container">
                <table className="w-full table-fixed">
                  <thead className="table-header">
                    <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                      <th className="p-2 lg:w-[50px]">Call ID</th>
                      <th className="p-2 lg:w-[180px]">Customer</th>
                      <th className="p-2 lg:w-[120px]">Problem</th>
                      <th className="p-2 lg:w-[70px]">Client Name</th>
                      <th className="p-2 lg:w-[120px]">Time</th>
                      <th className="p-2 lg:w-[70px]">Employee</th>
                      <th className="p-2 lg:w-[60px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ActiveTicketsModule />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="max-h-[600px] overflow-auto">
        <div>
            <h6 className="ml-6 text-3xl py-4 font-bold text-hsl(var(--foreground))">Logged Tickets</h6>
          </div>
          <Card className="ml-4 mr-4">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto table-container">
                <table className="w-full table-fixed p-4">
                  <thead className="table-header">
                    <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                      <th className="p-2 lg:w-[50px]">Call ID</th>
                      <th className="p-2 lg:w-[180px]">Customer</th>
                      <th className="p-2 lg:w-[120px]">Problem</th>
                      <th className="p-2 lg:w-[70px]">Client Name</th>
                      <th className="p-2 lg:w-[120px]">Time</th>
                      <th className="p-2 lg:w-[70px]">Employee</th>
                      <th className="p-2 lg:w-[60px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="mb-4">
                    <TicketsModule />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}

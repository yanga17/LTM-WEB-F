'use client'

import { TicketsModule } from "@/modules";
import { ActiveTicketsModule } from "@/modules";

import {  CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ActivityIcon, PhoneIcon } from "@/components/component/tickets-table"

import * as React from "react"
import {useState} from 'react'

import {StartCall} from "@/components/component/start-call"
import { StartActivity } from "@/components/component/start-activity"
import { TicketSummary } from "@/components/component/ticket-summary"


export default function Home() {
  const [startCallPopup, setStartCallPopup] = useState(false);
  const [startActivityPopUp, setActivityPopup] = useState(false);

  const toggleStartCall = () => {
    setStartCallPopup(!startCallPopup);
  }

  const toggleStartActivity = () => {
    setActivityPopup(!startActivityPopUp);
  }

  return (
    <div className="bg-white">
    <div className="h-screen w-full overflow-auto">
    <header className="text-gray-50 px-5 py-0 mt-4 flex justify-between">
    <TicketSummary />
    <div className="relative flex ml-auto mt-4">
        <div className="flex">
            <div className="text-right">
                <input
                    className="border-black text-black p-2 border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                    placeholder="Search Ticket"
                    style={{ width: "440px" }} // Adjust width here
                />
            </div>
        </div>
        <div className="absolute mt-14 right-0 flex items-end">
            <Button
                size="lg"
                onClick={toggleStartCall}
                className="bg-purple mr-2"
            >
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>Start Call</span>
            </Button>
            {startCallPopup && <StartCall onClose={toggleStartCall} />}
            <Button
                size="lg"
                onClick={toggleStartActivity}
                className="bg-purple"
            >
                <ActivityIcon className="h-4 w-4 mr-2" />
                <span>Start Activity</span>
            </Button>
            {startActivityPopUp && <StartActivity onClose={toggleStartActivity} />}
        </div>
    </div>
</header>
      <div className="grid gap-6 w-full">
        <div className="max-h-[600px] overflow-auto">
          <div>
            <h6 className="ml-6 text-3xl py-4 font-bold">Active Tickets</h6>
          </div>
          <Card className="ml-4 mr-4">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-300">
                    <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                      <th className="p-2 lg:w-[50px]">Call ID</th>
                      <th className="p-2 lg:w-[180px]">Customer</th>
                      <th className="p-2 lg:w-[120px]">Problem</th>
                      <th className="p-2 lg:w-[70px]">Client Name</th>
                      <th className="p-2 lg:w-[120px]">Time</th>
                      <th className="p-2 lg:w-[50px]">Employee</th>
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
            <h6 className="ml-6 text-3xl py-4 font-bold">Logged Tickets</h6>
          </div>
          <Card className="ml-4 mr-4">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full table-fixed">
                <thead className="bg-gray-300">
                    <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                      <th className="p-2 lg:w-[50px]">Call ID</th>
                      <th className="p-2 lg:w-[180px]">Customer</th>
                      <th className="p-2 lg:w-[120px]">Problem</th>
                      <th className="p-2 lg:w-[70px]">Client Name</th>
                      <th className="p-2 lg:w-[120px]">Time</th>
                      <th className="p-2 lg:w-[50px]">Employee</th>
                      <th className="p-2 lg:w-[60px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
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

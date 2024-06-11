'use client'

import { TicketsModule } from "@/modules";
import { ActiveTicketsModule } from "@/modules";
import { useAudit } from "@/shared/tools/auditMonit";

import Link from "next/link"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { EyeIcon, PlusIcon, MinusIcon, ActivityIcon, CoffeeIcon, MoveIcon, PhoneIcon, PhoneOffIcon, SearchIcon} from "@/components/component/tickets-table"
import { EachTicketsModule } from "@/modules/home/ticketsDetail";
import Image from 'next/image';

import * as React from "react"
import {useState, useEffect} from 'react'

import {StartCall} from "@/components/component/start-call"
import { TicketSummary } from "@/components/component/ticket-summary"


export default function Home() {
  const { addAuditLog } = useAudit() //Downloads
  const [startCallPopup, setStartCallPopup] = useState(false);

  const toggleStartCall = () => {
    setStartCallPopup(!startCallPopup);
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
            <Button size="lg" variant="ghost" className="ml-4">
                <img
                    alt="Avatar"
                    height="32"
                    src="/public/placeholder-user.jpg"
                    style={{
                        aspectRatio: "32/32",
                        objectFit: "cover",
                    }}
                    width="32"
                />
                <span className="sr-only">User Profile</span>
            </Button>
        </div>
        <div className="absolute mt-14 right-0 flex items-end">
            <Button
                size="lg"
                onClick={toggleStartCall}
                className="bg-purple rounded-full mr-2"
            >
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>Start Call</span>
            </Button>
            {startCallPopup && <StartCall onClose={toggleStartCall} />}
            <Button
                size="lg"
                className="bg-purple rounded-full mr-2"
            >
                <CoffeeIcon className="h-4 w-4 mr-2" />
                <span>Start Break</span>
            </Button>
            <Button
                size="lg"
                className="bg-purple rounded-full"
            >
                <ActivityIcon className="h-4 w-4 mr-2" />
                <span>Start Activity</span>
            </Button>
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

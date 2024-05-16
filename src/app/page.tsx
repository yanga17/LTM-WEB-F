'use client'

import { TicketsModule } from "@/modules";
import { ActiveTicketsModule } from "@/modules";
import { useAudit } from "@/shared/tools/auditMonit";

import Link from "next/link"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import {EyeIcon, PlusIcon, MinusIcon, ActivityIcon, CoffeeIcon, MoveIcon, PhoneIcon, PhoneOffIcon, SearchIcon} from "@/components/component/tickets-table"
import { EachTicketsModule } from "@/modules/home/ticketsDetail";
import logo from "../../public/images/LTM logo@3x.png";
import Image from 'next/image';

import * as React from "react"
import {useState, useEffect} from 'react'

import {StartCall} from "@/components/component/start-call"


export default function Home() {
  const { addAuditLog } = useAudit() //Downloads
  const [startCallPopup, setStartCallPopup] = useState(false);

  const toggleStartCall = () => {
    setStartCallPopup(!startCallPopup);
  }

  return (
    <div className="bg-white">
    <div className="h-screen w-full overflow-auto">
    <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-right">
          <input
            className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
            placeholder="Search Ticket"
            style={{ width: "440px" }} // Adjust width here
          />
        </div>
      </div>
      <div className="flex items-center">
        <Button size="lg" variant="ghost">
          <img
            alt="Avatar"
            height="32"
            src="C:\Users\Pc\Pictures\Camera Roll\toji.jpg"
            style={{
            aspectRatio: "32/32",
            objectFit: "cover",
            }}
            width="32"
          />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
      <div className="bg-white flex justify-start px-5 py-2 items-center space-x-6 mt-2">
        <Button
          size="lg"
          onClick={toggleStartCall}
          className="bg-purple">
          <PhoneIcon className="h-4 w-4 mr-2" />
          <span>Start Call</span>
        </Button>
        {startCallPopup && <StartCall onClose={toggleStartCall} />}
        <Button size="lg" className="bg-purple">
          <CoffeeIcon className="h-4 w-4 mr-2" />
          <span>Start Break</span>
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="max-h-[600px] overflow-auto">
          <div>
            <h6 className="ml-6 text-3xl py-4 font-bold">Active Tickets</h6>
          </div>
          <Card className="ml-4 mr-4">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <Table className="w-full">
                  <TableHeader className="bg-greyDarker">
                    <TableRow className="text-sm font-medium">
                      <TableHead className="w-[100px] text-left">Call ID</TableHead>
                      <TableHead className="max-w-[200px] text-left">Customer</TableHead>
                      <TableHead className="max-w-[200px] text-left min-w-10">Problem</TableHead>
                      <TableHead className="max-w-[100px] text-left pr-12">Client Name</TableHead>
                      <TableHead className="max-w-[200px] text-center">Time</TableHead>
                      <TableHead className="max-w-[200px] w-[100px] text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ActiveTicketsModule />
                  </TableBody>
                </Table>
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
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="text-sm font-medium">
                      <TableHead className="w-[100px] text-left">Call ID</TableHead>
                      <TableHead className="max-w-[200px] text-left">Customer</TableHead>
                      <TableHead className="max-w-[200px] text-left whitespace-normal break-all overflow-hidden text-ellipsis">Problem</TableHead>
                      <TableHead className="max-w-[100px] text-left pr-5">Client Name</TableHead>
                      <TableHead className="max-w-[200px] text-center">Time</TableHead>
                      <TableHead className="max-w-[200px] w-[100px] text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TicketsModule />
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}

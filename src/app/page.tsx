'use client'

import { TicketsModule } from "@/modules";
import { ActivieTicketsModule } from "@/modules";
import { useAudit } from "@/shared/tools/auditMonit";

import Link from "next/link"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import {EyeIcon, PlusIcon} from "@/components/component/tickets-table"
import { EachTicketsModule } from "@/modules/home/ticketsDetail";

//import { MachineDetail } from "./ticketsDetail";

export default function Home() {
  const { addAuditLog } = useAudit() //Downloads

  return (
    <div className="h-screen w-full overflow-auto">
      <header className="bg-gray-900 text-gray-50 px-4 py-2 flex items-center justify-between ml-auto">
        <nav className="flex items-center space-x-4">
          <Button variant="ghost">
            <span>Search</span>
          </Button>
          <Button variant="ghost">
            <span>Start Call</span>
          </Button>
          <Button variant="ghost">
            <span>End Call</span>
          </Button>
          <Button variant="ghost">
            <span>Start Activity</span>
          </Button>
          <Button variant="ghost">
            <span>End Activity</span>
          </Button>
          <Button variant="ghost">
            <span>Start Break</span>
          </Button>
          <Button variant="ghost">
            <span>End Break</span>
          </Button>
        </nav>
        <div className="flex items-center space-x-4">
          <Button size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="C:\Users\Pc\Pictures\Camera Roll\toji.jpg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">User Menu</span>
          </Button>
        </div>
      </header>
      <div className="grid gap-6">
        <div className="max-h-[600px] overflow-auto">
          <Card>
            <CardHeader className="p-6 flex items-center">
              <CardTitle className="text-lg">Logged Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="text-sm font-medium">
                      <TableHead className="w-[100px] text-left">Call ID</TableHead>
                      <TableHead className="text-left">Customer</TableHead>
                      <TableHead className="text-left whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">Problem</TableHead>
                      <TableHead className="text-left pr-5">Client Name</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="w-[100px] text-left">Action</TableHead>
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
        <div className="max-h-[600px] overflow-auto">
          <Card>
            <CardHeader className="p-6 flex items-center">
              <CardTitle className="text-lg">Active Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="text-sm font-medium">
                      <TableHead className="w-[100px] text-left">Call ID</TableHead>
                      <TableHead className="text-left">Customer</TableHead>
                      <TableHead className="text-left min-w-10">Problem</TableHead>
                      <TableHead className="text-left pr-12">Client Name</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="w-[100px] text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ActivieTicketsModule />
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

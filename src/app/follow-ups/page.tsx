'use client'

import { FollowUpsModule } from "@/modules/followups/followUpsModule";
import { CompFollowUpsModule } from "@/modules/followups/compFollowUpsModule";

import { CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { EyeIcon, PlusIcon, MinusIcon, ActivityIcon, CoffeeIcon, MoveIcon, PhoneIcon, PhoneOffIcon, SearchIcon} from "@/components/component/tickets-table"
import { EachTicketsModule } from "@/modules/home/ticketsDetail";

import * as React from "react"
import {useState, useEffect} from 'react'

import {StartCall} from "@/components/component/start-call"
import { TicketSummary } from "@/components/component/ticket-summary"

export default function Page() {


    return (
        <div className="bg-white">
        <div className="h-screen w-full overflow-auto">
        <header className="text-gray-50 px-5 py-0 mt-4 flex justify-between">
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
                    className="bg-purple rounded mr-2"
                >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>Upcoming Tickets</span>
                </Button>
            </div>
        </div>
        </header>
            <div className="grid gap-6 w-full">
            <div className="max-h-[600px] overflow-auto">
                <div>
                <h6 className="ml-6 text-3xl py-4 font-bold">Active Follow-Up Tickets</h6>
                </div>
                <Card className="ml-4 mr-4">
                <CardContent className="p-0">
                <div className="max-h-[400px] overflow-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-300">
                            <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Nr</th>
                            <th className="p-2 w-[80px]">Employee</th>
                            <th className="p-2 w-[230px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[40px]">Status</th>
                            <th className="w-[90px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CompFollowUpsModule />
                    </tbody>
                        </table>
                        <div className="webkit-scrollbar">
                            <div className="webkit-scrollbar-thumb" onClick={() => console.log("Scrollbar clicked!")}></div>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
            <div className="max-h-[600px] overflow-auto">
            <div>
                <h6 className="ml-6 text-3xl py-4 font-bold">Follow-Up Tickets</h6>
                </div>
                <Card className="ml-4 mr-4">
                <CardContent className="p-0">
                    <div className="max-h-[400px] overflow-auto">
                    <table className="w-full table-fixed">
                    <thead className="bg-gray-300">
                        <tr className="bg-gray text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Nr</th>
                            <th className="p-2 w-[80px]">Employee</th>
                            <th className="p-2 w-[230px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[40px]">Status</th>
                            <th className="w-[90px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <FollowUpsModule />
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
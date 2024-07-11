'use client'

import { FollowUpsModule } from "@/modules/followups/followUpsModule";
import { CompFollowUpsModule } from "@/modules/followups/compFollowUpsModule";
import { CardContent, Card } from "@/components/ui/card"
import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { UnresolvedFollowUps } from "@/components/component/unresolved-follow-ups"

export default function Page() {

    return (
        <div className="bg-white">
        <div className="h-screen w-full overflow-auto">
        <header className="text-gray-50 px-5 py-0 mt-4 flex justify-between">
            <UnresolvedFollowUps />
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
                        <thead className="bg-gray-300 sm:bg-gray-300 md:bg-gray-300 lg:bg-gray-300 xl:bg-gray-300">
                            <tr className="text-left text-black sm:text-black h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Nr</th>
                            <th className="p-2 w-[80px]">Employee</th>
                            <th className="p-2 w-[230px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[40px]">Status</th>
                            <th className="w-[70px]">Action</th>
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
                    <thead className="bg-gray-300 sm:bg-gray-300 md:bg-gray-300 lg:bg-gray-300 xl:bg-gray-300">
                        <tr className="text-left text-black sm:text-black h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Nr</th>
                            <th className="p-2 w-[80px]">Employee</th>
                            <th className="p-2 w-[230px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[40px]">Status</th>
                            <th className="w-[70px]">Action</th>
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
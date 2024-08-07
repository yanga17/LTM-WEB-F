'use client'

import { FollowUpsModule } from "@/modules/followups/followUpsModule";
import { CompFollowUpsModule } from "@/modules/followups/compFollowUpsModule";
import { CardContent, Card } from "@/components/ui/card";
import * as React from "react";
import { UnresolvedFollowUps } from "@/components/component/unresolved-follow-ups";

export default function Page() {

    return (
        <div className="pg-background">
        <div className="h-screen w-full overflow-auto">
        <header className="px-5 py-0 mt-4 flex justify-between">
            <UnresolvedFollowUps />
        </header>
            <div className="grid gap-6 w-full">
            <div className="max-h-[600px] overflow-auto">
                <div className="mt-6">
                <h6 className="ml-6 text-3xl py-4 font-bold header-text">Active Follow-Up Tickets</h6>
                </div>
                <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                <div className="max-h-[400px] overflow-auto">
                    <table className="w-full table-fixed">
                        <thead className="table-headerup">
                            <tr className="text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Call ID</th>
                            <th className="p-2 w-[200px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[50px]">Employee</th>
                            <th className="p-2 w-[40px]">Status</th>
                            <th className="w-[70px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CompFollowUpsModule />
                    </tbody>
                        </table>
                        {/* <div className="webkit-scrollbar">
                            <div className="webkit-scrollbar-thumb" onClick={() => console.log("Scrollbar clicked!")}></div>
                        </div> */}
                    </div>
                </CardContent>
            </div>
            <div className="max-h-[600px] overflow-auto">
            <div>
                <h6 className="ml-6 text-3xl py-4 font-bold header-text">Follow-Up Tickets</h6>
                </div>
                <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                    <div className="max-h-[400px] overflow-auto">
                    <table className="w-full table-fixed">
                    <thead className="table-headerup">
                        <tr className="text-left h-10 p-2 text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px]">Call ID</th>
                            <th className="p-2 w-[200px]">Customer</th>
                            <th className="p-2 w-[140px]">Problem</th>
                            <th className="p-2 w-[80px]">Client Name</th>
                            <th className="p-3 w-[60px]">Duration</th>
                            <th className="p-2 w-[50px]">Employee</th>
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
            </div>
        </div>
        </div>
        </div>
    );
}
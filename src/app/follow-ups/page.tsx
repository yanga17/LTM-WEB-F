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
                <div className="max-h-[300px] overflow-auto table-container">
                    <table className="w-full table-fixed">
                        <thead className="table-headerup">
                            <tr className="bg-gray text-left h-10 p-2 text-md sm:text-sm md:text-md font-medium border-rounded rounded-full">
                                <th className="p-2 w-[60px] text-sm sm:w-[60px] md:w-[70px] md:text-sm lg:w-[70px] lg:text-md xl:w-[80px] 2xl:w-[80px]">Call ID</th>
                                <th className="p-2 w-[105px] text-sm sm:w-[110px] md:w-[140px] md:text-sm lg:w-[160px] lg:text-md xl:w-[220px] 2xl:w-[220px]">Customer</th>
                                <th className="p-2 w-[110px] text-sm sm:w-[120px] md:w-[150px] md:text-sm lg:w-[170px] lg:text-md xl:w-[250px] 2xl:w-[250px]">Problem</th>
                                <th className="p-2 w-[100px] text-sm hidden lg:table-cell lg:w-[90px] lg:text-md xl:w-[110px] 2xl:w-[120px]">Client Name</th>
                                <th className="p-2 w-[140px] text-sm hidden lg:table-cell lg:w-[90px] lg:text-md xl:w-[110px] 2xl:w-[120px]">Duration</th>
                                <th className="p-2 w-[70px] text-sm sm:w-[70px] md:w-[90px] md:text-sm lg:w-[80px] lg:text-md xl:w-[80px] 2xl:w-[80px]">Employee</th>
                                <th className="p-2 w-[60px] text-sm sm:w-[40px] md:w-[50px] md:text-sm lg:w-[60px] lg:text-md xl:w-[70px] 2xl:w-[70px]">Status</th>
                                <th className="p-2 w-[90px] text-sm sm:w-[90px] md:w-[100px] md:text-sm lg:w-[130px] lg:text-md xl:w-[120px] 2xl:w-[100px]">Action</th>
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
                    <div className="max-h-[350px] overflow-auto table-container">
                    <table className="w-full table-fixed">
                    <thead className="table-headerup">
                        <tr className="bg-gray text-left h-10 p-2 text-md sm:text-sm md:text-md font-medium border-rounded rounded-full">
                            <th className="p-2 w-[60px] text-sm sm:w-[60px] md:w-[70px] md:text-sm lg:w-[70px] lg:text-md xl:w-[80px] 2xl:w-[80px]">Call ID</th>
                            <th className="p-2 w-[105px] text-sm sm:w-[110px] md:w-[140px] md:text-sm lg:w-[160px] lg:text-md xl:w-[220px] 2xl:w-[220px]">Customer</th>
                            <th className="p-2 w-[110px] text-sm sm:w-[120px] md:w-[150px] md:text-sm lg:w-[170px] lg:text-md xl:w-[250px] 2xl:w-[250px]">Problem</th>
                            <th className="p-2 w-[100px] text-sm hidden lg:table-cell lg:w-[90px] lg:text-md xl:w-[110px] 2xl:w-[120px]">Client Name</th>
                            <th className="p-2 w-[140px] text-sm hidden lg:table-cell lg:w-[90px] lg:text-md xl:w-[110px] 2xl:w-[120px]">Duration</th>
                            <th className="p-2 w-[70px] text-sm sm:w-[70px] md:w-[90px] md:text-sm lg:w-[80px] lg:text-md xl:w-[80px] 2xl:w-[80px]">Employee</th>
                            <th className="p-2 w-[60px] text-sm sm:w-[40px] md:w-[50px] md:text-sm lg:w-[60px] lg:text-md xl:w-[70px] 2xl:w-[70px]">Status</th>
                            <th className="p-2 w-[90px] text-sm sm:w-[90px] md:w-[100px] md:text-sm lg:w-[130px] lg:text-md xl:w-[120px] 2xl:w-[100px]">Action</th>
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
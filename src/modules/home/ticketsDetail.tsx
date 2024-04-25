import React from 'react';
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { Button } from "@/components/ui/button"

import { ResponseTypeEachTicket } from './ticketsModule';


interface EachTicketsProps {
    ticketData: ResponseTypeEachTicket;
    callid: number;
}

export const EachTicketsModule = ({ ticketData, callid }: EachTicketsProps) => {

    return (
    <>
    {ticketData?.map(({ Call_ID, Customer, Problem, Clients_Anydesk, Phone_Number, Time, EndTime, Duration, Taken, Support_No, Empl, logger, Comments, Solution, Name, urgent, IssueType}) => (
        <div key={callid} className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md">{Call_ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{Empl || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p>{Support_No || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md">{IssueType || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{Customer}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{Problem || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time</p>
                            <p>{new Date(Time).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">Logger</p>
                            <p>{logger || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{Name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button onClick={() => console.log("Take Call")} className="mr-2 bg-green">Take Call</Button>
                        <Button onClick={() => console.log("Transfer Call")} className="mr-2 bg-purple">Transfer Call</Button>
                        <Button onClick={() => console.log("Delete")} className="mr-2 bg-red">Delete</Button>
                        <Button onClick={() => console.log("Close")} className="mr-2 bg-orange">Close</Button>
                    </div>
                </div>
            </div>
        ))}
    </>
    );
}
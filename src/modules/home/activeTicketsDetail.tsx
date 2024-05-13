'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { DetailResponseType } from './activeTicketsModule';

interface EachTicketProps {
    ticketData: DetailResponseType;
    callid: number;
    onClose: () => void;

}

export const EachActiveTicketsModule = ({ ticketData, callid, onClose}: EachTicketProps) => {

    return (
    <>
    {ticketData?.map(({ ID, Employee, Customer, Activity, Clients_Anydesk, Phone_Number, StartTime, EndTime, Duration, Type, Solution, Support_No, Comments, FollowUp, Completed, Name, number_of_days, Time_Taken, IssueType}) => (
        <div key={callid} className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md">{ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{Employee || '--:--'}</p>
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
                            <p className="font-semibold text-md">{Activity || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time</p>
                            <p>{new Date(StartTime).toLocaleString() || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">Time Taken</p>
                            <p>{new Date(Time_Taken).toLocaleString() || '--:--'}</p>
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
                        <Button onClick={() => console.log("Take Call")} className="mr-2 bg-green">End Call</Button>
                        <Button onClick={() => console.log("Transfer Call")} className="mr-2 bg-purple">Transfer Call</Button>
                        <Button onClick={() => console.log("Delete")} className="mr-2 bg-red">Delete</Button>
                        <Button onClick={onClose} className="mr-2 bg-orange">Close</Button>
                    </div>
                </div>
            </div>
        ))}
    </>
    );
}
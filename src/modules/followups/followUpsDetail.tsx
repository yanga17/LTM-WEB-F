'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { Minimize2, PhoneOutgoing } from "lucide-react";
import { useContext } from 'react';
import { FollowUpContext } from './followUpsModule';

interface FollowUpsDetailProps {
    onClose: () => void;
    followUpFn: (id: any) => void;
}


export const FollowUpsDetail= ({ onClose, followUpFn }: FollowUpsDetailProps) => {
    const followUp = useContext(FollowUpContext);

    if (!followUp) {
        return <div>No data available</div>;
    }

    return (
    <>
        <div className="p-4 pg-background">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md">{followUp.ID || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md uppercase">{followUp.Employee || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Client Email</p>
                            <p className="font-semibold text-md">{followUp.Email_Address || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Support No</p>
                            <p className="font-semibold text-md uppercase">{followUp.Support_No || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{followUp.Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md uppercase">{followUp.Customer || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md uppercase">{followUp.Activity || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Start Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(followUp.StartTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">End Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(followUp.EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{followUp.name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{followUp.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">IssueType</p>
                            <p className={`font-semibold text-md ${followUp.IssueType === 'Task' ? 'text-green' : 'text-red'}`}>{followUp.IssueType || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${followUp.Priority === 'P1' ? 'text-red' : followUp.Priority === 'P2' ? 'text-orange' : (followUp.Priority === 'P3' || followUp.Priority === 'P4') ? 'text-grey' : ''}`}>{followUp.Priority || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button className="mr-2 bg-green hover:bg-emerald-300" onClick={() => { followUpFn(followUp.ID)}}>Start
                            <PhoneOutgoing size={18} strokeWidth={2} color="white" className="ml-2" />
                        </Button>
                        <Button className="mr-2 bg-orange hover:bg-amber-400" onClick={onClose}>Close
                            <Minimize2 size={18} strokeWidth={2} color="white" className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
    </>
    );
}
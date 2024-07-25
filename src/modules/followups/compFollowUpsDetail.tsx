'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { PhoneOff, Minimize2 } from "lucide-react";
import { useContext } from 'react';
import { ActiveFollowUpsContext } from './compFollowUpsModule';

interface ActiveFollowUpProp {
    onClose: () => void;
    endFollowUpFn: (idx: any) => void;
}


export const CompFollowUpsDetail= ({ onClose, endFollowUpFn }: ActiveFollowUpProp) => {
    const ActiveFollowUps = useContext(ActiveFollowUpsContext);

    if (!ActiveFollowUps) {
        return <div>No data available</div>;
    }

    return (
    <>
        <div className="p-4 pg-background">
                <h2 className="mb-2 text-xl font-semibold">Follow-Up Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.ID || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Employee || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Client Email</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Email_Address || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Support No</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Support_No || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Customer || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Activity || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Start Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(ActiveFollowUps.StartTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">End Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(ActiveFollowUps.EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.IssueType || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${ActiveFollowUps.Priority === 'P1' ? 'text-red' : ActiveFollowUps.Priority === 'P2' ? 'text-orange' : (ActiveFollowUps.Priority === 'P3' || ActiveFollowUps.Priority === 'P4') ? 'text-grey' : ''}`}>{ActiveFollowUps.Priority || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button className="mr-2 bg-red sm:bg-red" onClick={() => { endFollowUpFn(ActiveFollowUps.ID)}}>End
                            <PhoneOff size={18} strokeWidth={2} className="ml-2" />
                        </Button>
                        <Button className="mr-2 bg-orange sm:bg-orange pl-2" onClick={onClose}>Close
                            <Minimize2 size={18} strokeWidth={2} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
    </>
    );
}
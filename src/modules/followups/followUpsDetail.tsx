'use client'

import React from 'react';
import { Button } from "@/components/ui/button"

import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import { TicketTransfer } from "@/components/component/ticket-transfer";
import axios from 'axios';
import { Undo2, CircleSlash2, CircleSlash, Check, PhoneOutgoing, PhoneOff, ViewIcon } from "lucide-react";

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
        <div className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Nr</p>
                            <p className="font-semibold text-md">{followUp.ID || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{followUp.Employee || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p>{followUp.Support_No || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md">{followUp.IssueType || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{followUp.Customer || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{followUp.Activity || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time/Date</p>
                            <p>{new Date(followUp.StartTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">End Time/Date</p>
                            <p>{new Date(followUp.EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{followUp.name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{followUp.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{followUp.Comments || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Priority</p>
                            <p className="">{followUp.Priority || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button className="mr-2 bg-green" onClick={() => { followUpFn(followUp.ID)}}>Start Follow-Up</Button>
                        <Button className="mr-2 bg-orange" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
    </>
    );
}
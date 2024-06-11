'use client'

import React from 'react';
import { Button } from "@/components/ui/button"

import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import { TicketTransfer } from "@/components/component/ticket-transfer";
import axios from 'axios';

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
        <div className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Follow-Up Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Nr</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Employee}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p>{ActiveFollowUps.Support_No}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.IssueType}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Customer}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Activity}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time/Date</p>
                            <p>{ActiveFollowUps.StartTime}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">End Time/Date</p>
                            <p>{ActiveFollowUps.EndTime}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Name}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Phone_Number}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{ActiveFollowUps.Comments}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Priority</p>
                            <p className="">{ActiveFollowUps.Priority}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button className="mr-2 bg-red" onClick={() => { endFollowUpFn(ActiveFollowUps.ID)}}>End Follow-Up</Button>
                        <Button className="mr-2 bg-orange" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
    </>
    );
}
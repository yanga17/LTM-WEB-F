'use client'

import React from 'react';
import { PhoneOff, Minimize2 } from "lucide-react";
import { useContext } from 'react';
import { ActiveFollowUpsContext } from './compFollowUpsModule';
import { format } from "date-fns";
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ActiveFollowUpProp {
    onClose: () => void;
}

interface CompletedFLProps {
    idx: number,
    ID: number,
    Employee: string,
    Customer: string,
    Activity: string,
    Phone_Number: number,
    StartTime: string
    EndTime: string,
    Duration: number,
    Type: string,
    Solution: string,
    Support_No: null,
    Comments: string,
    FollowUp: null,
    Completed: null,
    Name: string,
    Email_Address: string,
    Clients_Anydesk: null,
    NumberOfDays: number,
    TimeTaken: null,
    FLStartTime: string,
    FLEndTime: string
    IssueType: string,
    Priority: string
}

type FolowUpsType = CompletedFLProps[]


export const CompFollowUpsDetail= ({ onClose }: ActiveFollowUpProp) => {
    const ActiveFollowUps = useContext(ActiveFollowUpsContext);

    if (!ActiveFollowUps) {
        return <div>No data available</div>;
    }

    const endFollowUp = async (idx: any) => {
        const flendtime = format(
            new Date(),
            "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
        );

        try {
            //endactivefollowup/:flendtime/:idx
            const endUrl = `followups/endactivefollowup/${flendtime}/${idx}`;
            const response = await axios.patch<FolowUpsType>(`${apiEndPoint}/${endUrl}`);
            console.log("ENDING ACTIVE FOLLOW-UP WAS SUCCESSFUL:", response.data);
            toast.success('Follow-Up has been ended successfully.');

        } catch (error) {
            console.error('Error ending active follow-up ticket:', error);
            toast.error('An error occurred while ending the follow-up.');
        }
    }

    return (
    <>
        <div className="p-4 pg-background">
                <h2 className="mb-2 text-xl font-semibold">Follow-Up Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md text-purple uppercase">{ActiveFollowUps.ID || '--:--'}</p>
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
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.StartTime ? `${new Date(ActiveFollowUps.StartTime).toString().split(' ').slice(1, 5).join(' ')}` : '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">End Time</p>
                            <p className="font-semibold text-md uppercase">{ActiveFollowUps.EndTime ? `${new Date(ActiveFollowUps.EndTime).toString().split(' ').slice(1, 5).join(' ')}` : '--:--'}</p>
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
                            <p className={`font-semibold text-md ${ActiveFollowUps.IssueType ? (ActiveFollowUps.IssueType === 'Task' ? 'text-green' : 'text-red') : 'header-text'}`}>{ActiveFollowUps.IssueType || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${ActiveFollowUps.Priority === 'P1' ? 'text-red' : ActiveFollowUps.Priority === 'P2' ? 'text-orange' : (ActiveFollowUps.Priority === 'P3' || ActiveFollowUps.Priority === 'P4') ? 'text-grey' : ''}`}>{ActiveFollowUps.Priority || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button className="cancel-detail" onClick={() => { endFollowUp(ActiveFollowUps.idx)}}>
                            <span>End</span>
                            <PhoneOff size={18} strokeWidth={2} className="ml-2" />
                        </button>
                        <button className="close-detail" onClick={onClose}>
                            <span>Close</span>
                            <Minimize2 size={18} strokeWidth={2} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
    </>
    );
}
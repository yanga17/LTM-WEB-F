'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { DetailResponseType } from './activeTicketsModule'; 
import { ActiveResponseType } from './activeTicketsModule';  
import { useState } from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import { TicketSolution } from "@/components/component/ticket-solution";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Minimize2, PhoneOff, Move3d } from "lucide-react";

interface EachTicketProps {
    ticketData: DetailResponseType;
    callid: number;
    onClose: () => void;
}

interface TransferProps {
    customer: string,
    problem: string,
    clientsAnydesk: number,
    phoneNumber: number,
    time: string,
    supportNumber: string,
    empl: string,
    comments: string,
    solution: string,
    name: string,
    urgent: number,
    issueType: string,
    type: string
}

type TransferType = TransferProps[]


export const EachActiveTicketsModule = ({ ticketData, callid, onClose}: EachTicketProps) => {
    const [transferPopUp, setTransferPopUp] = useState(false);
    const [transferid, setTransferId] = useState(0);
    const [solutuionid, setSolutionId] = useState(0);

    const [viewedticket, setViewedTicket] = useState<ActiveResponseType>([]); //view ticket holds my returned data
    const [transferTicketData, setTransferTicketData] = useState<TransferType>([]);

    const [solutionPopup, setSolutionPopup] = useState(false);

    const endTicket = async (currentemployee: string, callid: number) => {
        try {

            const endurl = `tickets/endticket/${currentemployee}/${callid}`
            const response = await axios.patch<ActiveResponseType>(`${apiEndPoint}/${endurl}`);
            setViewedTicket(response.data)

            setSolutionId(callid)
            setSolutionPopup(true)
            toast.success('Ticket has been ended successfully.');

            console.log('Ticket ended successfully:', response.data);

        } catch (error) {

            console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

        }
    }


    const toggleTransfer = (callid: number) => {
        const ticket = ticketData.find(ticket => ticket.ID === callid);
        
        if (ticket) {
            const selectedData = {
                customer: ticket.Customer,
                problem: ticket.Activity,
                clientsAnydesk: ticket.Clients_Anydesk,
                phoneNumber: ticket.Phone_Number,
                time: new Date(ticket.StartTime).toISOString().slice(0, 19).replace('T', ' '),
                supportNumber: ticket.Support_No,
                empl: ticket.Employee,
                comments: ticket.Comments,
                solution: ticket.Solution,
                name: ticket.Name,
                urgent: ticket.Priority,
                issueType: ticket.IssueType,
                type: ticket.Type,
            };
            // setTransferTicketData(selectedData);
            setTransferPopUp(true);
        }
    }

    const toggleSolution = () => {
        setSolutionPopup(!solutionPopup);
    }

    const filterCustomer = (customer: string) => {
        if (customer.includes(":")) {
            let customerData = customer.split(":")[0].trim();
            let supportNo = customer.split(":")[1].trim();
            return { customerData, supportNo };
        } else {
            return { customerData: customer, supportNo: null };
        }
    };

    return (
        <>
            {solutionPopup && <TicketSolution callId={solutuionid} onClose={toggleSolution} />}
            {transferPopUp && transferTicketData && <TicketTransfer callId={callid} onClose={onClose} />}
            {ticketData?.map(({ ID, Employee, Customer, Activity, Clients_Anydesk, Phone_Number, StartTime, EndTime, Duration, Type, Solution, Support_No, Comments, FollowUp, Completed, Name, Email_Address, number_of_days, Time_Taken, IssueType, Priority }) => {
                const { customerData, supportNo } = filterCustomer(Customer);
                console.log("my urgent value lets this this mf:", Priority)
                console.log("my client name value", Name)
                
                return (
                    <div key={ID} className="p-4 bg-white">
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
                                <div className="mb-4 mt-4">
                                    <p className="font-medium text-gray-500 text-md">Client Email</p>
                                    <p className="font-semibold text-md">{Email_Address || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Support No</p>
                                    <p>{supportNo || Support_No || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Comments</p>
                                    <p className="font-semibold text-md">{Comments || '--:--'}</p>
                                </div>
                            </div>
                            <div className="w-1/3">
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Customer</p>
                                    <p className="font-semibold text-md">{customerData || '--:--'}</p>
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
                                    <p className="font-medium text-gray-500 text-md">IssueType</p>
                                    <p className="font-semibold text-md">{IssueType || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Priority</p>
                                    <p className={`font-semibold text-md ${Priority === 1 ? 'text-red' : Priority === 2 ? 'text-orange' : Priority === 0 ? 'text-grey' : ''}`}>
                                        {Priority === 1 ? "Urgent" : Priority === 2 ? "Moderate" : "Low"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4">
                                <Button onClick={() => { endTicket(Employee, callid) }} className="mr-2 bg-red sm:bg-red">End Call
                                    <PhoneOff size={18} strokeWidth={2} className="ml-2" />
                                </Button>
                                <Button onClick={() => { toggleTransfer(callid) }} className="mr-2 bg-purple sm:bg-purple">Transfer
                                    <Move3d size={18} strokeWidth={2} className="ml-2" />
                                </Button>
                                <Button onClick={onClose} className="mr-2 bg-orange sm:bg-orange">Close
                                    <Minimize2 size={18} strokeWidth={2} color="white" className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
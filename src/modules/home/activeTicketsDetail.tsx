'use client'

import React from "react";
import { Button } from "@/components/ui/button"
import { ActiveResponseType } from "./activeTicketsModule";  
import { useState, useContext } from "react";
import { apiEndPoint, colors } from '@/utils/colors';
//import { TicketSolution } from "@/components/component/ticket-solution";
import { TicketSolutionDetail } from "@/components/component/ticket-solution-detail";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Minimize2, PhoneOff, Move3d, PencilRuler } from "lucide-react";
import { EditActiveCall } from "@/components/component/edit-active-call";
import { ActiveTicketsContext } from "@/modules/home/activeTicketsModule";

interface EachActiveTicketProps {
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


export const EachActiveTicketsModule = ({ onClose }: EachActiveTicketProps) => {
    const [transferPopUp, setTransferPopUp] = useState(false);
    const [editActivePopUp, setEditActivePopUp] = useState(false);
    const [solutionPopup, setSolutionPopup] = useState(false);
    const [solutuionid, setSolutionId] = useState(0);
    const activeTickets = useContext(ActiveTicketsContext);

    const [viewedticket, setViewedTicket] = useState<ActiveResponseType>([]); //view ticket holds my returned data

    if (!activeTickets) {
        return <div>No data available</div>;
    }

    const endTicket = async (currentemployee: string, callid: number) => {
        try {

            setSolutionId(callid);
            setSolutionPopup(true);

            // const endurl = `tickets/endticket/${currentemployee}/${callid}`
            // const response = await axios.patch<ActiveResponseType>(`${apiEndPoint}/${endurl}`);
            //setViewedTicket(response.data)

            
            toast.success('Solutionhas been opened.');

        } catch (error) {

            console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

        }
    }

    const toggleEditActiveCall = () => {
        setEditActivePopUp(!editActivePopUp);
    }

    const toggleTransfer = (callid: number) => {
        setTransferPopUp(true);
    }

    const toggleSolution = () => {
        setSolutionPopup(!solutionPopup);
    }

    // const filterCustomer = (customer: string) => {
    //     if (customer.includes(":")) {
    //         let customerData = customer.split(":")[0].trim();
    //         let supportNo = customer.split(":")[1].trim();
    //         return { customerData, supportNo };
    //     } else {
    //         return { customerData: customer, supportNo: null };
    //     }
    // };

    return (
        <>
            {editActivePopUp && <EditActiveCall closeEdit={toggleEditActiveCall} data={activeTickets} />}
            {solutionPopup && <TicketSolutionDetail callId={solutuionid} onClose={toggleSolution} />}
            {transferPopUp && <TicketTransfer callId={activeTickets.ID} onClose={onClose} />}
                    <div key={activeTickets.ID} className="p-4 pg-background">
                        <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                        <div className="flex flex-wrap">
                            <div className="w-1/3">
                                <div>
                                    <p className="font-medium text-gray-500 text-md">Call ID</p>
                                    <p className="font-semibold text-md">{activeTickets.ID}</p>
                                </div>
                                <div className="mb-4 mt-4">
                                    <p className="font-medium text-gray-500 text-md">Employee</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Employee || '--:--'}</p>
                                </div>
                                <div className="mb-4 mt-4">
                                    <p className="font-medium text-gray-500 text-md">Client Email</p>
                                    <p className="font-semibold text-md">{activeTickets.Email_Address || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Support No</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Support_No || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Comments</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Comments || '--:--'}</p>
                                </div>
                            </div>
                            <div className="w-1/3">
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Customer</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Customer || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Problem</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Activity || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Start Time</p>
                                    <p className="font-semibold text-md uppercase">{new Date(activeTickets.StartTime).toLocaleString() || '--:--'}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500 text-md">Time Taken</p>
                                    <p className="font-semibold text-md uppercase">{new Date(activeTickets.Time_Taken).toLocaleString() || '--:--'}</p>
                                </div>
                            </div>
                            <div className="w-1/3">
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Client Name</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Name || '--:--'}</p>
                                </div>
                                <div className="mb-4 mt-4">
                                    <p className="font-medium text-gray-500 text-md">Phone Number</p>
                                    <p className="font-semibold text-md uppercase">{activeTickets.Phone_Number || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">IssueType</p>
                                    <p className={`font-semibold text-md ${activeTickets.IssueType ? (activeTickets.IssueType === 'Task' ? 'text-green' : 'text-red') : 'header-text'}`}>{activeTickets.IssueType || '--:--'}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-medium text-gray-500 text-md">Priority</p>
                                    <p className={`font-semibold text-md ${activeTickets.Priority === 'P1' ? 'text-red' : activeTickets.Priority === 'P2' ? 'text-orange' : (activeTickets.Priority === 'P3' || activeTickets.Priority === 'P4') ? 'text-gray-500' : ''}`}>
                                        {activeTickets.Priority || '--:--'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4">
                                <button onClick={() => { endTicket(activeTickets.Employee, activeTickets.ID) }} className="cancel-detail">
                                    <span>End</span>
                                    <PhoneOff size={18} strokeWidth={2} className="ml-2" />
                                </button>
                                <button onClick={ toggleEditActiveCall } className="edit-detail">
                                    <span>Edit</span>
                                    <PencilRuler size={18} strokeWidth={2} className="ml-2" />
                                </button>
                                <button onClick={() => toggleTransfer(activeTickets.ID)} className="transfer-detail">
                                    <span>Transfer</span>
                                    <Move3d size={18} strokeWidth={2} className="ml-2" />
                                </button>
                                <button onClick={onClose} className="close-detail">
                                    <span>Close</span>
                                    <Minimize2 size={18} strokeWidth={2} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
        </>
    );
}
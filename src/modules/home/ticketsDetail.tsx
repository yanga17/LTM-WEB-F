'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { ResponseTypeEachTicket } from './ticketsModule';

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

import {useState, useEffect} from 'react'
import { TicketDeletion } from "@/components/component/ticket-deleted"


interface EachTicketsProps {
    ticketData: ResponseTypeEachTicket;
    callid: number;
    onClose: () => void;
}

//interface for TblCalls
interface CheckProps {
    Call_ID: number,
    Customer: string,
    Problem: string,
    Clients_Anydesk: number,
    Phone_Number: number,
    Time: string,
    EndTime: string,
    Duration: number,
    Taken: number,
    Support_No: number,
    Empl: string,
    logger: string,
    Comments: string,
    Solution: string,
    Name: string,
    urgent: number,
    IssueType: string,
    Type: string,
}

type ResponseType = CheckProps[]

export const EachTicketsModule = ({ ticketData, callid, onClose }: EachTicketsProps) => {
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deletionId, setDeletionId] = useState(0)

    // const deleteTicket = async (ticket: CheckProps) => {
    //     const target = event.target as HTMLButtonElement;
    //     const ticket = target.closest('[data-ticket-id]')?.dataset.ticketId;

    //     if (!ticket) {
    //         console.log('Ticket not found')
    //     }

    //     const ticketData = tickets.find(t => t.Call_ID === parseInt(ticket));

    //     if (!ticketData) {
    //         console.error('Ticket data not found');
    //         return;
    //     }





    //     let customerData = ticket.Customer
    //     let supportNo = null;

    //     if (ticket.Customer.includes(",")) {
    //         const customerArray = ticket.Customer.split(",");
    //         customerData = customerArray[0].trim();
    //         supportNo = customerArray[1].trim();
    //     }
    
    //     try {
    //     const payload = {
    //         callid: ticket.Call_ID,
    //         employee: ticket.Empl,
    //         customer: customerData,
    //         problem: ticket.Problem,
    //         clientname: ticket.Name,
    //         phonenumber: ticket.Phone_Number,
    //         startime: ticket.Time,
    //         supportnumber: supportNo,
    //         priority: ticket.urgent,
    //         issueType: ticket.IssueType,
    //         type: ticket.Type,
    //         comments: ticket.Comments,
    //         insertiontime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    //     }


    //     const response = await axios.post(`${apiEndPoint}/tickets/insertdeletedticket`, payload);
    //     console.log('Ticket deleted successfully:', response.data);

    //     } catch (error) {

    //     console.error('Error deleting ticket:', error);

    //     }
    // }

    async function deleteTicket(callID: any, ticketData: any) {
    try {
        // Find the ticket with the matching callID
        const ticket = ticketData.find((ticket: { Call_ID: number; }) => ticket.Call_ID === callid);

        if (!ticket) {
            throw new Error(`Ticket with callID ${callID} not found.`);
        }

        setDeletionId(ticket.Call_ID)
        console.log('SHOW ME THE DELETED CallID MY NIGGA!!!!!!!!!!!!!!!!!!!!!!!!:', ticket.Call_ID)


        // Extract necessary data from the ticket
        // clientname, phonenumber, startime, supportnumber, priority, issueType, type, comments, insertiontime
        const { Empl, Customer, Problem, Name, Phone_Number, Time, Support_No, IssueType, Comments, urgent } = ticket;

        let customerData = ticket.Customer
        let supportNo = null;

        if (ticket.Customer.includes(",")) {
            const customerArray = ticket.Customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        // Create payload object
        const payload = {
            callid: callID,
            employee: Empl,
            customer: customerData,
            problem: Problem,
            clientname: Name,
            phonenumber: Phone_Number,
            startime: Time,
            supportnumber: supportNo,
            priority: urgent,
            issueType: IssueType,
            comments: Comments,
            insertiontime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };


        const response = await axios.post(`${apiEndPoint}/tickets/insertdeletedticket`, payload);
        console.log('Ticket DELETED successfully:', response.data);
        setDeletePopUp(true);

        
        console.log('Ticket NEW CUSTOMER NAME:', customerData);
        console.log('Ticket SUPPORT NUMBER:', supportNo);

    } catch (error) {

        console.error('Error inserting ticket:', error);
    }
}

    const toggleDeletePage = () => {
        setDeletePopUp(!deletePopUp);
    }


    return (
    <>
    {deletePopUp && <TicketDeletion callId={deletionId} onClose={toggleDeletePage} />}
    {ticketData?.map(({ Call_ID, Customer, Problem, Clients_Anydesk, Phone_Number, Time, EndTime, Duration, Taken, Support_No, Empl, logger, Comments, Solution, Name, urgent, IssueType}) => (
        <div key={callid} className="p-4 bg-white" data-ticket-id={callid}>
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
                        <Button onClick={() => deleteTicket(callid, ticketData)} className="mr-2 bg-red">Delete</Button>
                        <Button onClick={onClose} className="mr-2 bg-orange">Close</Button>
                    </div>
                </div>
            </div>
        ))}
    </>
    );
}
'use client'

import React from 'react';
import { Button } from "@/components/ui/button"

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

import {useState, useEffect} from 'react';
import { TicketDeletion } from "@/components/component/ticket-deleted";

import { toast } from 'react-hot-toast';
import { Undo2, CircleSlash2, CircleSlash, Check  } from "lucide-react";

import { useContext } from 'react';
import { TicketsContext } from './ticketsModule';

interface EachTicketsProps {
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

export const EachTicketsModule = ({ onClose }: EachTicketsProps) => {
    const ticket = useContext(TicketsContext);

    if (!ticket) {
        return <div>No data available</div>;
    }

    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deletionId, setDeletionId] = useState(0);

    console.log("MY TICKETSCONTEXT URGENT VALUE:", ticket)

    const takeLoggedTicket = async (ticket: any) => {
        let customerData = ticket.Customer
        let supportNo = null;

        if (ticket.Customer.includes(",")) {
            const customerArray = ticket.Customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        try {
            const payLoad = {
                employee: ticket.Empl,
                customer: customerData,
                activity: ticket.Problem,
                phoneNumber: ticket.Phone_Number,
                clientAnydesk: ticket.Clients_Anydesk,
                startTime: new Date(ticket.Time).toISOString().slice(0, 19).replace('T', ' '),
                type: ticket.Type,
                supportNo: supportNo,
                comments: ticket.Comments,
                name: ticket.Name,
                timeTaken: new Date().toISOString().slice(0, 19).replace('T', ' '),
                issueType: ticket.IssueType,
            };

            const response = await axios.post(`${apiEndPoint}/tickets/insertloggedticket`, payLoad);
            console.log('Ticket taken successfully:', response.data);

            await updateTakenTicket(ticket.Call_ID);

        } catch (error) {
            console.error('Error taking ticket:', error);
        }
    }

    const updateTakenTicket = async (callId: number) => {
        try {
            const endTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to match SQL datetime format
            const updateUrl = `${apiEndPoint}/tickets/updateloggedticket/${encodeURIComponent(endTime)}/${callId}`;
            const updateResponse = await axios.patch(updateUrl);

            console.log('Ticket updated successfully:', updateResponse.data);

            // Remove the ticket from the local state to reflect the change in the UI
            // This is optional if you want to update the state or UI
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    }

    async function deleteTicket(callID: any) {
    try {
        //const deleteTicket = ticket?.find((ticket: { Call_ID: number; }) => ticket.Call_ID === callID);
        // Ensure ticket is an array of tickets
        if (!Array.isArray(ticket)) {
            throw new Error('Tickets data is not an array');
        }

        // Find the ticket with the specified callID
        const deleteTicket = ticket.find((ticket: CheckProps) => ticket.Call_ID === callID);


        if (!deleteTicket) {
            throw new Error(`Ticket with callID ${callID} not found.`);
        }

        setDeletionId(deleteTicket.Call_ID)
        console.log('SHOW ME THE DELETED CallID MY NIGGA!!!!!!!!!!!!!!!!!!!!!!!!:', deleteTicket.Call_ID)


        // Extract necessary data from the ticket
        // clientname, phonenumber, startime, supportnumber, priority, issueType, type, comments, insertiontime
        const { Empl, Customer, Problem, Name, Phone_Number, Time, Support_No, IssueType, Comments, urgent } = deleteTicket;

        let customerData = ticket?.Customer
        let supportNo = null;

        if (ticket?.Customer.includes(",")) {
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
        console.log('Ticket DELETED successfully with useContext:', response.data);
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
        <div className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md">{ticket.Call_ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{ticket.Empl || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p>{ticket.Support_No || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md">{ticket.IssueType || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{ticket.Customer}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{ticket.Problem || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time</p>
                            <p>{new Date(ticket.Time).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">Logger</p>
                            <p>{ticket.logger || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{ticket.Name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{ticket.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{ticket.Comments || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${ticket.urgent === 1 ? 'text-red' : ticket.urgent === 2 ? 'text-orange' : ticket.urgent === 0 ? 'text-grey' : ''}`}>
                                {ticket.urgent === 1 ? "Urgent" : ticket.urgent === 2 ? "Moderate" : "Low"}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button onClick={() => takeLoggedTicket(ticket)} className="mr-2 bg-green">Take Call</Button>
                        <Button onClick={() => deleteTicket(ticket.Call_ID)} className="mr-2 bg-red">Delete</Button>
                        <Button onClick={onClose} className="mr-2 bg-orange">Close</Button>
                    </div>
                </div>
            </div>
    </>
    );
}
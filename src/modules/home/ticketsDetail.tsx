'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import {useState, useEffect} from 'react';
import { TicketDeletion } from "@/components/component/ticket-deleted";
import { EditCall } from "@/components/component/edit-call";
import { toast } from 'react-hot-toast';
import { Minimize2, Check, Trash2, PhoneOutgoing, PencilRuler } from "lucide-react";
import { useContext } from 'react';
import { TicketsContext } from './ticketsModule';
import { useSession } from '@/context';

interface EachTicketsProps {
    onClose: () => void;
}

export const EachTicketsModule = ({ onClose }: EachTicketsProps) => {
    const [editCallPopUp, setEditCallPopUp] = useState(false);
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deletionId, setDeletionId] = useState(0);
    const ticket = useContext(TicketsContext);
    const { user } = useSession();

    if (!ticket) {
        return <div>No data available</div>;
    }

    const startCallNotification = () => {
        toast.success('Ticket has been started successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const takeLoggedTicket = async (ticket: any) => {
        let customerData = ticket.Customer
        let supportNo;

        if (ticket.Customer.includes(",")) {
            const customerArray = ticket.Customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        const formatDateToMySQL = (dateString: any) => {
            const date = new Date(dateString);
            return date.getFullYear() + '-' + 
                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(date.getDate()).padStart(2, '0') + ' ' + 
                  String(date.getHours()).padStart(2, '0') + ':' + 
                  String(date.getMinutes()).padStart(2, '0') + ':' + 
                  String(date.getSeconds()).padStart(2, '0');
          };

        try {
            const payLoad = {
                employee: ticket.Empl,
                customer: customerData,
                activity: ticket.Problem,
                phoneNumber: ticket.Phone_Number,
                clientAnydesk: ticket.Clients_Anydesk,
                startTime: formatDateToMySQL(ticket.Time),
                type: ticket.Type,
                supportNo: supportNo,
                comments: ticket.Comments,
                name: ticket.Name,
                email_address: ticket.Email_Address,
                timeTaken: new Date().toISOString().slice(0, 19).replace('T', ' '),
                issueType: ticket.IssueType,
                priority: ticket.urgent,
            };

            const response = await axios.post(`${apiEndPoint}/tickets/insertloggedticket`, payLoad);
            console.log('Ticket taken successfully:', response.data);
            startCallNotification()

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

    const undoNotification = () => {
        toast.success('Ticket deleted successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const deleteTicket = async (callID: any) => {
    try {
        if (!ticket) {
            return <div>No data available</div>;
        }

        setDeletionId(callID)
        console.log('SHOW ME THE DELETED CallID MY NIGGA!!!!!!!!!!!!!!!!!!!!!!!!:', callID)

        let customerData = ticket?.Customer
        let supportNo 

        // if (ticket?.Customer.includes(",")) {
        //     const customerArray = ticket.Customer.split(",");
        //     customerData = customerArray[0].trim();
        //     supportNo = customerArray[1].trim();
        // }

        // Create payload object
        const payload = {
            callid: callID,
            employee: ticket.Empl,
            customer: ticket.Customer,
            problem: ticket.Problem,
            clientname: ticket.Name,
            phonenumber: ticket.Phone_Number,
            startime: ticket.Time,
            supportnumber: ticket.Support_No,
            priority: ticket.Priority,
            issueType: ticket.IssueType,
            comments: ticket.Comments,
            insertiontime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };


        const response = await axios.post(`${apiEndPoint}/tickets/insertdeletedticket`, payload);
        console.log('Ticket DELETED successfully with useContext:', response.data);
        undoNotification();
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

    const filterCustomer = () => {
        if (ticket.Customer.includes(":")) {
            let customerData = ticket.Customer.split(":")[0].trim();
            let supportNo = ticket.Customer.split(":")[1].trim();
            return { customerData, supportNo };
        } else {
            return { customerData: ticket.Customer, supportNo: null };
        }
    }

    const toggleEditCall = () => {
        setEditCallPopUp(!editCallPopUp);
        console.log("open my edit call model")
    }

    const { customerData, supportNo } = filterCustomer();


    return (
    <>
    {editCallPopUp && <EditCall closeEdit={toggleEditCall} data={ticket} />}
    {deletePopUp && <TicketDeletion callId={deletionId} onClose={toggleDeletePage} />}
        <div className="p-4 pg-background">
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
                        <div className="mb-4 mt-6">
                            <p className="font-medium text-gray-500 text-md">Client Email</p>
                            <p className="font-semibold text-md">{ticket.Email_Address || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-8">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p className="font-semibold text-md">{supportNo || ticket.Support_No || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{ticket.Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{customerData || ticket.Customer || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{ticket.Problem || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold text-gray-500 text-md">Start Time</p>
                            <p className="font-semibold text-md">{new Date(ticket.Time).toLocaleString()}</p>
                        </div>
                        <div className="mb-4 mt-8">
                            <p className="font-semibold text-gray-500 text-md">Logger</p>
                            <p className="font-semibold text-md">{ticket.logger || '--:--'}</p>
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
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className={`font-semibold text-md ${ticket.IssueType ? (ticket.IssueType === 'Task' ? 'text-green' : 'text-red') : 'header-text'}`}>{ticket.IssueType || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-8">
                            <p className="font-medium text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${ticket.Priority === 'P1' ? 'text-red' : ticket.Priority === 'P2' ? 'text-orange' : (ticket.Priority === 'P3' || ticket.Priority === 'P4') ? 'text-gray-500' : ''}`}>
                                {ticket.Priority || '--:--'}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <button onClick={() => takeLoggedTicket(ticket)} className="save-detail">
                            <span>Take</span>
                            <PhoneOutgoing size={18} strokeWidth={2} className="ml-2" />
                        </button>
                        <button onClick={ toggleEditCall } className="edit-detail">
                            <span>Edit</span>
                            <PencilRuler size={18} strokeWidth={2} className="ml-2" />
                        </button>
                        <button onClick={() => deleteTicket(ticket.Call_ID)} className="cancel-detail">
                            <span>Delete</span>
                            <Trash2 size={18} strokeWidth={2} className="ml-2" />
                        </button>
                        <button onClick={ onClose } className="close-detail">
                            <span>Close</span>
                            <Minimize2 size={18} strokeWidth={2} color="white" className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
    </>
    );
}
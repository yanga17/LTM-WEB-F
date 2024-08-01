'use client'

import * as React from "react"
import {useState, useEffect, useRef} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { X, Check  } from "lucide-react";


interface TicketDeletedProps {
callId: number;
onClose: () => void; 
}


export function TicketDeletion({ callId, onClose }: TicketDeletedProps ){
    const [reason, setReason] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const deleteNotification = () => {
        toast.success('Ticket Deleted successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const saveReason = async () => {
    if (reason.trim() === '') {
        textareaRef.current?.focus();
        return;
    }

    try {
        const deleteTicketUrl = `tickets/deletecallreason/${reason}/${callId}`
        const updatedReason = await axios.patch<TicketDeletedProps>(`${apiEndPoint}/${deleteTicketUrl}`);
        console.log("TICKETSOLUTION UPDATED SOLUTION SUCCESSFULLY");

        // Make the delete API call after updating the reason
        const ticketDeleteUrl = `tickets/deleteloggedticket/${callId}`;
        await axios.delete<TicketDeletedProps>(`${apiEndPoint}/${ticketDeleteUrl}`);
        console.log("TICKET DELETED SUCCESSFULLY");

        deleteNotification();
        onClose();

    } catch (error) {
        
    }
    } //const deleteUrl = `tickets/deleteloggedticket/${callId}`

    

    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.borderColor = reason.trim() === ''? 'ed' : 'initial';
    }
    }, [reason]);


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 w-160 rounded-md shadow overlay">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-bold dash-text">Reasoning</h1>
                    <div className="flex items-center hover:cursor-pointer">
                        <X size={24} strokeWidth={2} color="red" onClick={onClose} />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="solution">
                        Please enter a reason why the ticket was deleted:
                    </label>
                    <Textarea
                    className="w-full p-2 border border-gray-200 rounded-md dark:border-gray-800"
                    id="solution"
                    ref={textareaRef}
                    onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <Button className="w-full bg-green" onClick={saveReason}>Save</Button>
                </div>
            </div>
        </div>
    )
}

function DoorClosedIcon(props: any) {
return (
    <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    >
    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
    <path d="M2 20h20" />
    <path d="M14 12v.01" />
    </svg>
)
}


function MaximizeIcon(props: any) {
return (
    <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    >
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
)
}

function MinimizeIcon(props: any) {
return (
    <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    >
    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
)
}
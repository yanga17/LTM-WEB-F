'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";
import { Check, CheckCheck, X } from "lucide-react";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {EyeIcon, PlusIcon, MinusIcon} from "@/components/component/tickets-table"
import { EachActiveTicketsModule } from "./activeTicketsDetail";
import OctagonAlert from 'lucide-react';

import alert from '../../assets/alert.svg';
import Image from 'next/image';


interface ActiveProps {
    ID: number,
    Employee: string,
    Customer: string,
    Activity: string,
    Clients_Anydesk: number,
    Phone_Number: number,
    StartTime: string,
    EndTime: string,
    Duration: number,
    Type: string,
    Solution: string,
    Support_No: number,
    Comments: string,
    FollowUp: string,
    Completed: number,
    Name: string,
    number_of_days: number,
    Time_Taken: number,
    IssueType: string,
}

type ActiveResponseType = ActiveProps[]

interface DetailTicketProps {
    ID: number,
    Employee: string,
    Customer: string,
    Activity: string,
    Clients_Anydesk: number,
    Phone_Number: number,
    StartTime: string,
    EndTime: string,
    Duration: number,
    Type: string,
    Solution: string,
    Support_No: number,
    Comments: string,
    FollowUp: string,
    Completed: number,
    Name: string,
    number_of_days: number,
    Time_Taken: number,
    IssueType: string,
}

export type DetailResponseType = DetailTicketProps[]


export const ActiveTicketsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<DetailResponseType>([]); //view ticket holds my returned data
    const [callId, setCallID] = useState(0);

    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });


    const url = `tickets/getactivetickets`
    const { data, loading, error } = useQuery<ActiveResponseType>(url);


    const generateEachTicket = async (currentCallId: number) => {
        try {

            const ticketsurl = `tickets/getactivetickets/${currentCallId}`
            const eachActiveTicket = await axios.get<ActiveResponseType>(`${apiEndPoint}/${ticketsurl}`);

            setViewTicket(eachActiveTicket.data)
            console.log('show me the data fam', viewticket);
            

        } catch (error) {
            console.log('error loading EAch ACTIVE TICKET')
        }

    }
    
    const endTicket = async (currentemployee: string, callid: number) => {
        try {

            const endurl = `tickets/endticket/${currentemployee}/${callid}`
            const response = await axios.patch<ActiveResponseType>(`${apiEndPoint}/${endurl}`);
            setViewTicket(response.data)

            console.log('Ticket ended successfully:', response.data);

        } catch (error) {

            console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

        }
    }

    //open and close
    // const openModal = (parameter: any) => {
    //     if (currentOpen === parameter) {
    //     setState({ ...state, isOpen: false, expandView: null });
    //     setCurrentOpen('');
    //     setViewTicket([]);
    //     } else {
    //     setCurrentOpen(parameter);
    //     setState({ ...state, isOpen: true, expandView: parameter });
    //     setCallID(parameter);
    
    //     setViewTicket([]); // Reset viewticket when opening a new ticket to ensure previous ticket data is not displayed
    //     generateEachTicket(parameter); // Call generateEachTicket here to load the new ticket data
    //     console.log('lets see this my callid', parameter);
    //     }
    // }

    const openModal = (parameter: any) => {
        if (currentOpen === parameter) {
            return; // Do nothing if the ticket is already open
        }

        setCurrentOpen(parameter);
        setState({ ...state, isOpen: true, expandView: parameter });
        setCallID(parameter);
    
        setViewTicket([]); // Reset viewticket when opening a new ticket to ensure previous ticket data is not displayed
        generateEachTicket(parameter); // Call generateEachTicket here to load the new ticket data
        console.log('lets see this my callid', parameter);
    }

    const closeModal = () => {
        setState({ ...state, isOpen: false, expandView: null });
        setCurrentOpen('');
        //setViewTicket([]); // Optionally reset the view ticket data
    };

    const triggerToastError = () => {
        toast.error('We encountered an error loading data within Active Tickets Table.', {
            icon: <span role="img" aria-label="cross-mark" style={{ marginRight: '0.5rem' }}>❌</span>,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    const toastNodata = () => {
        toast.error('There is no data within the Active Tickets table.', {
            icon: <span role="img" aria-label="cross-mark" style={{ marginRight: '0.5rem' }}>❌</span>,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };


    if (loading) {
        return (
            <>
            {
            [...Array(500)].map((_, index) => (
                <>
                    <TableRow key={index}>
                    <TableCell className="font-medium">
                        <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                    </TableCell>
                    <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[120px]">
                        <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                    </TableCell>
                    <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">
                        <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                    </TableCell>
                    <TableCell>
                        <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex gap-2">
                            <Button
                                disabled
                                size="sm"
                                className="bg-purple">
                                {/* <span>View</span> */}
                                <EyeIcon className="h-4 w-4 ml-2" />
                            </Button>
                            <Button
                                disabled
                                size="sm"
                                className="bg-red">
                                {/* <span>End</span> */}
                                <MinusIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                </>
            ))}
            </>
        )
    }

    if (error) {
        triggerToastError();
    }

    if (!data && !isEmpty(data)) {
        toastNodata();
    }

    const activecheckInLog = data?.map((property) => ({
    callid: property?.ID,
    customer: property.Customer,
    problem: property.Activity,
    clAnydesk: property.Clients_Anydesk,
    phoneNumber: property.Phone_Number,
    time: new Date(property.StartTime).toLocaleString(),
    endtime: property.EndTime,
    duration: property.Duration,
    type: property.Type,
    solution: property.Solution,
    support_no: property.Support_No,
    comments: property.Comments,
    followup: property.FollowUp,
    completed: property.Completed,
    name: property.Name,
    numberOfDays: property.number_of_days,
    timetaken: property.Time_Taken,
    issuetype: property.IssueType,
    employee: property.Employee
    }))

    return (
    <>
    {activecheckInLog?.map(({ callid, customer, problem, name, time, employee }, index) => (
        <>
            <TableRow key={callid}>
            <TableCell className="font-medium">{callid}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">{customer}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">{problem}</TableCell>
            <TableCell className="max-w-[200px]">{name}</TableCell>
            <TableCell className="max-w-[200px] text-center">{time}</TableCell>
            <TableCell className="text-center">
                <div className="flex gap-2">
                    <Button size="sm" className="bg-purple" onClick={() => { openModal(callid)}}>
                        {/* <span>View</span> */}
                        <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-red" onClick={() => { endTicket( employee, callid)}}>
                        {/* <span>End</span> */}
                        <MinusIcon className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
            </TableRow>
            {state.isOpen && state.expandView === callid && (
                <TableRow>
                    <TableCell colSpan={6} className="p-0">
                        <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                            <EachActiveTicketsModule ticketData={viewticket} callid={callid} onClose={closeModal}/>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    ))}
    </>
);
}
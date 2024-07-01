'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";

import { Button } from "@/components/ui/button"
import {EyeIcon, MinusIcon} from "@/components/component/tickets-table"
import { EachActiveTicketsModule } from "./activeTicketsDetail";
import { TicketSolution } from "@/components/component/ticket-solution";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import { Loader, CircleSlash2, CircleSlash  } from "lucide-react";

export interface ActiveProps {
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
    Priority: number
}

export type ActiveResponseType = ActiveProps[]

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
    Priority: number
}

export type DetailResponseType = DetailTicketProps[]


export const ActiveTicketsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<DetailResponseType>([]); //view ticket holds my returned data
    const [callId, setCallID] = useState(0);

    const [solutionPopup, setSolutionPopup] = useState(false);
    const [transferPopUp, setTransferPopUp] = useState(false);

    const [solutionid, setSolutionId] = useState(0);
    const [transferid, setTransferId] = useState(0);
    const [transferedEmployee, setTransferEmployee] = useState('');
    

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

            setSolutionId(callid)
            setSolutionPopup(true)
            toast.success('Ticket has been ended successfully.');

            console.log('Ticket ended successfully:', response.data);

        } catch (error) {

            console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

        }
    }

    // const transferTicket = async (transferemployee: string, callid: number) => {
    //     try {
    //         //transferTicket - transferTicket
    //         const transferurl = `tickets/endticket/${transferemployee}/${callid}`
    //         const response = await axios.patch<ActiveResponseType>(`${apiEndPoint}/${transferurl}`);
    //         setViewTicket(response.data)

    //         setSolutionId(callid)
    //         setSolutionPopup(true)
    //         //setMinusClicked(true);

    //         console.log('Ticket ended successfully:', response.data);

    //     } catch (error) {

    //         console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

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

    const toggleSolution = () => {
        setSolutionPopup(!solutionPopup);
    }

    const toggleTransfer = () => {
        setTransferPopUp(!transferPopUp);
    }


    if (loading) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <Loader className="h-14 w-14" />
                        <p className="text-gray-500 text-lg mt-2 text-center">Loading Data, Please be patient</p>
                    </div>
                </td>
            </tr>
        );
    }

    if (error) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-14 w-14" />
                        <p className="text-red text-lg mt-2 text-center">An Error was encountered when fetching Data!</p>
                    </div>
                </td>
            </tr>
        );
    }
    
    if (!data && !isEmpty(data)) {
        return (
        <>
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash2 className="h-14 w-14" />
                        <p className="text-green text-lg mt-2 text-center">THERE ARE CURRENTLY NO ACTIVE TICKETS BEING WORKED ON</p>
                    </div>
                </td>
            </tr>
        </>
        )
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
    employee: property.Employee,
    priority: property.Priority
    }))

    return (
        <>
            {transferPopUp && <TicketTransfer callId={transferid} onClose={toggleTransfer} />}
            {solutionPopup && <TicketSolution callId={solutionid} onClose={toggleSolution} />}
        
            {activecheckInLog?.map(({ callid, customer, problem, name, time, employee, type, issuetype, phoneNumber }, index) => (
                <>
                    <tr key={callid}>
                        <td className="px-2">{callid}</td> 
                        <td className="p-2 whitespace-nowrap truncate">{customer}</td>
                        <td className="p-2 whitespace-nowrap truncate">{problem || '--:--'}</td>
                        <td className="p-2">{name || '--:--'}</td>
                        <td className="p-2">{time}</td>  
                        <td className="p-2">{employee}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-purple  w-20 md:w-20" onClick={() => { openModal(callid)}}>
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="bg-red w-20 mr-2 md:w-20 md:mr-2" onClick={() => { endTicket( employee, callid)}}>
                                    <MinusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </td>
                    </tr>
                    {state.isOpen && state.expandView === callid && (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                    <EachActiveTicketsModule ticketData={viewticket} callid={callid} onClose={closeModal}/>
                                </div>
                            </td>
                        </tr>
                    )}
                </>
            ))}
        </>
    );
}
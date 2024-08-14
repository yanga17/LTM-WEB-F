'use client'

import * as React from "react"
import {useState, useEffect, createContext } from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button"
import { EachActiveTicketsModule } from "./activeTicketsDetail";
import { TicketSolution } from "@/components/component/ticket-solution";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import { Loader, CircleSlash, PhoneOff, PanelTopOpen, Ellipsis } from "lucide-react";
import { useSession } from "@/context";

export interface ActiveProps {
    ID: number,
    Employee: string,
    Customer: string,
    Activity: string,
    Clients_Anydesk: string,
    Phone_Number: string,
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
    Email_Address: string,
    number_of_days: number,
    Time_Taken: string,
    IssueType: string,
    Priority: string
}

export type ActiveResponseType = ActiveProps[]


export const ActiveTicketsContext = createContext<ActiveProps | null>(null);

const Admin = ['Markus', 'Kats', 'Manny', 'Morne', 'Stefan', 'Brandon Nhlanhla', 'Admin', 'Yanga']

export const ActiveTicketsModule = () => {
    const { user } = useSession();

    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<ActiveProps | null>(null);
    //const [callId, setCallID] = useState(0);

    const [solutionPopup, setSolutionPopup] = useState(false);
    const [transferPopUp, setTransferPopUp] = useState(false);

    const [solutionid, setSolutionId] = useState(0);
    const [transferid, setTransferId] = useState(0);
    const [userTickets, setUserTickets] = useState<ActiveResponseType>([]);

    const [loadingUserTickets, setLoadingUserTickets] = useState(false);
    const [errorUserTickets, setErrorUserTickets] = useState(false);

    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });

    const url = `tickets/getactivetickets`
    const { data, loading, error } = useQuery<ActiveResponseType>(url);

    
    const endTicket = async (currentemployee: string, callid: number) => {
        try {

            const endurl = `tickets/endticket/${currentemployee}/${callid}`;
            const response = await axios.patch<ActiveResponseType>(`${apiEndPoint}/${endurl}`);
            //setViewTicket(response.data);

            setSolutionId(callid);
            setSolutionPopup(true);
            //toast.success('Ticket has been ended successfully.');
            console.log('Ticket ended successfully:', response.data);

            // await axios.post("http://localhost:4200/send-email", { callid });
            // console.log('EMAIL HAS BEEN SENT SUCCESSFULLY!!!!!!!!!!!!!!!');
            // toast.success('Email sent successfully.');

        } catch (error) {

            console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

        }
    }

    const generateUserTickets = async () => {
        //http://localhost:4200/tickets/getactiveusertickets/Yanga
        setLoadingUserTickets(true)
        try {
            const userUrl = `tickets/getactiveusertickets/${user?.emp_name}`
            const response = await axios.get<ActiveResponseType>(`${apiEndPoint}/${userUrl}`);
            setUserTickets(response?.data)
            console.log('User Active Tickets Returned:', response.data)
        } catch (error) {
            console.log('An error occurred while fetching User Active Tickets:', error);
            setErrorUserTickets(true);
        }
        setLoadingUserTickets(false);
    }

    const openModal = (id: any) => {
        if (currentOpen === id) {
            setCurrentOpen('');
            setState({ ...state, isOpen: false, expandView: null });

        } else {
            setCurrentOpen(id);
            setState({ ...state, isOpen: true, expandView: id});

            const selectedTicket = data?.find(client => client.ID === id || null);

            if (selectedTicket) {
                setViewTicket(selectedTicket);
            }

            console.log('lets see my seletected ticket from view', selectedTicket);
        }
    }

    const closeModal = () => {
        setState({...state, isOpen: false, expandView: null });
        setCurrentOpen('');
    }

    const toggleSolution = () => {
        setSolutionPopup(!solutionPopup);
    }

    const toggleTransfer = () => {
        setTransferPopUp(!transferPopUp);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            generateUserTickets();
        }, 1200000); //2min

        return () => clearInterval(interval); 
    }, []);

    const loggedInUser = Admin.includes(user?.emp_name ?? '');
    
    //AllTicketsLoadingData State
    if (loading) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <Loader className="h-12 w-12" />
                        <p className="text-gray-500 text-lg mt-2 text-center uppercase">Loading data, Please be patient</p>
                    </div>
                </td>
            </tr>
        );
    }

    //userLoadingState
    if (loadingUserTickets) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <Loader className="h-12 w-12" />
                        <p className="text-gray-500 text-lg mt-2 text-center uppercase">Loading data, Please be patient</p>
                    </div>
                </td>
            </tr>
        );
    }

    //userErrorState
    if (error) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-12 w-12" />
                        <p className="text-red text-lg mt-2 text-center uppercase">An Error was encountered when fetching Data. Please refresh the page!</p>
                    </div>
                </td>
            </tr>
        );
    }

    //userError State
    if (!loggedInUser && errorUserTickets) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-12 w-12" />
                        <p className="text-red text-lg mt-2 text-center uppercase">An error was encountered when fetching tickets data, please refresh the page!</p>
                    </div>
                </td>
            </tr>
        );
    }

    //AllTicketsNoData State
    if (data?.length === 0) {
        return (
        <>
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <PanelTopOpen className="h-12 w-12" />
                        <p className="text-green text-lg mt-2 text-center uppercase">There are currently no user Active Tickets being worked on</p>
                    </div>
                </td>
            </tr>
        </>
        )
    }

    //userNoData State
    if (!loggedInUser && userTickets?.length === 0) {
        return (
        <>
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <PanelTopOpen className="h-12 w-12" />
                        <p className="text-green text-lg mt-2 text-center uppercase">there are currently no user active tickets being worked on</p>
                    </div>
                </td>
            </tr>
        </>
        )
    }

    const activecheckInLog = data?.map((property) => ({
        callid: property?.ID,
        customer: property.Customer.includes(':') ? property.Customer.split(':')[0].trim() : property.Customer,
        problem: property.Activity,
        clAnydesk: property.Clients_Anydesk,
        phoneNumber: property.Phone_Number,
        time: property.StartTime ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(property.StartTime)) : '--:--',
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

    const userActiveTicketsLog = userTickets?.map((property) => ({
        callid: property?.ID,
        customer: property.Customer.includes(':') ? property.Customer.split(':')[0].trim() : property.Customer,
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

    const roleData = loggedInUser ? activecheckInLog : userActiveTicketsLog;

    return (
        <>
        <ActiveTicketsContext.Provider value={viewticket}>
            {transferPopUp && <TicketTransfer callId={transferid} onClose={toggleTransfer} />}
            {solutionPopup && <TicketSolution callId={solutionid} onClose={toggleSolution} />}
        
            {roleData?.map(({ callid, customer, problem, name, time, employee, type, issuetype, phoneNumber }, index) => (
                <>
                    <tr key={callid} className="border-b">
                        <td className="px-2 sm:text-sm md:text-base">{callid || '--:--'}</td> 
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{customer || '--:--'}</td>
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{problem || '--:--'}</td>
                        <td className="p-2 hidden lg:table-cell whitespace-nowrap truncate uppercase">{name || '--:--'}</td>
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{time || '--:--'}</td>  
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{employee || '--:--'}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <button className="view" onClick={() => { openModal(callid)}}>
                                    <Ellipsis size={18} strokeWidth={2} />
                                </button>
                                <button className="cancel" onClick={() => { endTicket( employee, callid)}}>
                                    <PhoneOff size={18} strokeWidth={2} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    {state.isOpen && state.expandView === callid && (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                    <EachActiveTicketsModule onClose={closeModal}/>
                                </div>
                            </td>
                        </tr>
                    )}
                </>
            ))}
            </ActiveTicketsContext.Provider>
        </>
    );
}
'use client'

import * as React from "react"
import {useState, useEffect, createContext } from 'react';
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { EachActiveTicketsModule } from "./activeTicketsDetail";
import { TicketSolution } from "@/components/component/ticket-solution";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import { Loader, CircleSlash, PhoneOff, PanelTopOpen, Ellipsis } from "lucide-react";
import { useSession } from "@/context";
import { format } from "date-fns";

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

    
    const endTicket = async (callid: number) => {
        try {
            ///endticket/:endtime/:callid
            const ticketDate = format(
                new Date(),
                "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
            );

            const endurl = `tickets/endticket/${ticketDate}/${callid}`;
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
        //http://localhost:4200/tickets/getactiveusertickets/Robin
        setLoadingUserTickets(true)
        try {
            const userUrl = `tickets/getactiveusertickets/${user?.emp_name}`
            const response = await axios.get<ActiveResponseType>(`${apiEndPoint}/${userUrl}`);
            setUserTickets(response?.data)
            console.log('User Active Tickets Returned:', response.data)
            //toast.success("USER ACTIVE TICKETS HAS BEEN RETURNED SUCCESSFULLY!!");
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
        generateUserTickets();
    }, []);

    // Decide which tickets to display based on the user's role
    const ticketsToDisplay = user?.role === "Admin" ? data : userTickets;

    // Map and transform tickets for display, including necessary formatting
    const transformedTickets = ticketsToDisplay?.map((ticket) => ({
        ...ticket,
        Customer: ticket.Customer.includes(':') ? ticket.Customer.split(':')[0].trim() : ticket.Customer,
        StartTime: new Date(ticket.StartTime).toString().split(' ').slice(1, 5).join(' ')
    }));
    
    //AllTicketsLoadingData State
    if (loading || loadingUserTickets) {
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
    if (error || errorUserTickets) {
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

    if (transformedTickets?.length === 0) {
        return (
            <tr>
                <td colSpan={7} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <PanelTopOpen className="h-12 w-12" />
                        <p className="text-green text-lg mt-2 text-center uppercase">There are currently no active tickets being worked on</p>
                    </div>
                </td>
            </tr>
        );
    }

    console.log("USER ACTIVE TICKETS BELOW!!:", userTickets);


    return (
        <>
        <ActiveTicketsContext.Provider value={viewticket}>
            {transferPopUp && <TicketTransfer callId={transferid} onClose={toggleTransfer} />}
            {solutionPopup && <TicketSolution callId={solutionid} onClose={toggleSolution} />}
        
            {transformedTickets?.map(({ ID, Customer, Activity, Name, StartTime, Employee, Type }, index) => (
                <>
                    <tr key={ID} className="border-b">
                        <td className="px-2 sm:text-sm md:text-base">{ID || '--:--'}</td> 
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Customer || '--:--'}</td>
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Activity || '--:--'}</td>
                        <td className="p-2 hidden lg:table-cell whitespace-nowrap truncate uppercase">{Name || '--:--'}</td>
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">
                            {StartTime ? `${new Date(StartTime).toString().split(' ').slice(1, 5).join(' ')}` : '--:--'}
                        </td>
                        <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Employee || '--:--'}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <button className="view" onClick={() => { openModal(ID)}}>
                                    <Ellipsis size={18} strokeWidth={2} />
                                </button>
                                <button className="cancel" onClick={() => { endTicket(ID)}}>
                                    <PhoneOff size={18} strokeWidth={2} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    {state.isOpen && state.expandView === ID && (
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
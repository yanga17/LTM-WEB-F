'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {EyeIcon, PlusIcon, MinusIcon} from "@/components/component/tickets-table"
import { EachTicketsModule } from "./ticketsDetail";

//interface for all tickets - tblcalls
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

//interface for each ticket
interface EachProps {
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
}

export type ResponseTypeEachTicket = EachProps[]


export const TicketsModule = () => {
  const [currentOpen, setCurrentOpen] = useState('');
  const [viewticket, setViewTicket] = useState<ResponseTypeEachTicket>([]); //view ticket holds my returned data

  const [callId, setCallID] = useState(0);

  const [tickets, setTickets] = useState<ResponseType>([]);
  const [state, setState] = useState({
    isOpen: true,
    expandView: null
  });

  const url = `tickets/getickets`
  const { data, loading, error } = useQuery<ResponseType>(url); 


    const generateEachTicket = async (currentCallId: number) => {
      try {

        const url = `tickets/getickets/${currentCallId}`
        const eachticket = await axios.get<ResponseTypeEachTicket>(`${apiEndPoint}/${url}`);

        setViewTicket(eachticket.data)
        console.log('TICKETS UPLOADED', viewticket)

      } catch (error) {

        console.error('error loading each ticket:', error);

      }
    }

    const takeTicket = async (ticket: CheckProps) => {
      try {
        const payLoad = {
          employee: ticket.Empl,
          customer: ticket.Customer,
          activity: ticket.Problem,
          phoneNumber: ticket.Phone_Number,
          clientAnydesk: ticket.Clients_Anydesk,
          startTime: new Date(ticket.Time).toISOString().slice(0, 19).replace('T', ' '),
          type: ticket.Type,
          supportNo: ticket.Support_No,
          comments: ticket.Comments,
          name: ticket.Name,
          timeTaken: new Date().toISOString().slice(0, 19).replace('T', ' '),
          issueType: ticket.IssueType
        };
    
        const response = await axios.post(`${apiEndPoint}/tickets/inserttickets`, payLoad);
        console.log('Ticket taken successfully:', response.data);
    
        // After successfully taking the ticket, call updateTakenTicket to update the EndTime and Taken status
        await updateTakenTicket(ticket.Call_ID);
    
      } catch (error) {
        console.error('Error taking ticket:', error);
      }
    }
    
    const updateTakenTicket = async (callId: number) => {
      try {
        const endTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format to match SQL datetime format
        // Use PATCH method and include EndTime and Call_ID in the URL
        const updateUrl = `${apiEndPoint}/tickets/updateticket/${encodeURIComponent(endTime)}/${callId}`;
        const updateResponse = await axios.patch(updateUrl);
    
        console.log('Ticket updated successfully:', updateResponse.data);
    
        // Remove the ticket from the local state to reflect the change in the UI
        setTickets(prevTickets => prevTickets.filter(t => t.Call_ID !== callId));
    
      } catch (error) {
        console.error('Error updating ticket:', error);
      }
    }

    

    useEffect(() => {
      if (data) {
        setTickets(data);
        console.log('REFRESED LOGGED TICKETS', data);
      }

    }, [data]);

    // const openModal = (parameter: any) => {
    //   if (currentOpen === parameter) {
    //     setState({ ...state, isOpen: false, expandView: null });
    //     setCurrentOpen('');
    //     setViewTicket([]);
    //   } else {
    //     setCurrentOpen(parameter);
    //     setState({ ...state, isOpen: true, expandView: parameter });
    //     setCallID(parameter);
  
    //     setViewTicket([]); // Reset viewticket when opening a new ticket to ensure previous ticket data is not displayed
    //     generateEachTicket(parameter); // Call generateEachTicket here to load the new ticket data
    //   }
    // }

    const openModal = (parameter: any) => {
      if (currentOpen === parameter) {
        return;
      }

      setCurrentOpen(parameter);
      setState({ ...state, isOpen: true, expandView: parameter });
      setCallID(parameter);

      setViewTicket([]); // Reset viewticket when opening a new ticket to ensure previous ticket data is not displayed
      generateEachTicket(parameter); // Call generateEachTicket here to load the new ticket data
    }

    const closeModal = () => {
    setState({...state, isOpen: false, expandView: null });
    setCurrentOpen('');
    }

    const triggerToastError = () => {
      toast.error('We encountered an error loading data within Logged Tickets Table.', {
          icon: <span role="img" aria-label="cross-mark" style={{ marginRight: '0.5rem' }}>❌</span>,
          style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
          },
      });
  };

  const toastNodata = () => {
      toast.error('There is no data within the Logged Tickets table.', {
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
                            <span>View</span>
                            <EyeIcon className="h-4 w-4 ml-2" />
                        </Button>
                        <Button
                            disabled
                            size="sm"
                            className="bg-green">
                            <span>Take</span>
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

  // const checkInLog = data?.map((property) => ({
  //   Call_ID: property?.Call_ID,
  //   Customer: property.Customer,
  //   Problem: property.Problem,
  //   Clients_Anydesk: property.Clients_Anydesk,
  //   Phone_Number: property.Phone_Number,
  //   Time: new Date(property.Time).toISOString().slice(0, 19).replace('T', ' '),
  //   EndTime: property.EndTime,
  //   Duration: property.Duration,
  //   Taken: property.Taken,
  //   Support_No: property.Support_No,
  //   Empl: property.Empl,
  //   logger: property.logger,
  //   Comments: property.Comments,
  //   Solution: property.Solution,
  //   Name: property.Name,
  //   urgent: property.urgent,
  //   IssueType: property.IssueType,
  //   Type: property.Type // Assuming there's a Type property you want to include as well
  // }));

  return (
    <>
      {tickets?.map(({ Call_ID, Customer, Problem, Name, Time }) => (
        <>
          <TableRow key={Call_ID}>
            <TableCell className="font-medium">{Call_ID}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[185px]">{Customer}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[175px]">{Problem}</TableCell>
            <TableCell className="max-w-[200px]">{Name}</TableCell>
            <TableCell className="max-w-[200px] text-center">
              {new Date(Time).toISOString().slice(0, 19).replace('T', ' ')}
            </TableCell> {/* Modified Time property here */}
            <TableCell className="text-center">
              <div className="flex gap-2">
                <Button size="sm" className="bg-purple" onClick={() => { openModal(Call_ID)}}>
                  {/* <span>View</span> */}
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button size="sm"
                  className="bg-green"
                  onClick={() => {
                    const selectedTicket = tickets.find(t => t.Call_ID === Call_ID);
                    if (selectedTicket) {
                        takeTicket(selectedTicket);
                        console.log('GRABBED THE SELECTED TICKET', selectedTicket);
                    } else {
                        console.error('Selected ticket not found');
                    }
                }}>
                  {/* <span>Take</span> */}
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {state.isOpen && state.expandView === Call_ID && (
            <TableRow>
              <TableCell colSpan={6} className="p-0">
                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                  <EachTicketsModule ticketData={viewticket} callid={Call_ID} onClose={closeModal}/>
                </div>
              </TableCell>
            </TableRow>
          )}
        </>
      ))}
    </>
  );
}
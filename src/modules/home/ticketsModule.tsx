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
import { Vault } from "lucide-react";
import { Undo2, CircleSlash2, CircleSlash  } from "lucide-react";

import { createContext } from "react";

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

export const TicketsContext = createContext<CheckProps | null>(null)


export const TicketsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<CheckProps | null>(null); 

    const [tickets, setTickets] = useState<ResponseType>([]);

    const [state, setState] = useState({
    isOpen: true,
    expandView: null
    });

    //gviewAll loggedTickets
    const url = `tickets/getickets`
    const { data, loading, error } = useQuery<ResponseType>(url); 

    //include logger once you've setup the userAuthentication what what
    const takeLoggedTicket = async (ticket: CheckProps) => {
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
          urgent: ticket.urgent,
        };

        const response = await axios.post(`${apiEndPoint}/tickets/insertloggedticket`, payLoad);
        toast.success('Ticket has been started successfully.');


        console.log('Ticket taken successfully:', response.data)
        console.log('my ticket priority:', ticket.urgent);
    
        await updateTakenTicket(ticket.Call_ID);
    
      } catch (error) {
        console.error('Error taking logged ticket:', error);
      }
    }
    
    const updateTakenTicket = async (callId: number) => {
      try {
        const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const updateUrl = `${apiEndPoint}/tickets/updateloggedticket/${encodeURIComponent(endTime)}/${callId}`;
        const updateResponse = await axios.patch(updateUrl);
    
        console.log('Ticket updated successfully:', updateResponse.data);
    
        setTickets(prevTickets => prevTickets.filter(t => t.Call_ID !== callId));
    
      } catch (error) {
        console.error('Error updating ticket:', error);
      }
    }
    

    // useEffect(() => {
    //   if (data) {
    //     setTickets(data);
    //     console.log('REFRESED LOGGED TICKETS', data);
    //   }

    // }, [data]);


    const openModal = (id: any) => {
      if (currentOpen === id) {
          setCurrentOpen('');
          setState({ ...state, isOpen: false, expandView: null });

      } else {
          setCurrentOpen(id);
          setState({ ...state, isOpen: true, expandView: id});

          const selectedTicket = data?.find(client => client.Call_ID === id || null);

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


    if (loading) {
      return (
          <>
          {
          [...Array(500)].map((_, index) => (
              <tr key={index}>
                  <td className="p-2 lg:w-[50px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[180px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[120px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[70px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[120px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[50px]">
                      <div className='bg-black-light animate-pulse py-4 w-full rounded'></div>
                  </td>
                  <td className="p-2 lg:w-[60px] text-center">
                      <div className="flex gap-2 justify-center">
                          <Button
                              disabled
                              size="sm"
                              className="bg-purple w-full">
                              <EyeIcon className="h-4 w-4 ml-2" />
                          </Button>
                          <Button
                              disabled
                              size="sm"
                              className="bg-green w-full">
                              <MinusIcon className="h-4 w-4 ml-2" />
                          </Button>
                      </div>
                  </td>
              </tr>
          ))}
          </>
      )
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
                    <p className="text-green text-lg mt-2 text-center">THERE ARE CURRENTLY NO LOGGED TICKETS!</p>
                </div>
            </td>
        </tr>
      </>
    )
    }


  return (
    <>
    <TicketsContext.Provider value={viewticket}>
      {data?.map(({ Call_ID, Customer, Problem, Name, Time, IssueType, Empl }) => (
        <>
          <tr key={Call_ID}>
            <td className="px-2">{Call_ID}</td>
            <td className="p-2 whitespace-nowrap truncate">{Customer}</td>
            <td className="p-2 whitespace-nowrap truncate">{Problem}</td>
            <td className="p-2">{Name}</td>
            <td className="p-2">
              {new Date(Time).toLocaleString()}
            </td>
            <td className="p-2">{Empl}</td>
            <td className="text-center">
              <div className="flex gap-2">
                <Button size="sm" className="bg-purple w-20" onClick={() => { openModal(Call_ID)}}>
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-green w-20"
                  onClick={() => {
                    const selectedTicket = tickets.find(t => t.Call_ID === Call_ID);
                    if (selectedTicket) {
                      takeLoggedTicket(selectedTicket);
                        console.log('INSERTED THE LOGGED TICKET TO tblTime x Updated EndTime in tblcalls', selectedTicket);
                    } else {
                        console.error('Selected ticket not found');
                    }
                }}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
          {state.isOpen && state.expandView === Call_ID && (
            <tr>
              <td colSpan={6} className="p-0">
                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                  <EachTicketsModule onClose={closeModal} />
                </div>
              </td>
            </tr>
          )}
          
        </>
      ))}
      </TicketsContext.Provider>
    </>
  );
}
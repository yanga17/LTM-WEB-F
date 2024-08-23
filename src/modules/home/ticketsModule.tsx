'use client'

import * as React from "react";
import {useState, useEffect, createContext } from 'react';
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { EachTicketsModule } from "./ticketsDetail";
import { Loader, CircleSlash2, CircleSlash, Check, PhoneOutgoing, Ellipsis, PanelTopOpen } from "lucide-react";
import { useSession } from '@/context';
import { format } from "date-fns";

//interface for all tickets - tblcalls
export interface CheckProps {
  Call_ID: number,
  Customer: string,
  Problem: string,
  Phone_Number: string,
  Name: string,
  Time: string,
  Empl: string,
  Email_Address: string
  Support_No: string,
  Clients_Anydesk: string,
  logger: string,
  Comments: string,
  Priority: string,
  IssueType: string,
  Type: string
}

type ResponseType = CheckProps[]

export const TicketsContext = createContext<CheckProps | null>(null)


export const TicketsModule = () => {
  const { user } = useSession();
    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<CheckProps | null>(null); 

    const [state, setState] = useState({
      isOpen: true,
      expandView: null
    });

    //gviewAll loggedTickets
    const url = `tickets/getickets`
    const { data, loading, error } = useQuery<ResponseType>(url); 
    console.log("TICKETSMODULE DATA RETURNED", data)
    

    const takeLoggedTicket = async (ticket: CheckProps) => {
      let customerData = ticket.Customer
      let supportData;

      if (ticket.Customer.includes(",")) {
          const customerArray = ticket.Customer.split(",");
          customerData = customerArray[0].trim();
          supportData = customerArray[1].trim();
      }
      console.log("SUPPORT DATA SUPPORT DATA SUPPORT DATA SUPPORT DATA", supportData)

      try {
          const payLoad = {
              employee: user?.emp_name,
              customer: customerData,
              activity: ticket.Problem,
              phoneNumber: ticket.Phone_Number,
              clientAnydesk: ticket.Clients_Anydesk,
              startTime: ticket.Time,
              type: ticket.Type,
              support_no: ticket.Support_No,
              comments: ticket.Comments,
              name: ticket.Name,
              email_address: ticket.Email_Address,
              issueType: ticket.IssueType,
              priority: ticket.Priority,
          };

          const response = await axios.post(`${apiEndPoint}/tickets/insertloggedticket`, payLoad);
          console.log('Ticket taken successfully:', response.data);

          await updateTakenTicket(ticket.Call_ID);
          startCallNotification()

      } catch (error) {
          console.error('Error taking ticket:', error);
      }
    }

    const updateTakenTicket = async (callId: number) => {
      try {
          //new route
          ///updateloggedticket/:endtime/:callid
          const ticketDate = format(
            new Date(),
            "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
          );

          const url = `tickets/updateloggedticket/${ticketDate}/${callId}`;
          const response = await axios.patch(`${apiEndPoint}/${url}`);

          console.log('Ticket updated successfully:', response.data);

          // Remove the ticket from the local state to reflect the change in the UI
          // This is optional if you want to update the state or UI
      } catch (error) {
          console.error('Error updating ticket:', error);
      }
    }

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

    const startCallNotification = () => {
      toast.success('Ticket has been started successfully', {
        icon: <Check color={colors.green} size={24} />,
        duration: 3000,
      });
    }

    if (loading) {
      return (
          <tr>
              <td colSpan={7} className="h-[150px]">
                  <div className="flex flex-col items-center justify-center h-full w-full">
                      <Loader className="h-12 w-12" />
                      <p className="text-gray-500 text-lg mt-2 text-center uppercase">Loading Data, Please be patient</p>
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
                    <CircleSlash className="h-12 w-12" />
                    <p className="text-red text-lg mt-2 text-center uppercase">An Error was encountered when fetching Data. Please refresh the page!</p>
                </div>
            </td>
        </tr>
    );
    }


    if (data?.length === 0) {
    return (
      <>
        <tr>
            <td colSpan={7} className="h-[150px]">
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <PanelTopOpen className="h-12 w-12" />
                    <p className="text-green text-lg mt-2 text-center uppercase">There are currently no logged tickets!</p>
                </div>
            </td>
        </tr>
      </>
    )
    }


  return (
    <>
    <TicketsContext.Provider value={viewticket}>
      {data?.map(({ Call_ID, Customer, Problem, Name, Time, IssueType, Empl, Priority }) => (
        <>
          <tr key={Call_ID} className="border-b">
            <td className="px-2 sm:text-sm md:text-base">{Call_ID}</td>
            <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Customer.includes(':') ? Customer.split(':')[0].trim() : Customer || '--:--'}</td>
            <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Problem || '--:--'}</td>
            <td className="p-2 hidden lg:table-cell whitespace-nowrap truncate uppercase">{Name || '--:--'}</td>
            <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">
              {Time ? `${new Date(Time).toString().split(' ').slice(1, 5).join(' ')}` : '--:--'}
            </td>
            <td className="p-2 sm:text-sm md:text-base whitespace-nowrap truncate uppercase">{Empl || '--:--'}</td>
            <td className="text-center">
              <div className="flex gap-2">
                <button className="view" onClick={() => { openModal(Call_ID)}}>
                  <Ellipsis size={18} strokeWidth={2} />
                </button>
                <button className="save"
                  onClick={() => {
                    const selectedTicket = data.find(t => t.Call_ID === Call_ID);
                    if (selectedTicket) {
                      takeLoggedTicket(selectedTicket);
                        console.log('INSERTED THE LOGGED TICKET TO tblTime x Updated EndTime in tblcalls', selectedTicket);
                    } else {
                        console.error('Selected ticket not found');
                    }
                }}>
                  <PhoneOutgoing size={18} strokeWidth={2} />
                </button>
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
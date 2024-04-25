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
import {EyeIcon, PlusIcon} from "@/components/component/tickets-table"
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResponseType>([]);

  const [callId, setCallID] = useState(0);
  const [viewticket, setViewTicket] = useState<ResponseTypeEachTicket>([]); //view ticket holds my returned data

  const [state, setState] = useState({
    isOpen: true,
    expandView: null
  });

  const [isTicketOpen, setOpenTicket] = useState(true);
  const [viewExpand, setViewExpand] = useState('');

  const [currentOpen, setCurrentOpen] = useState('');

  const generateTickets = async () => {
    try {
      setLoading(true);

      const url = `tickets/getickets`
      const response = await axios.get<ResponseType>(`${apiEndPoint}/${url}`);
    
      setData(response.data)

      console.log(response);
      setLoading(false);

    } catch (error) {
      
      console.error('error loading tickets:', error);
    }
  };

    const generateEachTicket = async (currentCallId: number) => {
      try {
        setLoading(true);

        const url = `tickets/getickets/${currentCallId}`
        const eachticket = await axios.get<ResponseTypeEachTicket>(`${apiEndPoint}/${url}`);

        setViewTicket(eachticket.data)
        console.log('TICKETS UPLOADED', viewticket)

        setLoading(false);
      } catch (error) {

        console.error('error loading each ticket:', error);

      }
    }

    useEffect(() => {
        generateTickets()
        console.log('all tickets data was loaded', data)
    }, []);


  const checkInLog = data?.map((property) => ({
    callid: property?.Call_ID,
    customer: property.Customer,
    problem: property.Problem,
    clAnydesk: property.Clients_Anydesk,
    phoneNumber: property.Phone_Number,
    time: new Date(property.Time).toLocaleString(),
    endtime: property.EndTime,
    duration: property.Duration,
    taken: property.Taken,
    support_no: property.Support_No,
    empl: property.Empl,
    logger: property.logger,
    comments: property.Comments,
    solution: property.Solution,
    name: property.Name,
    urgent: property.urgent,
    issuetype: property.IssueType
  }))

  const openModal = (parameter: any) => {
    if (currentOpen === parameter) {
      setState({ ...state, isOpen: false, expandView: null });
      setCurrentOpen('');
      setViewTicket([]);
    } else {
      setCurrentOpen(parameter);
      setState({ ...state, isOpen: true, expandView: parameter });
      setCallID(parameter);

      setViewTicket([]); // Reset viewticket when opening a new ticket to ensure previous ticket data is not displayed
      generateEachTicket(parameter); // Call generateEachTicket here to load the new ticket data
    }
  }



  return (
    <>
      {checkInLog?.map(({ callid, customer, problem, name, time }) => (
        <>
          <TableRow key={callid}>
            <TableCell className="font-medium">{callid}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[120px]">{customer}</TableCell>
            <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">{problem}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell className="text-center">{time}</TableCell>
            <TableCell className="text-center">
              <div className="flex gap-2">
                <Button size="sm" className="bg-purple" onClick={() => { openModal(callid); console.log('EACH TICKET WAS LOADED', viewticket)}}>
                  <span>View</span>
                  <EyeIcon className="h-4 w-4 ml-2" />
                </Button>
                <Button size="sm" className="bg-green">
                  <span>Take</span>
                  <PlusIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {state.isOpen && state.expandView === callid && (
            <TableRow>
              <TableCell colSpan={6} className="p-0">
                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                  <EachTicketsModule ticketData={viewticket} callid={callid}/>
                </div>
              </TableCell>
            </TableRow>
          )}
        </>
      ))}
    </>
  );
}

//code for active tickets
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


export const ActivieTicketsModule = () => {
  const [loading, setLoading] = useState(false);
  const [activedata, setActiveData] = useState<ActiveResponseType>([]);

    const generateActiveTickets = async () => {
      try {
        setLoading(true);
  
        const url = `tickets/getactivetickets`
        const response = await axios.get<ActiveResponseType>(`${apiEndPoint}/${url}`);
      
        setActiveData(response.data)
  
        console.log(response);
        setLoading(false);

      } catch (error) {
        
        console.error('error loading active tickets:', error);
      }
    };

    useEffect(() => {
      generateActiveTickets()
        console.log('ACTIVE DATA LOADED', activedata)
    }, []);

    const activecheckInLog = activedata?.map((property) => ({
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
      issuetype: property.IssueType
    }))

  return (
    <>
      {activecheckInLog?.map(({ callid, customer, problem, name, time }, index) => (
          <TableRow key={callid}>
          <TableCell className="font-medium">{callid}</TableCell>
          <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[120px]">{customer}</TableCell>
          <TableCell className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">{problem}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell className="text-center">{time}</TableCell>
          <TableCell className="text-center">
            <div className="flex gap-2">
              <Button size="sm" className="bg-purple">
                <span>View</span>
                <EyeIcon className="h-4 w-4 ml-2" />
              </Button>
              <Button size="sm" className="bg-red">
                <span>End</span>
                <PlusIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
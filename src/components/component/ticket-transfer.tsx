'use client'

import * as React from "react"
import {useState, useEffect, useRef } from 'react'

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

import { Button } from "@/components/ui/button"

import { Employees } from "@/hooks/data/data"
import { EmployeeType } from "@/hooks/data/data"

import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";

import { ActiveResponseType } from '../../modules/home/activeTicketsModule'; 
import { ActiveProps } from '../../modules/home/activeTicketsModule'; 

interface TicketTransferProps {
  callId: number;
  onClose: () => void; 
}

interface EmployeeProps {
    ID: number;
    Technician: string;
}

type EmployeeResponseType = EmployeeProps[];

//tblcalls
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

export function TicketTransfer({ onClose }: TicketTransferProps){
    const [technician, setTechnician] = useState("");
    const [allTechnicians, setAllTechnicians] = useState<EmployeeResponseType>([]);

    const [transferedTicket, setTransferedTicket] = useState<ActiveResponseType>([]);

    const getTechnicians = async () => {
      try {
        const url = `customers/getechnicians`
        const response = await axios.get<EmployeeResponseType>(`${apiEndPoint}/${url}`);
  
        setAllTechnicians(response.data)
        console.log("all employees data:", response.data);

      } catch (error) {
        console.log("AN ERROR WAS ENCOUNTERED MY NIGGA - NO GODDAMN TECHNICIANS", error);
      }
    }

    
    const transferTicket = async (ticket: any)  => {
      try {
        const transferData = {
          empl: ticket.Call_ID,
          Customer: ticket.Customer,
          Activity: ticket.Problem,
          Clients_Anydesk: ticket.Clients_Anydesk,
          Phone_Number: ticket.Phone_Number,
          StartTime: new Date(ticket.Time).toISOString().slice(0, 19).replace('T', ' '), 
          Support_No: ticket.Support_No,
          Type: ticket.Type,
          Comments: ticket.Comments,
          IssueType: ticket.IssueType,
          Priority: ticket.urgent,
          Name: ticket.name
        };

          const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, transferData);
          setTransferedTicket(response.data)
          console.log('Ticket transfered successfully:', response.data);
          console.log('MY TRANSFERED DATA!!!!!!!!!!!!!!!!!!!!:', transferData);

      } catch (error) {

          console.log('ERROR ENCOUNTERED WHEN ENDING A TICKET', error);

      }
  }
    
    useEffect(() => {
      getTechnicians();
    }, []);

    console.log("my technicians bxtch", allTechnicians)
    console.log("my transfered employee:", technician)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-4 w-160 rounded-md shadow overlay">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Transfer Call</h1>
        <div className="flex items-center space-x-2">
          <MinimizeIcon className="h-5 w-5" onClick={onClose}/>
          <MaximizeIcon className="h-5 w-5" onClick={onClose}/>
          <DoorClosedIcon className="h-5 w-5" onClick={onClose}/>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="solution">
          Please select the Employee you wish to Transfer to:
        </label>
        <select
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            >
              <option value="" className="">Select customer</option>
                {allTechnicians?.map(({ ID, Technician }) =>
                  <option key={ID} value={Technician} className="">{Technician}</option>
                )}
            </select>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button className="w-full bg-green">Save</Button>
      </div>
    </div>
  </div>
  )
}

export function DoorClosedIcon(props: any) {
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


export function MaximizeIcon(props: any) {
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

export function MinimizeIcon(props: any) {
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

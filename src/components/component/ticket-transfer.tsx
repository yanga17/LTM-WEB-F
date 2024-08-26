'use client'

import * as React from "react";
import {useState, useEffect, useRef } from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button"
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


export function TicketTransfer({ onClose, callId }: TicketTransferProps){
    const [technician, setTechnician] = useState("");
    const [allTechnicians, setAllTechnicians] = useState<EmployeeResponseType>([]);

    const [transferedTicket, setTransferedTicket] = useState<ActiveResponseType>([]);

    const getEmployees = async () => {
      try {
        const url = `tickets/getemployees`
        const response = await axios.get<EmployeeResponseType>(`${apiEndPoint}/${url}`);
    
        setAllTechnicians(response?.data)
    
        if (response.data.length === 0) {
          toast.error(`No data available for employees.`, {
            icon: '❌',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
    
      }} catch (error) {
    
        console.error('An error occurred while getting employees:', error);
        
      }
    }

    const transferNotification = () => {
      toast.success(`The ticket was transferred to ${technician} Successfully.`, {
        icon: <Check color={colors.green} size={24} />,
        duration: 3000,
      });
    };

    const transferTicket = async () => {
      if (technician === '' || null) {
        toast.success('Please select a technician from the dropdown.', {
          icon: <X color={colors.red} size={24} />,
          duration: 3000,
        });
        return;
      }

      try {
        //http://localhost:4200/tickets/transferticket/Support/17760
        const url = `tickets/transferticket/${technician}/${callId}`;
        const response = await axios.post(`${apiEndPoint}/${url}`);

        console.log("technician:", technician)
        await updateTransferedTicket();
        transferNotification();

        console.log('Ticket transferred successfully:', response?.data);
        onClose();
      } catch (error) {
        console.log('ERROR ENCOUNTERED WHEN TRANSFERING TICKET TO SELECTED EMPLOYEE', error);
      }

    }

    const updateTransferedTicket = async () => {
      try {
        //http://localhost:4200/tickets/updatetransferedticket/17750
        const url = `tickets/updatetransferedticket/${callId}`;
        const response = await axios.patch(`${apiEndPoint}/${url}`);

        console.log("UPDATED TRANSFERED TICKET DATA:", response.data);
      } catch (error) {
        console.log("AN ERROR WAS ENCOUNTERED WHEN UPDATING TRANSFERED TICKET DATA", error);
      }
    }
    
    useEffect(() => {
      getEmployees();
    }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="chart-background p-4 w-160 rounded-md shadow overlay">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold header-text">Transfer Call</h1>
        <div className="flex items-center space-x-2 hover:cursor-pointer">
          <X size={24} strokeWidth={2} color="red" onClick={onClose} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 header-text" htmlFor="solution">
          Please select the employee you wish to Transfer to:
        </label>
        <select
            className="call-input"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            >
              <option value="" className="header-text">Select employee</option>
                {allTechnicians?.map(({ ID, Technician }) =>
                  <option key={ID} value={Technician}>{Technician}</option>
                )}
            </select>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button onClick={transferTicket} className="w-full save-detailExt">
          <span>Save</span>
        </button>
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

'use client'

import * as React from "react";
import {useState, useEffect, useRef} from 'react';
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TicketSolutionProps {
  callId: number;
  onClose: () => void; 
}

interface ActiveTableProps {
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

type ActiveResponseType = ActiveTableProps[]

export function TicketSolution({ callId, onClose }: TicketSolutionProps ){
  const [solution, setSolution] = useState('');
    const [numberofdays, setNumberOfDays] = useState(0);
    const [followup, setFollowUp] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [checkStatus, setCheckStatus] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null); // New ref for textarea

    const handleCheckStatus = () => {
      setCheckStatus((prevStatus) => !prevStatus);
    }

    useEffect(() => {
      if (checkStatus === true) {
          setFollowUp(1);
          setNumberOfDays(numberofdays);
      } else {
          setFollowUp(0);
      }
          console.log("MY CHECKSTATUS TEXT:", checkStatus)
  }, [checkStatus])

    const saveSolution = async () => { 
      if (solution.trim() === '') {
        textareaRef.current?.focus();
        return;
      }

      const newNumberOfDays = numberofdays > 0 ? numberofdays : 0;
      const followup = checkStatus ? 1 : 0;
      const newCompleted = 1;
      console.log("FOLLOW UP FOLLOW UP", followup)

      try {
        const ticketSolutionurl = `tickets/updateactivesolution/${solution}/${newNumberOfDays}/${followup}/${newCompleted}/${callId}`
        const updatedSolution = await axios.patch<TicketSolutionProps>(`${apiEndPoint}/${ticketSolutionurl}`);
        toast.success('Ticket has been ended successfully.');
        
        await insertfollowup();
        console.log("called the insert followup function")
        onClose();

      } catch (error) {

        console.error("ERROR UPDATING TICKET'S SOLUTION", error);

      }
    }

    const insertfollowup = async () => {
      try {
        // Fetch the ticket data using callId
        const ticketsurl = `tickets/getfollowupticket/${callId}`
        const ticketResponse = await axios.get<ActiveResponseType>(`${apiEndPoint}/${ticketsurl}`);

        console.log("my followup tickets callid:", ticketResponse);
        const ticketData = ticketResponse.data[0]; // Assuming the response is an array and we're interested in the first item

        const newNumberOfDays = numberofdays > 0 ? numberofdays : 0;
        const newFollowUp = numberofdays > 0 ? 1 : 0;
        const newCompleted = 1;
        
  
        if (!ticketData) {
          throw new Error('No ticket data found');
        }
        
  
        // Prepare data for inserting follow-up ticket
        const followUpData = {
          id: ticketData.ID,
          employee: ticketData.Employee,
          customer: ticketData.Customer,
          activity: ticketData.Activity,
          clientsAnydesk: ticketData.Clients_Anydesk,
          phoneNumber: ticketData.Phone_Number,
          startTime: ticketData.StartTime,
          endTime: ticketData.EndTime,
          duration: ticketData.Duration,
          type: ticketData.Type,
          solution: ticketData.Solution,
          supportNo: ticketData.Support_No,
          comments: ticketData.Comments,
          followUp: newFollowUp,
          completed: newCompleted,
          name: ticketData.Name,
          numberOfDays: newNumberOfDays,
          issueType: ticketData.IssueType,
          priority: ticketData.Priority
        };
  
        const response = await axios.post(`${apiEndPoint}/tickets/insertfollowup`, followUpData);
        console.log("inserted the followUp successfully:",  response.data);

        onClose();
  
      } catch (error) {
        console.error("ERROR INSERTING FOLLOW-UP TICKET", error);
      }
    }
    

    
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.borderColor = solution.trim() === ''? 'ed' : 'initial';
      }
    }, [solution]);


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="chart-background p-4 w-160 rounded-md shadow overlay">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold header-text">Solution</h1>
        <div className="flex items-center hover:cursor-pointer">
          <X size={24} strokeWidth={2} color="red" onClick={onClose} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 header-text" htmlFor="solution">
          Please enter the solution of the problem:
        </label>
        <Textarea
        className="call-input"
        id="solution"
        ref={textareaRef}
        onChange={(e) => setSolution(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-4">
        <Checkbox id="follow-up" onClick={ handleCheckStatus }/>
        <label className="ml-2 text-sm header-text" htmlFor="follow-up">
          Require Follow Up
        </label>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <label className="text-sm mr-2 header-text" htmlFor="number-of-days">
            Number of Days
          </label>
          <select
            className="days-input"
            id="number-of-days"
            value={ numberofdays }
            onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>
        <button className="save-detail" onClick={saveSolution}>
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

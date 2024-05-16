'use client'

import * as React from "react"
import {useState, useEffect, useRef} from 'react'

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"


interface TicketSolutionProps {
  callId: number;
  onClose: () => void; 
}


export function TicketSolution({ callId, onClose }: TicketSolutionProps ){
  const [solution, setSolution] = useState('');
    const [numberofdays, setNumberOfDays] = useState(0);
    const [followup, setFollowUp] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [checkStatus, setCheckStatus] = useState(false);
    const [isOpen, setIsOpen] = useState(true); // New state variable
    const textareaRef = useRef<HTMLTextAreaElement>(null); // New ref for textarea
    

    const handleCheckStatus = (event: any) => {
      setCheckStatus(event.target.checked);
    }

    const saveSolution = async () => {
      if (solution.trim() === '') {
        textareaRef.current?.focus();
        return;
      }

      if (numberofdays > 0) {
        setNumberOfDays(numberofdays);
        setFollowUp(1);
        setCompleted(1);
      }

      try {

        const ticketSolutionurl = `tickets/updateactivesolution/${solution}/${numberofdays}/${followup}/${completed}/${callId}`
        const updatedSolution = await axios.patch<TicketSolutionProps>(`${apiEndPoint}/${ticketSolutionurl}`);
        console.log("TICKETSOLUTION UPDATED SOLUTION SUCCESSFULLY");
        onClose();

      } catch (error) {
  
        console.error("ERROR UPDATING TICKET'S SOLUTION", error);
  
      }
    }

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.borderColor = solution.trim() === ''? 'ed' : 'initial';
      }
    }, [solution]);


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-4 w-160 rounded-md shadow overlay">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Solution</h1>
        <div className="flex items-center">
          <DoorClosedIcon className="h-6 w-6" onClick={onClose} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="solution">
          Please enter the solution of the problem:
        </label>
        <Textarea
        className="w-full p-2 border border-gray-200 rounded-md dark:border-gray-800"
        id="solution"
        ref={textareaRef}
        onChange={(e) => setSolution(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-4">
        <Checkbox id="follow-up" onClick={handleCheckStatus}/>
        <label className="ml-2 text-sm" htmlFor="follow-up">
          Require Follow Up
        </label>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <label className="text-sm mr-2" htmlFor="number-of-days">
            Number of Days
          </label>
          <select
            className="w-24 p-2 border border-gray-200 rounded-md dark:border-gray-800"
            id="number-of-days"
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
        <Button className="w-24 bg-green" onClick={saveSolution}>Save</Button>
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

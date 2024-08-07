'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button"
import { CircleSlash2, CircleSlash, PhoneOff, Loader, Ellipsis } from "lucide-react";
import { createContext } from "react";
import { CompFollowUpsDetail } from "./compFollowUpsDetail"

//interface for all tickets - tblcalls
interface CompletedFLProps {
  idx: number,
  ID: number,
  Employee: string,
  Customer: string,
  Activity: string,
  Phone_Number: number,
  StartTime: string
  EndTime: string,
  Duration: number,
  Type: string,
  Solution: string,
  Support_No: null,
  Comments: string,
  FollowUp: null,
  Completed: null,
  Name: string,
  Email_Address: string,
  Clients_Anydesk: null,
  NumberOfDays: number,
  TimeTaken: null,
  FLStartTime: string,
  FLEndTime: string
  IssueType: string,
  Priority: string
}

type FolowUpsType = CompletedFLProps[]

export const ActiveFollowUpsContext = createContext<CompletedFLProps | null>(null);

export const CompFollowUpsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [compfollowUps, setCompFollowUps] = useState<FolowUpsType>([]);

    const [viewFollowUp, setViewFollowUp] = useState<CompletedFLProps | null>(null);


    const [state, setState] = useState({
      isOpen: true,
      expandView: null
    });

    //getactivefollowup - getcompletedfollowup
    const url = `followups/getactivefollowup`
    const { data, loading, error } = useQuery<FolowUpsType>(url);

    const endFollowUp = async (idx: any) => {
      try {
        const endUrl = `followups/endactivefollowup/${idx}`;
        const response = await axios.patch<FolowUpsType>(`${apiEndPoint}/${endUrl}`);
        console.log("ENDING ACTIVE FOLLOW-UP WAS SUCCESSFUL:", response.data);
        toast.success('Follow-Up has been ended successfully.');

      } catch (error) {
        
        console.error('Error ending active follow-up ticket:', error);
        toast.error('An error occurred while ending the follow-up.');

      }
    }

    const openModal = (ticketid: any) => {
      if (currentOpen === ticketid) {
          setCurrentOpen('');
          setState({ ...state, isOpen: false, expandView: null });

      } else {
          setCurrentOpen(ticketid);
          setState({ ...state, isOpen: true, expandView: ticketid});

          const selectedTicket = data?.find(client => client.ID === ticketid || null);

          if (selectedTicket) {
            setViewFollowUp(selectedTicket);
          }

          console.log('lets see my loggedTicket id', selectedTicket);
      }
    }

    const closeModal = () => {
    setState({...state, isOpen: false, expandView: null });
    setCurrentOpen('');
    }

    useEffect(() => {
      if (data) {
        setCompFollowUps(data);
        console.log('REFRESED COMPLETED FOLLOWED TICKETS', data);
      }

    }, [data]);

    if (loading) {
      return (
          <tr>
            <td colSpan={8} className="h-[150px]">
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <Loader className="h-12 w-12" />
                    <p className="text-gray-500 text-lg mt-2 text-center uppercase">Loading data, Please be patient</p>
                </div>
            </td>
        </tr>
      );
    }

    if (error) {
      return (
          <tr>
              <td colSpan={8} className="h-[150px]">
                  <div className="flex flex-col items-center justify-center h-full w-full">
                      <CircleSlash className="h-12 w-12" />
                      <p className="text-red text-lg mt-2 text-center uppercase">An Error was encountered when fetching data, Please Refresh!</p>
                  </div>
              </td>
          </tr>
      );
    }
  
    if (compfollowUps.length === 0) {
        return (
          <>
            <tr>
                <td colSpan={8} className="h-[150px]">
                  <div className="flex flex-col items-center justify-center h-full w-full">
                      <CircleSlash2 className="h-12 w-12" />
                      <p className="text-green text-lg mt-2 text-center uppercase">THERE ARE CURRENTLY NO ACTIVE TICKETS BEING FOLLOWED-UP!</p>
                  </div>
              </td>
          </tr>
        </>
      )
    }


    return (
        <>
        <ActiveFollowUpsContext.Provider value={viewFollowUp}>
          {compfollowUps?.map(({ idx, ID, Employee, Customer, Activity, Phone_Number, StartTime, EndTime, Duration, Type, Solution, Support_No, Comments, FollowUp, Completed, Name, Clients_Anydesk, NumberOfDays, TimeTaken, FLStartTime, FLEndTime, IssueType, Priority }) => (
            <>
              <tr className="pg-background border-b font-medium table-text">
                        <td key={ID}className="p-2">{ID}</td>
                        <td className="p-2 whitespace-nowrap truncate">{Customer  || '--:--'}</td>
                        <td className="p-2">{Activity  || '--:--'}</td>
                        <td className="p-2">{Name  || '--:--'}</td>
                        <td className="p-3">{Duration  || '--:--'}</td>
                        <td className="p-2">{Employee  || '--:--'}</td>
                        <td className="text-center">{Completed === 1 ? '⏳' : Completed}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <button className="viewExt" onClick={() => { openModal(ID)}}>
                                  <Ellipsis size={18} strokeWidth={2} />
                                </button>
                                <button className="cancelExt" onClick={() => { endFollowUp(idx)}}>
                                  <PhoneOff size={18} strokeWidth={2} className="ml-2 mr-2" />
                                </button>
                            </div>
                        </td>  
                        </tr>
              {state.isOpen && state.expandView === ID && (
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                      <CompFollowUpsDetail onClose={closeModal} endFollowUpFn={endFollowUp}/>
                    </div>
                  </td>
                </tr>
              )}
              
            </>
          ))}
          </ActiveFollowUpsContext.Provider>
        </>
      );
    }
'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { View, CircleSlash, PhoneOutgoing, Loader, Check } from "lucide-react";
import { createContext } from "react";
import { FollowUpsDetail } from "./followUpsDetail";

interface FollowUpsProps {
    idx: number,
    ID: number,
    Employee: string,
    Customer: string,
    Activity: string,
    Phone_Number: number,
    StartTime: string,
    EndTime: string,
    Duration: number,
    Type: string,
    Solution: string,
    Support_No: number,
    Comments: string,
    FollowUp: number,
    Completed: number,
    name: string,
    Email_Address: string,
    Clients_Anydesk: number,
    NumberOfDays: number,
    IssueType: string,
    Priority: string
}

type FollowUpsType = FollowUpsProps[]

export const FollowUpContext = createContext<FollowUpsProps | null>(null); //changed to FollowUpsProps to send an single object NOT an array

export const FollowUpsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [uID, setUID] = useState(0);

    const [viewFollowUp, setViewFollowUp] = useState<FollowUpsProps | null>(null); //view ticket holds my selectedticket 4 view -- changed to FollowUpsProps to send an single object NOT an array
    const [filteredFollowUps, setFilteredFollowUps] = useState<FollowUpsType>([]); 

    const [input, setInput] = useState('');

    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });

    const url = `followups/getfollowups`
    const { data, loading, error, } = useQuery<FollowUpsType>(url);
    console.log("my follow up data:", data);


    const getCurrentDateTimeString = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };


    const startFollowUp = async (id: any) => {
        const selectedTicket = data?.find(ticket => ticket.ID === id);
        console.log("Selected Ticket:", selectedTicket);

        const flStartTime = getCurrentDateTimeString();
        const followUpValue = 2;

        if (selectedTicket) {
            const payload = {
                id: selectedTicket.ID,
                employee: selectedTicket.Employee,
                customer: selectedTicket.Customer,
                activity: selectedTicket.Activity,
                clientsAnydesk: selectedTicket.Clients_Anydesk,
                phoneNumber: selectedTicket.Phone_Number,
                startTime: new Date(selectedTicket.StartTime).toISOString().slice(0, 19).replace('T', ' '),
                endTime: new Date(selectedTicket.EndTime).toISOString().slice(0, 19).replace('T', ' '),
                duration: selectedTicket.Duration,
                type: selectedTicket.Type,
                solution: selectedTicket.Solution,
                supportNo: selectedTicket.Support_No,
                comments: selectedTicket.Comments,
                followUp: followUpValue,
                completed: selectedTicket.Completed,
                name: selectedTicket.name,
                numberOfDays: selectedTicket.NumberOfDays,
                flStartTime: flStartTime, // Assuming this is the start time for the follow-up
                issueType: selectedTicket.IssueType,
                priority: selectedTicket.Priority,
            };

            try {
                const response = await axios.post(`${apiEndPoint}/followups/insertfollowup`, payload);
                if (response.status === 200) {
                    toast.success('Follow-Up has been started successfully.');

                    await axios.patch(`${apiEndPoint}/followups/updatefollowup/${id}`);
                    console.log("TICKET HAS BEEN UPDATED WITH A FOLLOWUP VALUE IN tbltime")
                    //undoNotification();

                } else {
                    toast.error('An error occurred while starting the follow-up.');
                }
            } catch (error) {
                toast.error('An error occurred while starting the follow-up.');
                console.log("An error occurred while starting the follow-up:", error)
            }
        }
        
    };


    const openModal = (id: any) => {
        if (currentOpen === id) {
            setCurrentOpen('');
            setState({ ...state, isOpen: false, expandView: null });
        } else {
            setCurrentOpen(id);
            setState({ ...state, isOpen: true, expandView: id});

            const selectedFollowUp = data?.find(followUp => followUp.ID === id || null);

            if (selectedFollowUp) {
                setViewFollowUp(selectedFollowUp);
            }
            console.log('lets see this my id', selectedFollowUp);
        }
    }

    const closeModal = () => {
        setState({ ...state, isOpen: false, expandView: null });
        setCurrentOpen('');
    };

    const searchCustomerFollowUp = (clientname: any) => {
        setInput(clientname);
        console.log("MY CLIENTNAME:+++++", clientname);
    }

    const undoNotification = () => {
        toast.success('Follow-Up was started successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    if (loading) {
        return (
            <tr>
              <td colSpan={8} className="h-[150px]">
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
                <td colSpan={8} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-12 w-12" />
                        <p className="text-red text-lg mt-2 text-center uppercase">An Error was encountered when fetching data!</p>
                    </div>
                </td>
            </tr>
        );
    }

    if (data?.length === 0) {
        return (
            <tr>
                <td colSpan={8} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-12 w-12" />
                        <p className="text-green text-lg mt-2 text-center uppercase">There are currently no customers that need to be Followed-Up</p>
                    </div>
                </td>
            </tr>
        );
    }

    const followUpsLog = data?.map((property) => ({
        idx: property?.idx,
        id: property.ID,
        employee: property.Employee,
        customer: property.Customer,
        activity: property.Activity,
        phoneNumber: property.Phone_Number,
        starTime: property.StartTime?.slice(10, 19)?.replace('T', ''),
        endTime: property.EndTime?.slice(10, 19)?.replace('T', ''),
        duration: property.Duration,
        type: property.Type,
        solution: property.Solution,
        supportnumber: property.Support_No,
        comments: property.Comments,
        followUp: property.FollowUp,
        completed: property.Completed,
        name: property.name,
        clientsAnydesk: property.Clients_Anydesk,
        numberofdays: property.NumberOfDays,
        issuetype: property.IssueType
    }))

    const filteredData = input
        ? followUpsLog?.filter(ticket => 
            ticket.id?.toString().toLowerCase().includes(input.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(input.toLowerCase()) || 
            ticket.employee.toLowerCase().includes(input.toLowerCase()),
        )
        : followUpsLog; 

        console.log("MY FILTERED DATA", filteredData)

    return (
        <>
        <FollowUpContext.Provider value={viewFollowUp} >
            {filteredData?.map(({ idx, id, employee, customer, activity, phoneNumber, starTime, endTime, duration, type, solution, supportnumber, comments, followUp, completed, name, clientsAnydesk, numberofdays, issuetype }, index) => (
                <>
                    <tr className="border-b font-medium text-black sm:text-black">
                        <td key={id}className="p-2">{id}</td>
                        <td className="p-2 w-[80px] uppercase">{employee  || '--:--'}</td>
                        <td className="p-2 whitespace-nowrap truncate">{customer  || '--:--'}</td>
                        <td className="p-2">{activity  || '--:--'}</td>
                        <td className="p-2">{name  || '--:--'}</td>
                        <td className="p-3">{duration  || '--:--'}</td>
                        <td className="text-center">{completed === 1 ? '❌' : completed}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-purple sm:bg-purple py-4 px-2 w-8/12" onClick={() => { openModal(id)}}>
                                    <View size={18} strokeWidth={2} />
                                </Button>
                                <Button size="sm" className="bg-green sm:bg-green py-4 px-2 w-8/12 mr-2" onClick={() => { startFollowUp(id)}}>
                                    <PhoneOutgoing size={18} strokeWidth={2} />
                                </Button>
                            </div>
                        </td>  
                        </tr>
                    {state.isOpen && state.expandView === id && (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                    <FollowUpsDetail onClose={closeModal} followUpFn={startFollowUp}/>
                                </div>
                            </td>
                        </tr>
                    )}
                </>
            ))}
            </FollowUpContext.Provider>
        </>
    );
}
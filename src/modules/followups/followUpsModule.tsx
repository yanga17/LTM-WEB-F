'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";

import { Button } from "@/components/ui/button";
import { CoffeeIcon, PhoneIcon, ActivityIcon } from "@/components/component/tickets-table";
import { TicketTransfer } from "@/components/component/ticket-transfer";
import { Undo2, CircleSlash2, CircleSlash, Check, PhoneOutgoing, PhoneOff, ViewIcon } from "lucide-react";
import {EyeIcon, PlusIcon, MinusIcon} from "@/components/component/tickets-table"

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
    Clients_Anydesk: number,
    NumberOfDays: number,
    IssueType: string,
    Priority: number
}

type FollowUpsType = FollowUpsProps[]

export const FollowUpContext = createContext<FollowUpsProps | null>(null); //changed to FollowUpsProps to send an single object NOT an array

export const FollowUpsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [uID, setUID] = useState(0);

    const [viewFollowUp, setViewFollowUp] = useState<FollowUpsProps | null>(null); //view ticket holds my selectedticket 4 view -- changed to FollowUpsProps to send an single object NOT an array
    const [filteredFollowUps, setFilteredFollowUps] = useState<FollowUpsType>([]); 

    // const [input, setInput] = useState('');

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

    // const searchCustomerFollowUp = (clientname: any) => {
    //     setInput(clientname);
    //     console.log("MY CLIENTNAME:+++++", clientname);
    // }

    if (loading) {
        return (
            <>
                <div className="bg-white">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-end">
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="border-black text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                style={{ width: "440px" }}
                            />
                        </div>
                        <Button size="lg" variant="ghost">
                            <img
                                alt="Avatar"
                                height="62"
                                src="/covers/placeholder-user.jpg"
                                style={{
                                    aspectRatio: "32/32",
                                    objectFit: "cover",
                                }}
                                width="32"
                            />
                            <span className="sr-only">User Profile</span>
                        </Button>
                    </div>
                </header>
                <div className="bg-white flex justify-end px-5 py-2 items-center space-x-6 mt-2">
                    
                </div>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div>
                            <h6 className="ml-6 text-3xl py-4 font-bold">Customer Follow-Ups</h6>
                        </div>
                        <div className="ml-4 mr-4 border rounded-lg shadow-sm">
                            <div className="p-0">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-greyDarker">
                                        <tr className="bg-grey text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
                                            <th className="p-2">UID</th>
                                            <th className="">Customer</th>
                                            <th className="">Support No.</th>
                                            <th className="">Number 1</th>
                                            <th className="">Number 2</th>
                                            <th className="">Enabled</th>
                                            <th className="p-2">Expiry Date</th>
                                            <th className="">Balance</th>
                                                <th className="">Action</th>
                                            </tr>
                                            </thead>
                                                <tbody>
                                                    {[...Array(10)].map((_, index) => (
                                                        <tr key={index} className="border-b">
                                                            <td className="p-2 font-medium">
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[300px]">
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td>
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td>
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td>
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td className="p-2">
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td>
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="flex gap-2">
                                                                    <Button size="sm" className="bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded" disabled>
                                                                        <EyeIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </>
        )
    }

    if (error) {
        return (
            <tr>
                <td colSpan={8} className="h-[150px]">
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
            <tr>
                <td colSpan={8} className="h-[150px]">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <CircleSlash className="h-14 w-14" />
                        <p className="text-green text-lg mt-2 text-center">THERE ARE CURRENTLY NO TICKETS NEEDED FOLLOWED-UP 0N</p>
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

    // const filteredData = input
    //     ? data?.filter(ticket => 
    //         ticket.ID?.toString().toLowerCase().includes(input.toLowerCase()) ||
    //         ticket.Customer.toLowerCase().includes(input.toLowerCase()) || 
    //         ticket.Employee.toLowerCase().includes(input.toLowerCase()),
    //     )
    //     : followUpsLog; 

    //     console.log("MY FILTERED DATA", filteredData)

    return (
        <>
        <FollowUpContext.Provider value={viewFollowUp} >
            {followUpsLog?.map(({ idx, id, employee, customer, activity, phoneNumber, starTime, endTime, duration, type, solution, supportnumber, comments, followUp, completed, name, clientsAnydesk, numberofdays, issuetype }, index) => (
                <>
                    <tr className="border-b font-medium">
                        <td key={id}className="p-2">{id}</td>
                        <td className="p-2 w-[80px]">{employee  || '--:--'}</td>
                        <td className="p-2 whitespace-nowrap truncate">{customer  || '--:--'}</td>
                        <td className="p-2">{activity  || '--:--'}</td>
                        <td className="p-2">{name  || '--:--'}</td>
                        <td className="p-3">{duration  || '--:--'}</td>
                        <td className="text-center">{completed === 1 ? '❌' : completed}</td>
                        <td className="text-center">
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-purple py-4 px-2 w-8/12" onClick={() => { openModal(id)}}>
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                                <Button size="sm" className="bg-green py-4 px-2 w-8/12" onClick={() => { startFollowUp(id)}}>
                                    <PhoneOutgoing className="h-4 w-4" />
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
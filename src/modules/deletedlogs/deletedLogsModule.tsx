'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from "@/hooks/useQuery";
import { createContext } from "react"
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Undo2, Loader, Check, CircleSlash, Ellipsis, PanelTopOpen } from "lucide-react";
import { EachDeletedTicketsModule } from './deletedLogsDetail';
import { DeletedLogsDialog } from '@/components/component/deletedLogsDialog'

export interface DeletedProps {
    idx: number,
    Call_ID: number,
    Employee: string,
    Customer: string,
    Problem: string,
    Client_Name: string,
    Phone_Number: number,
    Start_Time: string,
    End_Time: string,
    SupportNumber: number,
    Priority: string,
    IssueType: string,
    Type: string,
    Comments: string,
    insertion_time: string,
    Reason: string
}
export type DeletedResponseType = DeletedProps[]

export const DeletedLogsContext = createContext<DeletedProps | null>(null)


export const DeletedLogsModule = () => {
    const [undoID, setUndoID] = useState(0);
    const [deletedData, setDeletedData] = useState<DeletedResponseType>([]);
    const [input, setInput] = useState('');

    const [currentOpen, setCurrentOpen] = useState('');
    const [viewticket, setViewTicket] = useState<DeletedProps | null>(null); 

    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });

    const deletedLogsUrl = `deletedlogs/getdeletedlogs`;
    const { data, loading, error} = useQuery<DeletedResponseType>(deletedLogsUrl);
    console.log("loading deleted logs:", data)

    const undoNotification = () => {
        toast.success('Ticket undone successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const undoTicket = async (ticket: DeletedProps) => {
      let customerData = ticket.Customer
      let supportNo = null;

      if (ticket.Customer.includes(",")) {
        const customerArray = ticket.Customer.split(",");
        customerData = customerArray[0].trim();
        supportNo = customerArray[1].trim();
      }

      try {
        const payLoad = {
          customer: customerData,
          problem: ticket.Problem,
          phoneNo: ticket.Phone_Number,
          starttime: new Date(ticket.Start_Time).toISOString().slice(0, 19).replace('T', ' '),
          emp: ticket.Employee,
          clientname: ticket.Client_Name,
          Supportnumber: supportNo,
          urgent: ticket.Priority,
          issueType: ticket.IssueType,
          type: ticket.Type,
          comments: ticket.Comments
          }
          //const insertCallUrl = `deletedlogs/insertcallticket`
          const response = await axios.post(`${apiEndPoint}/deletedlogs/insertcallticket`, payLoad);
          console.log('Ticket undone successfully:', response.data);
          setDeletedData(deletedData.filter(t => t.idx !== ticket.idx));
          undoNotification();

        } catch (err) {
          console.error('Error undo-ing the selected ticket:', err);

        }
    }

    const searchDeletedLogs = (clientname: any) => {
        setInput(clientname);
        console.log("MY CLIENTNAME:+++++", clientname);
    }

    const openModal = (idx: any) => {
        if (currentOpen === idx) {
            setCurrentOpen('');
            setState({ ...state, isOpen: false, expandView: null });
  
        } else {
            setCurrentOpen(idx);
            setState({ ...state, isOpen: true, expandView: idx});
  
            const selectedTicket = filteredData?.find(client => client.idx === idx || null);
  
            if (selectedTicket) {
              setViewTicket(selectedTicket);
            }
  
            console.log('lets see my deletedloggedTicket id', selectedTicket);
        }
    }

    const closeModal = () => {
        setState({...state, isOpen: false, expandView: null });
        setCurrentOpen('');
    }


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        }).replace(',', '');

        return formattedDate;
    }


    if (loading) {
        return (
            <>
            <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                <DeletedLogsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchDeletedLogs(e.target.value)}
                            />
                        </div>
                    </div>
            </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Deleted Logs</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-md font-medium rounded-full">
                                                <th className="p-2 lg:w-[50px]">Call ID</th>
                                                <th className="p-2 lg:w-[180px]">Customer</th>
                                                <th className="p-2 lg:w-[120px]">Problem</th>
                                                <th className="p-2 lg:w-[70px]">Client Name</th>
                                                <th className="p-2 lg:w-[120px]">Insertion Time</th>
                                                <th className="p-2 lg:w-[70px]">IssueType</th>
                                                <th className="p-2 lg:w-[70px]">Reason</th>
                                                <th className="p-2 lg:w-[70px]">Employee</th>
                                                <th className="p-2 lg:w-[70px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={9} className="h-[150px]">
                                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                                        <Loader className="h-12 w-12" />
                                                        <p className="text-gray-500 text-lg mt-2 text-center uppercase">Loading Data, Please be patient.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                    </div>
                </div>
            </div>
        </div>
            </>
        )
    }

    if (error) {
        return (
            <>
            <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                <DeletedLogsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchDeletedLogs(e.target.value)}
                            />
                        </div>
                    </div>
            </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Deleted Logs</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-md font-medium rounded-full">
                                                <th className="p-2 lg:w-[50px]">Call ID</th>
                                                <th className="p-2 lg:w-[180px]">Customer</th>
                                                <th className="p-2 lg:w-[120px]">Problem</th>
                                                <th className="p-2 lg:w-[70px]">Client Name</th>
                                                <th className="p-2 lg:w-[120px]">Insertion Time</th>
                                                <th className="p-2 lg:w-[70px]">IssueType</th>
                                                <th className="p-2 lg:w-[70px]">Reason</th>
                                                <th className="p-2 lg:w-[70px]">Employee</th>
                                                <th className="p-2 lg:w-[70px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td colSpan={9} className="h-[150px]">
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <CircleSlash className="h-12 w-12" />
                                                    <p className="text-red text-lg mt-2 text-center uppercase">An Error was encountered when fetching Data, Please Refresh!</p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                    </div>
                </div>
            </div>
        </div>
            </>
        )
    }

    if (data?.length === 0) {
        return (
            <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                <DeletedLogsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchDeletedLogs(e.target.value)}
                            />
                        </div>
                    </div>
            </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Deleted Logs</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-md font-medium rounded-full">
                                                <th className="p-2 lg:w-[50px]">Call ID</th>
                                                <th className="p-2 lg:w-[180px]">Customer</th>
                                                <th className="p-2 lg:w-[120px]">Problem</th>
                                                <th className="p-2 lg:w-[70px]">Client Name</th>
                                                <th className="p-2 lg:w-[120px]">Insertion Time</th>
                                                <th className="p-2 lg:w-[70px]">IssueType</th>
                                                <th className="p-2 lg:w-[70px]">Reason</th>
                                                <th className="p-2 lg:w-[70px]">Employee</th>
                                                <th className="p-2 lg:w-[70px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={9} className="h-[150px]">
                                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                                        <PanelTopOpen className="h-12 w-12" />
                                                        <p className="text-green text-lg mt-2 text-center uppercase">There are currently no tickets that have been deleted.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            
                            </CardContent>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    
    const filteredData = input
        ? data?.filter(ticket => 
            ticket.Call_ID?.toString().toLowerCase().includes(input.toLowerCase()) ||
            ticket.Customer.toLowerCase().includes(input.toLowerCase()) || 
            ticket.Employee.toLowerCase().includes(input.toLowerCase()),
        )
        : data; 

    return (
        <>
        <DeletedLogsContext.Provider value={viewticket}>
        <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                <DeletedLogsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchDeletedLogs(e.target.value)}
                            />
                        </div>
                    </div>
            </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Deleted Logs</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-md font-medium rounded-full">
                                                <th className="p-2 lg:w-[50px]">Call ID</th>
                                                <th className="p-2 lg:w-[180px]">Customer</th>
                                                <th className="p-2 lg:w-[120px]">Problem</th>
                                                <th className="p-2 lg:w-[70px]">Client Name</th>
                                                <th className="p-2 lg:w-[120px]">Insertion Time</th>
                                                <th className="p-2 lg:w-[70px]">IssueType</th>
                                                <th className="p-2 lg:w-[70px]">Reason</th>
                                                <th className="p-2 lg:w-[70px]">Employee</th>
                                                <th className="p-2 lg:w-[70px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.map(({ idx, Call_ID, Employee, Customer, Problem, Client_Name, Phone_Number, Start_Time, End_Time, SupportNumber, Priority, IssueType, Type, Comments, insertion_time, Reason }) => (
                                                <>
                                                    <tr key={Call_ID} className="border-b font-medium">
                                                    <td className="p-2">{Call_ID || '--:--'}</td>
                                                    <td className="">{Customer || '--:--'}</td>
                                                    <td className="">{Problem || '--:--'}</td>
                                                    <td className="">{Client_Name || '--:--'}</td>
                                                    <td className="p-2">{formatDate(insertion_time)}</td>
                                                    <td className="">{IssueType || '--:--'}</td>
                                                    <td className="">{Reason || '--:--'}</td>
                                                    <td className="">{Employee || '--:--'}</td>
                                                    <td className="text-center">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-purple hover:bg-violet-300 w-8/12" onClick={() => { openModal(idx)}}>
                                                                <Ellipsis size={18} strokeWidth={2} />
                                                            </Button>
                                                            <Button size="sm" className="bg-red hover:bg-rose-300 py-4 w-8/12 mr-2 md:mr-2"
                                                                onClick={() => {
                                                                const selectedTicket = data?.find(t => t.idx === idx);
                                                                if (selectedTicket) {
                                                                    undoTicket(selectedTicket);
                                                                    console.log('INSERTED THE deleted ticket back into tblcalls', selectedTicket);
                                                                } else {
                                                                    console.error('Selected ticket not found');
                                                                }
                                                            }}>
                                                                <Undo2 size={18} strokeWidth={2} color="white" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {state.isOpen && state.expandView === idx && (
                                                    <tr>
                                                        <td colSpan={9} className="p-0">
                                                            <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                                                <EachDeletedTicketsModule onClose={closeModal} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            
                            </CardContent>
                    </div>
                </div>
            </div>
        </div>
        </DeletedLogsContext.Provider>
        </>
    );
}
'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import { useQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card"
import { createContext } from "react";
import { ClientsDetail } from "./clientsDetail";
import { CircleSlash, Loader, Ellipsis, PhoneCall, PanelTopOpen } from "lucide-react";
import { ClientsDialog } from "@/components/component/clientsDialog";
import { StartClientCall } from "@/components/component/start-client-call";

export interface ClientProps {
    uid: number,
    client_name: string,
    LEG_num: string,
    phone_number: number,
    cellphone: number,
    Enabled: string,
    Licenses: number,
    expiry_date: string,
    total_balance: number,
    current: number,
    thirtyDays: number,
    sixtyDays: number,
    ninetyDays: number,
    support: number,
    support_package: number
}

export type ClientResponseType = ClientProps[]


//clientsContext
export const ClientsContext = createContext<ClientProps | null>(null);

export const ClientsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [uID, setUID] = useState('');

    const [viewClient, setViewClient] = useState<ClientProps | null>(null);

    const [input, setInput] = useState('');
    const [state, setState] = useState({
            isOpen: true,
            expandView: null
    });

    const [startClientPopUp, setStartClientPopUp] = useState(false);

    //fetch Customer Data:
    const clientsUrl = `customers/getcustomers`;
    const { data, loading, error} = useQuery<ClientResponseType>(clientsUrl);
    console.log("loading customers:", data)
    

    const openModal = (id: any) => {
        if (currentOpen === id) {
            setCurrentOpen('');
            setState({ ...state, isOpen: false, expandView: null });

        } else {
            setCurrentOpen(id);
            setState({ ...state, isOpen: true, expandView: id});

            const selectedClient = data?.find(client => client.uid === id || null);

            if (selectedClient) {
                setViewClient(selectedClient);
            }

            console.log('lets see this my client id', selectedClient);
        }
    }

    const closeModal = () => {
        setState({ ...state, isOpen: false, expandView: null });
        setCurrentOpen('');
        console.log("closeModal called");
    };

    const searchCustomers = (clientname: any) => {
        setInput(clientname);
        console.log("MY CLIENTNAME:+++++", clientname);
    }

    const toggleStartClientCall = (uid: number) => {
        const selectedClient = data?.find(client => client.uid === uid || null);
        if (selectedClient) {
            setViewClient(selectedClient);
        }
        setStartClientPopUp(!startClientPopUp);
    }

    const closeToggle = () => {
        setStartClientPopUp(!startClientPopUp);
    }


    if (loading) {
        return (
            <>
             <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
                <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                    <ClientsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchCustomers(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text dark:header-text">Legend Customers</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto  table-container">
                                    <table className="w-full table-auto">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
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
        );
    }


    if (error) {
        return (
          <>
            <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
                <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                    <ClientsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchCustomers(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text dark:header-text">Legend Customers</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto  table-container">
                                    <table className="w-full table-auto">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
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
        <>
          <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
                <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                    <ClientsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchCustomers(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text dark:header-text">Legend Customers</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto  table-container">
                                    <table className="w-full table-auto">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
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
                                            <tr>
                                                <td colSpan={9} className="h-[150px]">
                                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                                        <PanelTopOpen className="h-12 w-12" />
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

    //const displayedClients = input ? myFilteredClients : data;
    const filterClients = input
        ? data?.filter(ticket => 
            ticket.uid?.toString().toLowerCase().includes(input.toLowerCase()) ||
            ticket.client_name.toLowerCase().includes(input.toLowerCase()),
        )
        : data;

    return (
        <>
        {startClientPopUp && <StartClientCall onClose={closeToggle} data={viewClient} />}
        <ClientsContext.Provider value={viewClient}>
        <div className="pg-background">
            <div className="h-screen w-full overflow-auto">
                <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                    <ClientsDialog />
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="chart-background dash-text p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchCustomers(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div className="mt-6">
                            <h6 className="ml-6 text-3xl py-4 font-bold header-text dark:header-text">Legend Customers</h6>
                        </div>
                        <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto  table-container">
                                    <table className="w-full table-auto">
                                        <thead className="table-headerup">
                                            <tr className="text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
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
                                            {filterClients?.map(({ uid, client_name, LEG_num, phone_number, cellphone, Enabled, Licenses, expiry_date, total_balance, current, thirtyDays, sixtyDays, ninetyDays, support, support_package }) => (
                                                <>
                                                    <tr key={uid} className="border-b">
                                                    <td className="p-2 font-medium">{uid}</td>
                                                    <td className="break-all overflow-hidden text-ellipsis max-w-[300px]">{client_name}</td>
                                                    <td className="">{LEG_num}</td>
                                                    <td className="">{phone_number || '--:--'}</td>
                                                    <td className="">{cellphone || '--:--'}</td>
                                                    <td className="">{Enabled}</td>
                                                    <td className="p-2">{formatDate(expiry_date)}</td>
                                                    <td className="">{total_balance}</td>
                                                    <td className="text-center">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-purple hover:bg-violet-300 py-4 w-8/12" onClick={() => { openModal(uid)} }>
                                                                <Ellipsis size={18} strokeWidth={2} />
                                                            </Button>
                                                            <Button size="sm" className="bg-green hover:bg-emerald-300 py-4 w-8/12" onClick={() => { toggleStartClientCall(uid)} }>
                                                                <PhoneCall size={18} strokeWidth={2} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {state.isOpen && state.expandView === uid && (
                                                    <tr>
                                                        <td colSpan={9} className="p-0">
                                                            <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                                                <ClientsDetail onClose={ closeModal } />
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
        </ClientsContext.Provider>
        </>
    );
}

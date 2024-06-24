'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { isEmpty } from 'lodash';
import { useQuery } from "@/hooks/useQuery";

import { Button } from "@/components/ui/button";
import { EyeIcon, CoffeeIcon, PhoneIcon, ActivityIcon } from "@/components/component/tickets-table";

import { createContext } from "react";
import { ClientsDetail } from "./clientsDetail";
import { TicketTransfer } from "@/components/component/ticket-transfer";

import Image from 'next/image';

interface ClientProps {
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

type ClientResponseType = ClientProps[]


//clientsContext
export const ClientsContext = createContext<ClientProps | null>(null);

export const ClientsModule = () => {
    const [currentOpen, setCurrentOpen] = useState('');
    const [uID, setUID] = useState(0);

    const [viewClient, setViewClient] = useState<ClientProps | null>(null);

    const [input, setInput] = useState('');

    //const [myFilteredClients, setMyFilteredClients] = useState<ClientResponseType>([]);

    const [state, setState] = useState({
            isOpen: true,
            expandView: null
    });

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
    
    // const fetchSearchedCustomer = async (clientname: any) => {
    //   try {
    //     const url = `customers/getsearchedcustomer/${clientname}`
    //     const eachclient = await axios.get<ClientResponseType>(`${apiEndPoint}/${url}`);

    //     setMyFilteredClients(eachclient.data);
    //     console.log('MY SEARCHED CLIENT!!!!!!!!:', clientname);

    //   } catch (error) {
    //       console.error('error loading each ticket:', error);
    //   }
    // }

    //update input state x call backendurl to search customer
    const searchCustomers = (clientname: any) => {
        setInput(clientname);
        console.log("MY CLIENTNAME:+++++", clientname);
      //fetchSearchedCustomer(clientname);
    }


    if (loading) {
        return (
            <>
                <div className="bg-white">
                    <div className="h-screen w-full overflow-auto">
                        <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-end">
                            <div className="flex items-center">
                                <div className="text-right">
                                    <input
                                        className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                        placeholder="Search Ticket"
                                        style={{ width: "440px" }}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex items-center ml-4">
                                <Button size="lg" variant="ghost" disabled>
                                    <img
                                        alt="Avatar"
                                        height="32"
                                        src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
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
                            <Button size="lg" className="bg-purple" disabled>
                                <PhoneIcon className="h-4 w-4 mr-2" />
                                <span>Start Call</span>
                            </Button>
                            <Button size="lg" className="bg-purple" disabled>
                                <CoffeeIcon className="h-4 w-4 mr-2" />
                                <span>Start Break</span>
                            </Button>
                        </div>
                        <div className="grid gap-6">
                            <div className="h-screen overflow-auto">
                                <div>
                                    <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
                                </div>
                                <div className="ml-4 mr-4 border rounded-lg shadow-sm">
                                    <div className="p-0">
                                        <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                            <table className="w-full table-auto">
                                                <thead className="bg-greyDarker">
                                                    <tr className="bg-grey text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
                                                        <th className="p-2">UID</th>
                                                        <th>Customer</th>
                                                        <th>Support No.</th>
                                                        <th>Number 1</th>
                                                        <th>Number 2</th>
                                                        <th>Enabled</th>
                                                        <th className="p-2">Expiry Date</th>
                                                        <th>Balance</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...Array(10)].map((_, index) => (
                                                        <tr key={index} className="border-b">
                                                            <td className="p-2 font-medium">
                                                                <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
                                                            </td>
                                                            <td className="break-all overflow-hidden text-ellipsis max-w-[300px]">
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
        );
    }


    if (error) {
        return (
          <>
            <div className="bg-white">
              <div className="h-screen w-full overflow-auto">
              <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-end">
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button size="lg" variant="ghost">
                            <img
                                alt="Avatar"
                                height="32"
                                src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
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
                    <Button size="lg" className="bg-purple">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span>Start Call</span>
                    </Button>
                    <Button size="lg" className="bg-purple">
                        <CoffeeIcon className="h-4 w-4 mr-2" />
                        <span>Start Break</span>
                    </Button>
                </div>
                <div className="grid gap-6">
                  <div className="h-screen overflow-auto">
                    <div>
                      <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
                    </div>
                    <div className="ml-4 mr-4 border rounded-lg shadow-sm">
                      <div className="p-0">
                        <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                          <table className="w-full table-auto">
                            <thead className="bg-greyDarker">
                              <tr className="bg-grey text-cnter h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
                                <th className="">UID</th>
                                <th className="">Customer</th>
                                <th className="">Support No.</th>
                                <th className="">Number 1</th>
                                <th className="">Number 2</th>
                                <th className="">Enabled</th>
                                <th className="">Expiry Date</th>
                                <th className="">Balance</th>
                                <th className="">Action</th>
                              </tr>
                            </thead>
                          </table>
                          <div className="text-center mt-10">
                              <Image src="/covers/archive-x.png" alt="Archive X" width={50} height={50} className="mx-auto" />
                              <p className="text-red text-lg">An Error was encountered when fetching Data!</p>
                          </div>
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


    if (!data && !isEmpty(data)) {
      return (
        <>
          <div className="bg-white">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                      <div className="text-right">
                          <input
                              className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                              placeholder="Search Ticket"
                              style={{ width: "440px" }}
                          />
                      </div>
                  </div>
                  <div className="flex items-center">
                      <Button size="lg" variant="ghost">
                          <img
                              alt="Avatar"
                              height="32"
                              src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
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
              <div className="bg-white flex justify-start px-5 py-2 items-center space-x-6 mt-2">
                  <Button size="lg" className="bg-purple">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>Start Call</span>
                  </Button>
                  <Button size="lg" className="bg-purple">
                      <CoffeeIcon className="h-4 w-4 mr-2" />
                      <span>Start Break</span>
                  </Button>
              </div>
              <div className="grid gap-6">
                <div className="h-screen overflow-auto">
                  <div>
                    <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
                  </div>
                  <div className="ml-4 mr-4 border rounded-lg shadow-sm">
                    <div className="p-0">
                      <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                        <table className="w-full table-auto">
                          <thead className="bg-greyDarker">
                            <tr className="bg-grey text-cnter h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
                              <th className="">UID</th>
                              <th className="">Customer</th>
                              <th className="">Support No.</th>
                              <th className="">Number 1</th>
                              <th className="">Number 2</th>
                              <th className="">Enabled</th>
                              <th className="">Expiry Date</th>
                              <th className="">Balance</th>
                              <th className="">Action</th>
                            </tr>
                          </thead>
                        </table>
                        <div className="text-center mt-10">
                            <Image src="/covers/circle-slash.png" alt="Archive X" width={50} height={50} className="mx-auto" />
                            <p className="text-red text-lg">THERE IS CURRENTLY NO DATA FOR THE LEGEND CUSTOMERS</p>
                        </div>
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
        <ClientsContext.Provider value={viewClient}>
        <div className="bg-white">
            <div className="h-screen w-full overflow-auto">
                <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-end">
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="border-black text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchCustomers(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button size="lg" variant="ghost">
                            <img
                                alt="Avatar"
                                height="32"
                                src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
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
                    <Button size="lg" className="bg-purple">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span>Start Call</span>
                    </Button>
                    <Button size="lg" className="bg-purple">
                        <ActivityIcon className="h-4 w-4 mr-2" />
                        <span>Start Activity</span>
                    </Button>
                </div>
                <div className="grid gap-6">
                    <div className="h-screen overflow-auto">
                        <div>
                            <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
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
                                                            <Button size="sm" className="bg-purple py-4 w-20" onClick={() => { openModal(uid)}}>
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {state.isOpen && state.expandView === uid && (
                                                    <tr>
                                                        <td colSpan={9} className="p-0">
                                                            <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                                                <ClientsDetail onClose={closeModal} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                </>
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
        </ClientsContext.Provider>
        </>
    );
}

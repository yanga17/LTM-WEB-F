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
import { TicketTransfer } from "@/components/component/ticket-transfer";
import { Undo2, CircleSlash2, CircleSlash, Check  } from "lucide-react";

import Image from 'next/image';

interface DeletedProps {
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
type DeletedResponseType = DeletedProps[]


export const DeletedLogsModule = () => {
    const [undoID, setUndoID] = useState(0);
    const [deletedData, setDeletedData] = useState<DeletedResponseType>([]);
    const [input, setInput] = useState('');

    const generateDeletedLogs = async () => {
      try {
        const deletedurl = `deletedlogs/getdeletedlogs`
        const response = await axios.get(`${apiEndPoint}/${deletedurl}`)
        console.log("DELETED LOGS DATA:", response)
        setDeletedData(response.data)

      } catch (error) {

        console.error("Error getting deleted logs:", error);

      }
    }

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

    // const deletedTicket 

    const searchDeletedLogs = (clientname: any) => {
      setInput(clientname);
      console.log("MY CLIENTNAME:+++++", clientname);
    }
    
    useEffect(() => {
        generateDeletedLogs();
    }, [])


    // if (loading) {
    //     return (
    //       <>
    //         <div className="bg-white">
    //           <div className="h-screen w-full overflow-auto">
    //             <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
    //               <div className="flex items-center">
    //                 <div className="text-right">
    //                   <input
    //                     className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
    //                     placeholder="Search Ticket"
    //                     style={{ width: "440px" }}
    //                   />
    //                 </div>
    //               </div>
    //               <div className="flex items-center">
    //                 <Button size="lg" variant="ghost">
    //                   <img
    //                     alt="Avatar"
    //                     height="32"
    //                     src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
    //                     style={{
    //                       aspectRatio: "32/32",
    //                       objectFit: "cover",
    //                     }}
    //                     width="32"
    //                   />
    //                   <span className="sr-only">User Profile</span>
    //                 </Button>
    //               </div>
    //             </header>
    //             <div className="bg-white flex justify-start px-5 py-2 items-center space-x-6 mt-2">
    //               <Button size="lg" className="bg-purple">
    //                 <PhoneIcon className="h-4 w-4 mr-2" />
    //                 <span>Start Call</span>
    //               </Button>
    //               <Button size="lg" className="bg-purple">
    //                 <CoffeeIcon className="h-4 w-4 mr-2" />
    //                 <span>Start Break</span>
    //               </Button>
    //             </div>
    //             <div className="grid gap-6">
    //               <div className="h-screen overflow-auto">
    //                 <div>
    //                   <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
    //                 </div>
    //                 <div className="ml-4 mr-4 border rounded-lg shadow-sm">
    //                   <div className="p-0">
    //                     <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
    //                       <table className="w-full table-auto">
    //                         <thead className="bg-greyDarker">
    //                           <tr className="bg-grey text-left h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
    //                             <th className="p-2">Call ID</th>
    //                             <th className="">Employee</th>
    //                             <th className="">Customer</th>
    //                             <th className="">Problem</th>
    //                             <th className="">Client Name</th>
    //                             <th className="">Issue Type</th>
    //                             <th className="p-2">Insertion Time</th>
    //                             <th className="">Reason</th>
    //                             <th className="">Action</th>
    //                           </tr>
    //                         </thead>
    //                         <tbody>
    //                           {[...Array(10)].map((_, index) => (
    //                             <tr key={index} className="border-b">
    //                               <td className="p-2 font-medium">
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[120px]">
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td className="whitespace-normal break-all overflow-hidden text-ellipsis max-w-[200px]">
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td>
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td>
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td>
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td className="p-2">
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td>
    //                                 <div className='bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded'></div>
    //                               </td>
    //                               <td className="text-center">
    //                                 <div className="flex gap-2">
    //                                   <Button size="sm" className="bg-black-light animate-pulse py-4 w-11/12 mx-auto rounded" disabled>
    //                                     <Undo2 className="h-4 w-4" />
    //                                   </Button>
    //                                 </div>
    //                               </td>
    //                             </tr>
    //                           ))}
    //                         </tbody>
    //                       </table>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="flex flex-col items-center justify-center mt-40">
    //                     <CircleSlash className="h-14 w-14" />
    //                     <p className="text-red text-lg mt-2">An Error was encountered when fetching Data!</p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     )
    //   }


    // if (error) {
    //     return (
    //       <>
    //         <div className="bg-white">
    //           <div className="h-screen w-full overflow-auto">
    //           <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
    //                 <div className="flex items-center">
    //                     <div className="text-right">
    //                         <input
    //                             className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
    //                             placeholder="Search Ticket"
    //                             style={{ width: "440px" }}
    //                         />
    //                     </div>
    //                 </div>
    //                 <div className="flex items-center">
    //                     <Button size="lg" variant="ghost">
    //                         <img
    //                             alt="Avatar"
    //                             height="32"
    //                             src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
    //                             style={{
    //                                 aspectRatio: "32/32",
    //                                 objectFit: "cover",
    //                             }}
    //                             width="32"
    //                         />
    //                         <span className="sr-only">User Profile</span>
    //                     </Button>
    //                 </div>
    //             </header>
    //             <div className="bg-white flex justify-start px-5 py-2 items-center space-x-6 mt-2">
    //                 <Button size="lg" className="bg-purple">
    //                     <PhoneIcon className="h-4 w-4 mr-2" />
    //                     <span>Start Call</span>
    //                 </Button>
    //                 <Button size="lg" className="bg-purple">
    //                     <CoffeeIcon className="h-4 w-4 mr-2" />
    //                     <span>Start Break</span>
    //                 </Button>
    //             </div>
    //             <div className="grid gap-6">
    //               <div className="h-screen overflow-auto">
    //                 <div>
    //                   <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
    //                 </div>
    //                 <div className="ml-4 mr-4 border rounded-lg shadow-sm">
    //                   <div className="p-0">
    //                     <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
    //                       <table className="w-full table-auto">
    //                         <thead className="bg-greyDarker">
    //                           <tr className="bg-grey text-cnter h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
    //                             <th className="">Call ID</th>
    //                             <th className="">Employee</th>
    //                             <th className="">Customer</th>
    //                             <th className="">Problem</th>
    //                             <th className="">Client Name</th>
    //                             <th className="">Issue Type</th>
    //                             <th className="">Insertion Time</th>
    //                             <th className="">Reason</th>
    //                             <th className="">Action</th>
    //                           </tr>
    //                         </thead>
    //                       </table>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="flex flex-col items-center justify-center mt-40">
    //                     <CircleSlash2 className="h-14 w-14" />
    //                     <p className="text-red text-lg mt-2">An Error was encountered when fetching Data!</p>
    //                 </div>
    //               </div>
    //             </div> 
    //           </div>
    //         </div>
    //       </>
    //     )
    //   }


    // if (!data && !isEmpty(data)) {
    //   return (
    //     <>
    //       <div className="bg-white">
    //         <div className="h-screen w-full overflow-auto">
    //         <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-between">
    //               <div className="flex items-center">
    //                   <div className="text-right">
    //                       <input
    //                           className="border-grey text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
    //                           placeholder="Search Ticket"
    //                           style={{ width: "440px" }}
    //                       />
    //                   </div>
    //               </div>
    //               <div className="flex items-center">
    //                   <Button size="lg" variant="ghost">
    //                       <img
    //                           alt="Avatar"
    //                           height="32"
    //                           src="C:\\Users\\Pc\\Pictures\\Camera Roll\\toji.jpg"
    //                           style={{
    //                               aspectRatio: "32/32",
    //                               objectFit: "cover",
    //                           }}
    //                           width="32"
    //                       />
    //                       <span className="sr-only">User Profile</span>
    //                   </Button>
    //               </div>
    //           </header>
    //           <div className="bg-white flex justify-start px-5 py-2 items-center space-x-6 mt-2">
    //               <Button size="lg" className="bg-purple">
    //                   <PhoneIcon className="h-4 w-4 mr-2" />
    //                   <span>Start Call</span>
    //               </Button>
    //               <Button size="lg" className="bg-purple">
    //                   <CoffeeIcon className="h-4 w-4 mr-2" />
    //                   <span>Start Break</span>
    //               </Button>
    //           </div>
    //           <div className="grid gap-6">
    //             <div className="h-screen overflow-auto">
    //               <div>
    //                 <h6 className="ml-6 text-3xl py-4 font-bold">Legend Customers</h6>
    //               </div>
    //               <div className="ml-4 mr-4 border rounded-lg shadow-sm">
    //                 <div className="p-0">
    //                   <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
    //                     <table className="w-full table-auto">
    //                       <thead className="bg-greyDarker">
    //                         <tr className="bg-grey text-cnter h-10 p-2 text-sm font-medium border-rounded rounded-topleft rounded-topright">
    //                           <th className="">Call ID</th>
    //                           <th className="">Employee</th>
    //                           <th className="">Custoemr</th>
    //                           <th className="">Problem</th>
    //                           <th className="">Client Name</th>
    //                           <th className="">IssueType</th>
    //                           <th className="">Insertion Time</th>
    //                           <th className="">Reason</th>
    //                           <th className="">Action</th>
    //                         </tr>
    //                       </thead>
    //                     </table>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="text-center mt-10">
    //                   <Image src="/covers/circle-slash.png" alt="Archive X" width={50} height={50} className="mx-auto" />
    //                   <p className="text-red text-lg">THERE IS CURRENTLY NO DATA FOR THE LEGEND CUSTOMERS</p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   )
    // }

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

    
    const filteredData = input
        ? deletedData.filter(ticket => 
            ticket.Call_ID?.toString().toLowerCase().includes(input.toLowerCase()) ||
            ticket.Customer.toLowerCase().includes(input.toLowerCase()) || 
            ticket.Employee.toLowerCase().includes(input.toLowerCase()),
        )
        : deletedData; 

        console.log("MY FILTERED DATA", filteredData)




    return (
        <>
        <div className="bg-white">
            <div className="h-screen w-full overflow-auto">
            <header className="text-gray-50 px-5 py-0 mt-4 flex items-center justify-end">
                    {/* <div className="flex align-left mt-10 items-center">
                        <Image src="/covers/legendSystems.png" alt="Archive X" width={400} height={200} className="mr-2" />
                    </div> */}
                    <div className="flex items-center">
                        <div className="text-right">
                            <input
                                className="border-black text-black p-2 w-full border rounded-full outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"
                                placeholder="Search Ticket"
                                value={input}
                                style={{ width: "440px" }}
                                onChange={(e) => searchDeletedLogs(e.target.value)}
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
                            <h6 className="ml-6 text-3xl py-4 font-bold">Deleted Logs</h6>
                        </div>
                        <div className="ml-4 mr-4 border rounded-lg shadow-sm">
                            <div className="p-0">
                                <div className="max-h-[550px] md:max-h-[700px] lg:max-h-[750px] overflow-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="bg-greyDarker">
                                            <tr className="bg-grey text-left h-10 p-2 text-medium">
                                                <th className="p-2">Call ID</th>
                                                <th className="">Employee</th>
                                                <th className="">Customer</th>
                                                <th className="">Problem</th>
                                                <th className="">Client Name</th>
                                                <th className="">IssueType</th>
                                                <th className="p-2 w-[220px] lg:w-[220px] xl:lg:w-[220px]">Insertion Time</th>
                                                <th className="">Reason</th>
                                                <th className="w-[90px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.map(({ idx, Call_ID, Employee, Customer, Problem, Client_Name, Phone_Number, Start_Time, End_Time, SupportNumber, Priority, IssueType, Type, Comments, insertion_time, Reason }) => (
                                                <>
                                                    <tr key={Call_ID} className="border-b font-medium">
                                                    <td className="p-2">{Call_ID || '--:--'}</td>
                                                    <td className="">{Employee || '--:--'}</td>
                                                    <td className="">{Customer || '--:--'}</td>
                                                    <td className="">{Problem || '--:--'}</td>
                                                    <td className="">{Client_Name || '--:--'}</td>
                                                    <td className="">{IssueType || '--:--'}</td>
                                                    <td className="p-2">{formatDate(insertion_time)}</td>
                                                    <td className="">{Reason || '--:--'}</td>
                                                    <td className="text-center">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-purple py-4 w-11/12"
                                                            onClick={() => {
                                                                const selectedTicket = deletedData.find(t => t.Call_ID === Call_ID);
                                                                if (selectedTicket) {
                                                                  undoTicket(selectedTicket);
                                                                    console.log('INSERTED THE deleted ticket back into tblcalls', selectedTicket);
                                                                } else {
                                                                    console.error('Selected ticket not found');
                                                                }
                                                            }}>
                                                                <Undo2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* {state.isOpen && state.expandView === uid && (
                                                    <tr>
                                                        <td colSpan={9} className="p-0">
                                                            <div className="justify-start w-full duration-500 ease-in-out transition-max-height">
                                                                <ClientsDetail clientData={viewClient} uid={uid} onClose={closeModal}/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )} */}
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
        </>
    );
}



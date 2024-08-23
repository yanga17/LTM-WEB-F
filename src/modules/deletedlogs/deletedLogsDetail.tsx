'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import {useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';
import { Undo2, Minimize2, Check  } from "lucide-react";
import { useContext } from 'react'; 
import { DeletedResponseType } from './deletedLogsModule';
import { DeletedLogsContext } from './deletedLogsModule';
import { format } from "date-fns";
import { useSession } from '@/context';

interface EachTicketsProps {
    onClose: () => void;
    // undoFn: (tickets: DeletedProps) => void;
}

//type ResponseType = CheckProps[]

export const EachDeletedTicketsModule = ({ onClose }: EachTicketsProps) => {
    //for the undoFn
    const [deletedData, setDeletedData] = useState<DeletedResponseType>([]);
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deletionId, setDeletionId] = useState(0);
    const { user } = useSession();

    const deletedlog = useContext(DeletedLogsContext);

    if (!deletedlog) {
        return <div>No data available</div>;
    }

    const undoNotification = () => {
        toast.success('Ticket undone successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const undoTicket = async () => {
      let customerData = deletedlog.Customer
      let supportNo = null;

      if (customerData.includes(",")) {
        const newCustomer = customerData.split(",");
        customerData = newCustomer[0].trim();
        supportNo = newCustomer[1].trim();
      }

      try {
        const takenValue = 0; //loggedticket to appear

        const ticketDate = format(
            new Date(deletedlog.Start_Time),
            "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
          ); //new date-time format


        const payLoad = {
          customer: customerData,
          problem: deletedlog.Problem,
          phoneNo: deletedlog.Phone_Number,
          starttime: ticketDate,
          emp: deletedlog.Employee,
          clientname: deletedlog.Client_Name,
          taken: takenValue,
          Supportnumber: supportNo,
          urgent: deletedlog.Priority,
          issueType: deletedlog.IssueType,
          type: deletedlog.Type,
          comments: deletedlog.Comments
          }
          //const insertCallUrl = `deletedlogs/insertcallticket`
          const response = await axios.post(`${apiEndPoint}/deletedlogs/insertcallticket`, payLoad);
          console.log('Ticket in DeletedLogsDetails was undone successfully:', response.data);
          undoNotification();

        } catch (err) {
          console.error('Error undo-ing the selected ticket within DeletedLogsdetail:', err);

        }
    }


    const toggleDeletePage = () => {
        setDeletePopUp(!deletePopUp);
    }

    const { role } = user


    return (
    <>
        <div className="p-4 pg-background">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md text-purple uppercase">{deletedlog.Call_ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Employee || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Client Email</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Email_Address || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.SupportNumber || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Reason</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Reason || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Customer}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Problem || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(deletedlog.Start_Time).toLocaleString()}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Insertion Time</p>
                            <p className="font-semibold text-md uppercase">{new Date(deletedlog.insertion_time?.slice(0, 19).replace('T', ' ')).toLocaleString() || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Client_Name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md uppercase">{deletedlog.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">IssueType</p>
                            <p className={`font-semibold text-md ${deletedlog.IssueType ? (deletedlog.IssueType === 'Task' ? 'text-green' : 'text-red') : 'header-text'}`}>{deletedlog.IssueType || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 sm:text-gray-500 text-md">Priority</p>
                            <p className={`font-semibold text-md ${deletedlog.Priority === 'P1' ? 'text-red' : deletedlog.Priority === 'P2' ? 'text-orange' : (deletedlog.Priority === 'P3' || deletedlog.Priority === 'P4') ? 'text-grey' : ''}`}>{deletedlog.Priority || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <button onClick={undoTicket} disabled={role === 'Technician'} className={`cancel-detail ${role === 'Technician' ? 'cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                            <span>Undo</span>
                            <Undo2 size={18} strokeWidth={2} className="ml-2" />
                        </button>
                        <button onClick={onClose} className="close-detail">
                            <span>Close</span>
                            <Minimize2 size={18} strokeWidth={2} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
    </>
    );
}
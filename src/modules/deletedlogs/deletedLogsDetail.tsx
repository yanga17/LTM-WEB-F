'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import {useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';
import { Undo2, Minimize2, Check  } from "lucide-react";
import { useContext } from 'react'; 
import { DeletedResponseType } from './deletedLogsModule';
import { DeletedLogsContext } from './deletedLogsModule';

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
        const payLoad = {
          customer: customerData,
          problem: deletedlog.Problem,
          phoneNo: deletedlog.Phone_Number,
          starttime: new Date(deletedlog.Start_Time).toISOString().slice(0, 19).replace('T', ' '),
          emp: deletedlog.Employee,
          clientname: deletedlog.Client_Name,
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


    return (
    <>
        <div className="p-4 bg-white">
                <h2 className="mb-2 text-xl font-semibold">Ticket Information</h2>
                <div className="flex flex-wrap">
                    <div className="w-1/3">
                        <div>
                            <p className="font-medium text-gray-500 text-md">Call ID</p>
                            <p className="font-semibold text-md">{deletedlog.Call_ID}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Employee</p>
                            <p className="font-semibold text-md">{deletedlog.Employee || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Support No</p>
                            <p>{deletedlog.SupportNumber || '--:--'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 text-md">IssueType</p>
                            <p className="font-semibold text-md">{deletedlog.IssueType || '--:--'}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Customer</p>
                            <p className="font-semibold text-md">{deletedlog.Customer}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Problem</p>
                            <p className="font-semibold text-md">{deletedlog.Problem || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Start Time</p>
                            <p>{new Date(deletedlog.Start_Time).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Client Name</p>
                            <p className="font-semibold text-md">{deletedlog.Client_Name || '--:--'}</p>
                        </div>
                        <div className="mb-4 mt-4">
                            <p className="font-medium text-gray-500 text-md">Phone Number</p>
                            <p className="font-semibold text-md">{deletedlog.Phone_Number || '--:--'}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium text-gray-500 text-md">Comments</p>
                            <p className="font-semibold text-md">{deletedlog.Comments || '--:--'}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 gap-4">
                        <Button onClick={undoTicket} className="mr-2 bg-green">Undo
                            <Undo2 size={18} strokeWidth={2} color="white" className="ml-2" />
                        </Button>
                        <Button onClick={onClose} className="mr-2 bg-orange">Close
                            <Minimize2 size={18} strokeWidth={2} color="white" className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
    </>
    );
}
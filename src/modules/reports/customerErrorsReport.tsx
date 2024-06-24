'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";
import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface CustomerErrorProps {
    Call_ID: number,
    Problem: string,
    Customer: string,
    ErrorCount: number
}
export type CustomerErrorResponse = CustomerErrorProps[]


export const CustomerErrorsReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [data, setData] = useState<CustomerErrorResponse>([]);

    const headers = ['Call ID', 'Error', 'Customer', 'No. Times Counted']

    const filterCustomerErrorsReport = async () => {
        try {
            const url = `reports/getcustomererrordata/${startTime}/${endTime}`
            const response = await axios.get<CustomerErrorResponse>(`${apiEndPoint}/${url}`);
            setData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching the Client Error Report:', error);
        }
    }

    const customerErrorsLog = data?.map((property) => ({
        callid: property?.Call_ID,
        error: property.Problem,
        customer: property.Customer,
        errorCount: property.ErrorCount
    }))

    console.log("CUSTOMER ERRORS REPORT DATA", data)


    return (
        <>
        <div className="h-screen overflow-auto">
            <div className="w-full lg:flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2 text-black">
                    <label>Start Date:</label>
                    <input type="datetime-local" name="starttime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col p-2 text-black">
                    <label>End Date:</label>
                    <input type="datetime-local" name="endtime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col mt-5">
                    <button onClick={ filterCustomerErrorsReport } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Filter
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {customerErrorsLog?.map(({ callid, error, errorCount, customer }, index) => (
                <div key={callid} className={` bg-white text-black p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{callid}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{error}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{customer}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{errorCount}</p>
                </div>
            ))}
        </div>
        </>
    )
}
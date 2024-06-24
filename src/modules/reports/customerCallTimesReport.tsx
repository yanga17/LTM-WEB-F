'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";
import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';


interface EmployeeAvgProps {
    ID: number,
    Employee: string,
    Activity: string,
    Customer: string,
    Phone_Number: number,
    StartTime: string,
    EndTime: string,
    Duration: number,
    Comments: string,
    Solution: string
}
export type EmployeeAvgResponse = EmployeeAvgProps[]


export const CustomerCallTimesReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [data, setData] = useState<EmployeeAvgResponse>([]);

    const headers = ['Call ID', 'Employee', 'Problem', 'Customer', 'Phone Number', 'Start Time', 'End Time', 'Duration']

    const filterCallTimesReport = async () => {
        try {
            const url = `reports/getcalltimesdata/${startTime}/${endTime}`
            const response = await axios.get<EmployeeAvgResponse>(`${apiEndPoint}/${url}`);
            setData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching the Client Error Report:', error);
        }
    }


    const employeeAvgLog = data?.map((property) => ({
        id: property?.ID,
        employee: property.Employee,
        activity: property.Activity,
        customer: property.Customer,
        phoneNumber: property.Phone_Number,
        startTime: new Date(property.StartTime).toLocaleString(),
        endTime: new Date(property.EndTime).toLocaleString(),
        duration: property.Duration,
        solution: property.Solution,
        comments: property.Comments
    }))
    

    console.log("EMPLOYEE AVERAGE TIME REPORT DATA", data)


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
                    <button onClick={ filterCallTimesReport } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Filter
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {employeeAvgLog?.map(({ id, employee, activity, customer, phoneNumber, startTime, endTime, duration, solution, comments }, index) => (
                <div key={id} className={` bg-white text-black p-4 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{id}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{employee}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{activity}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{customer}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center text-overflow truncate">{phoneNumber}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{startTime}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{endTime}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{duration}</p>
                </div>
            ))}
        </div>
        </>
    )
}
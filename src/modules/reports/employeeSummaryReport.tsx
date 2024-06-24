'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";
import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface EmployeeSumProps {
    ID: number,
    Employee: string,
    Monday: number,
    Tuesday: number,
    Wednesday: number,
    Thursday: number,
    Friday: number,
    Saturday: number,
    Sunday: number,
    OverallTotal: number
}
export type EmployeeSumResponse = EmployeeSumProps[]


export const EmployeeSummaryReport = () => {
    //http://localhost:4200/reports/getemployeeummarydata/2024-06-01 08:00:17/2024-06-18 08:00:00
    const [startTime, setStartTime] = useState('2024-06-01 08:00:17');
    const [endTime, setEndTime] = useState('2024-06-18 08:00:00');
    const [data, setData] = useState<EmployeeSumResponse>([]);

    const headers = ['Call ID', 'Employee', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Total Tickets Per Employee']

    const filterEmployeeAvgReport = async () => {
        try {
            const url = `reports/getemployeeummarydata/${startTime}/${endTime}`
            const response = await axios.get<EmployeeSumResponse>(`${apiEndPoint}/${url}`);
            setData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching the Employee Summary Report:', error);
        }
    }

    useEffect(() => {
        filterEmployeeAvgReport();
    }, []);

    const employeeAvgLog = data?.map((property) => ({
        id: property?.ID,
        employee: property.Employee,
        monday: property.Monday,
        tuesday: property.Tuesday,
        wednesday: property.Wednesday,
        thursday: property.Thursday,
        friday: property.Friday,
        saturday: property.Saturday,
        sunday: property.Sunday,
        ovrTotal: property.OverallTotal,
    }))
    

    console.log("EMPLOYEE SUMMARY REPORT DATA", data)


    return (
        <>
        <div className="h-screen overflow-auto">
            <div className="w-full p-2 lg:flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2 text-black">
                    <label>Start Date:</label>
                    <input type="datetime-local" name="starttime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col p-2 text-black">
                    <label>End Date:</label>
                    <input type="datetime-local" name="endtime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col mt-5">
                    <button onClick={ filterEmployeeAvgReport } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Filter
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {employeeAvgLog?.map(({ id, employee, monday, tuesday, wednesday, thursday, friday, saturday, sunday, ovrTotal }, index) => (
                <div key={id} className={` bg-white text-black p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{id}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{employee}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{monday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{tuesday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{wednesday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{thursday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{friday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{saturday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{sunday}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{ovrTotal}</p>
                </div>
            ))}
        </div>
        </>
    )
}
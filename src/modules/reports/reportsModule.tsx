'use client'

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";
import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";

import { CustomerCallsReport } from './customerCallsReport';
import { CustomerErrorsReport } from './customerErrorsReport';
import { EmployeeTaskReport } from './employeeTasksReport'
import { EmployeeAvgReport } from './employeeAvgReport';
import { EmployeeSummaryReport } from './employeeSummaryReport';
import { CustomerCallTimesReport } from './customerCallTimesReport'

interface ClientHistoryProps {
    ID: number,
    Customer: string,
    Activity: string,
    StartTime: string,
    EndTime: string
    Duration: string,
    IssueType: string
}
export type ClientHistoryResponse = ClientHistoryProps[]


export const ReportsModule = () => {
    const [clHistoryStartTime, setCLHistoryStartTime] = useState('');
    const [clHistoryEndTime, setCLHistoryEndTime] = useState('');
    const [currentReport, setCurrentReport] = useState('ClientHistory');


    const [data, setData] = useState<ClientHistoryResponse>([]);

    const headers = ['Call ID', 'Customer', 'Activity', 'StartTime', 'EndTime', 'Duration', 'Issue Type']

    const filterClientHistoryReport = async () => {
        try {
            const url = `reports/getclienthistorydata/${clHistoryStartTime}/${clHistoryEndTime}`
            const response = await axios.get<ClientHistoryResponse>(`${apiEndPoint}/${url}`);
            setData(response?.data)
            //toast.success("Client History Report has been filtered successfully")
        } catch (error) {
            console.error('An error occurred while fetching the Client History Reports:', error);
        }
    }

    const clientHistoryLog = data?.map((property) => ({
        id: property?.ID,
        customer: property.Customer,
        activity: property.Activity,
        starttime: new Date(property.StartTime?.slice(10, 19)?.replace('T', '')).toLocaleString(),
        endtime: new Date(property.EndTime?.slice(10, 19)?.replace('T', '')).toLocaleString(),
        duration: property.Duration,
        issueType: property.IssueType
    }))


    return (
        <>
        <div className="h-screen overflow-auto">
            <div className="w-full p-2 hidden lg:flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
                <button onClick={() => setCurrentReport('ClientHistory')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-purple rounded text-sm p-2 cursor-pointer text-white font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Client History</button>
                <button onClick={() => setCurrentReport('CallTimes')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Call Times</button>
                <button onClick={() => setCurrentReport('CustomerCalls')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Customer Calls</button>
                <button onClick={() => setCurrentReport('CustomerErrors')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Customer Errors</button>
                <button onClick={() => setCurrentReport('EmployeeTasks')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Employee Tasks</button>
                <button onClick={() => setCurrentReport('EmployeeAvg')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Employee Average Time</button>
                <button onClick={() => setCurrentReport('EmployeeSummary')} className="whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow bg-white rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none">Employee Summary</button>
            </div>
            {currentReport === 'ClientHistory' && (
                <>
            <div className="w-full lg:flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2 text-black">
                    <label>Start Date:</label>
                    <input type="datetime-local" name="starttime" value={clHistoryStartTime} onChange={(e) => setCLHistoryStartTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col p-2 text-black">
                    <label>End Date:</label>
                    <input type="datetime-local" name="endtime" value={clHistoryEndTime} onChange={(e) => setCLHistoryEndTime(e.target.value)} className="p-3 w-full border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col mt-5">
                    <button onClick={ filterClientHistoryReport } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Filter
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            {clientHistoryLog?.map(({ id, customer, activity, starttime, endtime, duration, issueType }, index) => (
                <div key={id} className={` bg-white text-black p-2 mt-2 mx-2 rounded flex items-center justify-between divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{id}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center p-2">{customer}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{activity}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{starttime}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{new Date(endtime.slice(0, 19).replace('T', ' ')).toLocaleString()}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{duration}</p>
                    <p className={`text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center ${issueType === 'Task' ? 'text-green' : 'text-red'}`}>{issueType || '--:--'}</p>
                </div>
            ))}
        </>
        )}
        {currentReport === 'CallTimes' && (<CustomerCallTimesReport />)}
        {currentReport === 'CustomerCalls' && (<CustomerCallsReport />)}
        {currentReport === 'CustomerErrors' && (<CustomerErrorsReport />)}
        {currentReport === 'EmployeeTasks' && (<EmployeeTaskReport />)}
        {currentReport === 'EmployeeAvg' && (<EmployeeAvgReport />)}
        {currentReport === 'EmployeeSummary' && (<EmployeeSummaryReport />)}
        </div>
        </>
    )
}
'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";

import { BarChartComponent } from "../../components/component/EmployeeBarChart";
import { CustomerErrorComponent } from "../../components/component/customerErrorBarChart";
import { CustomerCallsComponent } from "../../components/component/customerCallsBarChart";
import { EmployeeTaskComponent } from "../../components/component/employeeTaskChart";

import { ErrorChartComponent } from "../../components/component/error-chart-component";

import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";
import axios from 'axios';
import { Button } from "@/components/ui/button";

//EmployeeChart
interface EmployeeProps {
    name: string,
    Tasks: number,
    Errors: number,
    Overall: number,
    AverageTime: number
}
export type EmployeeResponse = EmployeeProps[]

//CustomersChart
interface CustomerErrorProps {
    Customer: string,
    Error: string,
    ErrorCount: number
}
export type CustomerResponse = CustomerErrorProps[]


//ClientGrid 
interface ClientGridProps {
    TotalClientsCount: number,
    ClientEliteCount: number,
    ClientBasicCount: number,
    ClientNoSupportPackCount: number
}
type ClientGridResponse = ClientGridProps[]


//ErrorsGrid 
interface ErrorsGridProps {
    Activity: string,
    CommonErrors: number
}
type ErrorsGridResponse = ErrorsGridProps[]


//TasksGrid 
interface TasksGridProps {
    Activity: string,
    CommonTasks: number
}
type TasksGridResponse = TasksGridProps[]

//TicketSummary Grid
interface TicketSummaryProps {
    CurrentActiveTickets: number,
    CurrentLoggedTickets: number,
    TasksCompleted: number,
    ErrorsCompleted: number,
    OvrTicketsCompleted: number
}
type TicketSummaryResponse = TicketSummaryProps[]

//CustomerCallsChart
interface CustomerCallsProps {
    Customer: string,
    CallCount: number
}
export type CustomerCallsResponse = CustomerCallsProps[]

interface EmployeeTasksProps {
    Employee: string,
    Task: string,
    TasksCount: number
}
export type EmployeeTasksResponse = EmployeeTasksProps[]

export const DashboardModule = () => {
    //EmployeeBarChart
    const [starttime, setStartTime] = useState('2024-05-30 14:29:33');
    const [endtime, setEndTime] = useState('2024-06-11 09:25:26');
    const [employeeData, setEmployeeData] = useState<EmployeeResponse>([]);

    //employeeErrorState
    const [employeeSumErrorState, setEmployeeSumErrorState] = useState(false);
    const [customerErrorState, setCustomerErrorState] = useState(false);
    const [employeeTaskErrorState, setEmployeeTaskErrorState] = useState(false);
    const [customerCallsErrorState, setCustomerCallsErrorState] = useState(false);
    

    //CustomersBarChart
    const [customerStartTime, setCustomerStartTime] = useState('2024-06-01 08:00:17');
    const [customerEndTime, setCustomerEndTime] = useState('2024-06-18 08:00:00');
    const [customerCallStartTime, setCustomerCallStartTime] =useState('2024-06-03 08:00:17');
    const [customerCallEndTime, setCustomerCallEndTime] = useState('2024-06-18 16:07:01');
    const [employeeTaskStartTime, setEmployeeTaskStartTime] = useState('2024-06-01 08:00:17');
    const [employeeTaskEndTime, setEmployeeTaskEndTime] = useState('2024-06-18 16:07:01');

    const [customerData, setCustomerData] = useState<CustomerResponse>([]);
    const [clientGridData, setClientGridData] = useState<ClientGridResponse>([]);
    const [errorsGridData, setErrorsGridData] = useState<ErrorsGridResponse>([]);
    const [tasksGridData, setTasksGridData] = useState<TasksGridResponse>([]);
    const [ticketSummaryGridData, setTicketSummaryGridData] = useState<TicketSummaryResponse>([]);
    const [customerCallsData, setCustomerCallsData] = useState<CustomerCallsResponse>([]);
    const [employeeTasksData, setEmployeeTasksData] = useState<EmployeeTasksResponse>([]);

    //EMPLOYEEData - Chart
    const filterEmployeeBarChart = async () => {
        //http://localhost:4200/dashboard/getempsummary/2024-05-30 14:29:33/2024-06-11 09:25:26
        try {
            setEmployeeSumErrorState(false); // Reset the error state before fetching data
            const url = `dashboard/getempsummary/${starttime}/${endtime}`;
            const response = await axios.get<EmployeeResponse>(`${apiEndPoint}/${url}`);
            setEmployeeData(response?.data);

        } catch (error) {
            console.error('An error occurred while fetching reports:', error);
            setEmployeeSumErrorState(true); // Update the error state;
        }
    }

    //CUSTOMERSDATA - Chart
    const filterCustomerErrorsChart = async () => {
        try {
            setCustomerErrorState(false)
            const url = `dashboard/getcustomerdata/${customerStartTime}/${customerEndTime}`;
            const response = await axios.get<CustomerResponse>(`${apiEndPoint}/${url}`);
            setCustomerData(response?.data);

        } catch (error) {
            console.error('An error occurred while fetching reports:', error);
            setCustomerErrorState(true);
        }
    }

    const filterEmployeeTasksChart = async () => {
        try {
            setEmployeeTaskErrorState(false)
            const url = `dashboard/getemployeetasksdata/${employeeTaskStartTime}/${employeeTaskEndTime}`
            const response = await axios.get<EmployeeTasksResponse>(`${apiEndPoint}/${url}`);
            setEmployeeTasksData(response?.data)
        } catch (error) {
            console.error('An error occurred while Employee Tasks Data:', error);
            setEmployeeTaskErrorState(true)
        }
    }

    const filterCustomerCallChart = async () => {
        try {
            setCustomerCallsErrorState(false);
            const url = `dashboard/getcustomercalldata/${customerCallStartTime}/${customerCallEndTime}`
            const response = await axios.get<CustomerCallsResponse>(`${apiEndPoint}/${url}`);
            setCustomerCallsData(response?.data)

        } catch (error) {
            console.error('An error occurred while Customer Calls Data:', error);
            setCustomerCallsErrorState(true);
        }
    }

    //---- ---- FUNCTION TO GRAB DATA FOR GRIDS ---- ----
    const getClientGridData = async () => {
        try {
            //http://localhost:4200/dashboard/getclientdata
            const url = `dashboard/getclientsummary`;
            const response = await axios.get<ClientGridResponse>(`${apiEndPoint}/${url}`);
            setClientGridData(response?.data);

        } catch (error) {
            console.error('An error occurred while fetching reports:', error);
        }
    }

    const getErrorsGridData = async () => {
        try {
            //http://localhost:4200/dashboard/getcommonerrors
            const errorsurl = `dashboard/getcommonerrors`
            const response = await axios.get<ErrorsGridResponse>(`${apiEndPoint}/${errorsurl}`);
            setErrorsGridData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching Errors Grid Data:', error);
        }
    }

    const getTasksGridData = async () => {
        try {
            //http://localhost:4200/dashboard/getcommontasks
            const tasksurl = `dashboard/getcommontasks`
            const response = await axios.get<TasksGridResponse>(`${apiEndPoint}/${tasksurl}`);
            setTasksGridData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching Tasks Grid Data:', error);
        }
    }

    const getTicketSummGridData = async () => {
        try {
            const summaryurl = `dashboard/geticketsummary`
            const response = await axios.get<TicketSummaryResponse>(`${apiEndPoint}/${summaryurl}`);
            setTicketSummaryGridData(response?.data)

        } catch (error) {
            console.error('An error occurred while fetching Ticket Summary Grid Data:', error);
        }
    }


    useEffect(() => { 
        filterEmployeeBarChart();
        filterCustomerErrorsChart();
        filterCustomerCallChart();
        getClientGridData();
        getErrorsGridData();
        getTasksGridData();
        getTicketSummGridData();
        filterEmployeeTasksChart();
    }, [])


    return (
        <section className="bg-grey w-full h-screen overflow-y-scroll p-2 flex flex-col justify-start space-y-2">
            <div className="grid grid-cols-4 gap-5 mt-3">
                <div className="text-gray-800 flex flex-col justify-around p-2 rounded bg-white shadow">
                    <div className="flex items-center justify-between">
                        <h3>Clients</h3>
                        <UserRound size={40} color='green' strokeWidth={1.2} />
                    </div>
                    {clientGridData.map((client, index) => (
                    <div key={index} className="uppercase">
                        <div className="flex justify-between">
                            <p>Total Clients:</p>
                            <p>{client.TotalClientsCount}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Clients On Elite Package:</p>
                            <p>{client.ClientEliteCount}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Clients on Basic Package:</p>
                            <p>{client.ClientBasicCount}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Clients with no Support:</p>
                            <p>{client.ClientNoSupportPackCount}</p>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="text-gray-800 flex flex-col justify-around p-2 rounded bg-white shadow">
                    <div className="flex items-center justify-between">
                        <h3>Common Client Errors</h3>
                        <TicketX size={40} color='red' strokeWidth={1.2} />
                    </div>
                    {errorsGridData.map((error, index) => (
                    <div className="mt-4 flex justify-between uppercase">
                        <p>{error.Activity}</p>
                        <p>{error.CommonErrors}</p>
                    </div>
                    ))}
                </div>
                <div className="text-gray-800 flex flex-col justify-around p-2 rounded bg-white shadow">
                    <div className="flex items-center justify-between">
                        <h3>Common Tasks</h3>
                        <ClipboardCheck size={40} color='blue' strokeWidth={1.2} />
                    </div>
                    {tasksGridData.map((task, index) => (
                    <div className="mt-4 flex justify-between">
                        <p>{task.Activity}</p>
                        <p>{task.CommonTasks}</p>
                    </div>
                    ))}
                </div>
                <div className="text-gray-800 flex flex-col justify-around p-2 rounded bg-white shadow">
                    <div className="flex items-center justify-between">
                        <h3>Ticket Summary</h3>
                        <AlignCenterVertical size={40} color='purple' strokeWidth={1.2} />
                    </div>
                    {ticketSummaryGridData.map((summary, index) => (
                    <div key={index} className="uppercase">
                        <div className="flex justify-between">
                            <p>Active Tickets</p>
                            <p>{summary.CurrentActiveTickets}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Logged Tickets</p>
                            <p>{summary.CurrentLoggedTickets}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Completed Tasks</p>
                            <p>{summary.TasksCompleted}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Completed Client Errors</p>
                            <p>{summary.ErrorsCompleted}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p>Total Completed Tickets</p>
                            <p>{summary.OvrTicketsCompleted}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[600px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Tickets Per Employee <span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="empstarttime" onChange={(e) => setStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="empendtime" onChange={(e) => setEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterEmployeeBarChart } className="flex justify-start bg-purple py-4 px-2 w-30 h-18 mr-8 lg:h-19 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 hover:bg-white text-white hover:text-purple border border-purple cursor-pointer rounded">
                                <span>Filter</span>
                                <Filter className="h-4 w-4 mt-1" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {employeeSumErrorState? (
                        <ErrorChartComponent />
                    ) : (
                        <BarChartComponent employeeData={employeeData} />
                    )}
                    </div>
                    <div className="w-full items-center justify-center">
                        <p className='text-center text-gray-500 font-medium uppercase text-sm'>Legend Chart</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[450px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Errors Per Customer <span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setCustomerStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setCustomerEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterCustomerErrorsChart } className="flex justify-start bg-purple py-4 px-2 w-24 h-18 mr-8 lg:h-19 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2  hover:bg-white text-white hover:text-purple border border-purple cursor-pointer rounded">
                                <span>Filter</span>
                                <Filter className="h-4 w-4 mt-1" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {customerErrorState? (
                        <ErrorChartComponent />
                    ) : (
                        <CustomerErrorComponent customerData={customerData} />
                    )}
                    </div>
                    <div className="w-full items-center justify-center">
                        <p className='text-center text-gray-500 font-medium uppercase text-sm'>Legend Chart</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[450px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Common Tasks Completed <span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setEmployeeTaskStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setEmployeeTaskEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterEmployeeTasksChart } className="flex justify-start bg-purple py-4 px-2 w-24 h-18 mr-8 lg:h-19 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2  hover:bg-white text-white hover:text-purple border border-purple cursor-pointer rounded">
                                <span>Filter</span>
                                <Filter className="h-4 w-4 mt-1" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {employeeTaskErrorState? (
                        <ErrorChartComponent />
                    ) : (
                        <EmployeeTaskComponent employeeTasksData={employeeTasksData} />
                    )}
                    </div>
                    <div className="w-full items-center justify-center">
                        <p className='text-center text-gray-500 font-medium uppercase text-sm'>Legend Chart</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[450px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Customer Calls <span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setCustomerCallStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setCustomerCallEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterCustomerCallChart } className="flex justify-start bg-purple py-4 px-2 w-24 h-18 mr-8 lg:h-19 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2  hover:bg-white text-white hover:text-purple border border-purple cursor-pointer rounded">
                                <span>Filter</span>
                                <Filter className="h-4 w-4 mt-1" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {customerCallsErrorState? (
                        <ErrorChartComponent />
                    ) : (
                        <CustomerCallsComponent customerCallsData={customerCallsData} />
                    )}
                    </div>
                    <div className="w-full items-center justify-center">
                        <p className='text-center text-gray-500 font-medium uppercase text-sm'>Legend Chart</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
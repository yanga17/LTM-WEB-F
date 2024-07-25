'use client'

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import { BarChartComponent } from "../../components/component/EmployeeBarChart";
import { CustomerErrorComponent } from "../../components/component/customerErrorBarChart";
import { CustomerCallsComponent } from "../../components/component/customerCallsBarChart";
import { EmployeeTaskComponent } from "../../components/component/employeeTaskChart";
import { ErrorChartComponent, EmptyChartComponent } from "../../components/component/error-chart-component";
import { Filter, XIcon  } from "lucide-react";
import { SummaryPieChart } from "@/components/component/ticketSummary-pie-chart";
import { ClientsPieChart } from "@/components/component/clients-pie-chart";
import { TasksPieChart } from "@/components/component/tasks-pie-chart";
import { ErrorsPieChart } from "@/components/component/errors-pie-chart";
import { EmployeeWeeklyChart } from "@/components/component/employee-tickets-chart";

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
    ClientNoSupportPackCount: number,
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
    OvrTicketsCompleted: number,
    CompletedFollowUps: number
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

//employeeWeeklyBarChart
interface EmployeeWeeklyProps {
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
export type EmployeeWeeklyResponse = EmployeeWeeklyProps[]

//getAllEmployees - dropdownm
interface AllEmployeeProps {
    ID: number;
    Technician: string;
}
type AllEmployeeResponse = AllEmployeeProps[]

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
    const [employeeWeeklyErrorState, setEmployeeWeeklyErrorState] = useState(false);

    const [employeeEmptyChart, setEmployeeEmptyChart] = useState(false);

    //CustomersBarChart
    const [customerStartTime, setCustomerStartTime] = useState('2024-06-01 08:00:17');
    const [customerEndTime, setCustomerEndTime] = useState('2024-06-18 08:00:00');
    const [customerCallStartTime, setCustomerCallStartTime] =useState('2024-06-03 08:00:17');
    const [customerCallEndTime, setCustomerCallEndTime] = useState('2024-06-18 16:07:01');
    const [employeeTaskStartTime, setEmployeeTaskStartTime] = useState('2024-06-01 08:00:17');
    const [employeeTaskEndTime, setEmployeeTaskEndTime] = useState('2024-06-18 16:07:01');
    const [employeeWeeklyStartTime, setEmployeeWeeklyStartTime] =useState('2024-06-03 08:00:17');
    const [employeeWeeklyEndTime, setEmployeeWeeklyEndTime] = useState('2024-06-18 16:07:01');
    const [employee, setEmployee] = useState("");

    const [customerData, setCustomerData] = useState<CustomerResponse>([]);
    const [clientGridData, setClientGridData] = useState<ClientGridResponse>([]);
    const [errorsGridData, setErrorsGridData] = useState<ErrorsGridResponse>([]);
    const [tasksGridData, setTasksGridData] = useState<TasksGridResponse>([]);
    const [ticketSummaryGridData, setTicketSummaryGridData] = useState<TicketSummaryResponse>([]);
    const [customerCallsData, setCustomerCallsData] = useState<CustomerCallsResponse>([]);
    const [employeeTasksData, setEmployeeTasksData] = useState<EmployeeTasksResponse>([]);
    const [employeeWeeklyData, setEmployeeWeeklyData] = useState<EmployeeWeeklyResponse>([]);

    const [allEmployees, setAllEmployees] = useState<AllEmployeeResponse>([]);
    //const [filteredData, setFilteredData] = useState<EmployeeAvgResponse>([]);

    //EMPLOYEEData - Chart
    const filterEmployeeBarChart = async () => {
        try {
            setEmployeeSumErrorState(false);
            const url = `dashboard/getempsummary/${starttime}/${endtime}`;
            const response = await axios.get<EmployeeResponse>(`${apiEndPoint}/${url}`);
            setEmployeeData(response?.data);

            if (response.data.length === 0) {
                setEmployeeEmptyChart(true);
            }
            
        } catch (error) {
            console.error('An error occurred while fetching reports:', error);
            setEmployeeSumErrorState(true);
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
            const url = `dashboard/getclientsummary`;
            const response = await axios.get<ClientGridResponse>(`${apiEndPoint}/${url}`);
            setClientGridData(response?.data);

        } catch (error) {
            console.error('An error occurred while fetching reports:', error);
        }
    }

    const getErrorsGridData = async () => {
        try {
            const errorsurl = `dashboard/getcommonerrors`
            const response = await axios.get<ErrorsGridResponse>(`${apiEndPoint}/${errorsurl}`);
            setErrorsGridData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching Errors Grid Data:', error);
        }
    }

    const getTasksGridData = async () => {
        try {
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

    const generateEmployees = async () => {
        try {
            const url = `dashboard/getemployees`
            const response = await axios.get<AllEmployeeResponse>(`${apiEndPoint}/${url}`);
            setAllEmployees(response.data)

            } catch (error) {
                console.error('An error occurred while getting employees:', error);
        }
    }

    const getEmployeeWeeklyData = async () => {
        //http://localhost:4200/dashboard/getemployeeweeklydata/2024-07-10 06:48:55/2024-07-12 07:12:35
        try {
            setEmployeeWeeklyErrorState(false);
            const url = `dashboard/getemployeeweeklydata/${employeeWeeklyStartTime}/${employeeWeeklyEndTime}`
            const response = await axios.get<EmployeeWeeklyResponse>(`${apiEndPoint}/${url}`);
            //setEmployeeWeeklyData(response?.data)
            const fetchedData = response.data;

            if (employee) {
                const filteredByEmployee = fetchedData.filter((item) => item.Employee === employee);
                setEmployeeWeeklyData(filteredByEmployee);
            } else {
                setEmployeeWeeklyData(fetchedData);
            }

        } catch (error) {
            console.error('An error occurred while getting the Employee Weekly Data:', error);
            setEmployeeWeeklyErrorState(true);
            noDataNotification();
        }
    }

    const noDataNotification = () => {
        toast.error('There is not data available between the selected date periods!', {
            icon: <XIcon color={colors.red} size={24} />,
            duration: 3000,
        });
    }


    useEffect(() => { 
        filterEmployeeBarChart();
        filterCustomerErrorsChart();
        filterCustomerCallChart();
        filterEmployeeTasksChart();
        getClientGridData();
        getErrorsGridData();
        getTasksGridData();
        getTicketSummGridData();
        getEmployeeWeeklyData();
        generateEmployees();
    }, []);


    return (
        <section className="pg-background w-full h-full overflow-y-scroll p-2 flex flex-col justify-start space-y-2">
            <div className="grid grid-cols-4 gap-5">
                <div>
                    <SummaryPieChart />
                </div>
                <div>
                    <ErrorsPieChart />
                </div>
                <div>
                    <TasksPieChart />
                </div>
                <div>
                    <ClientsPieChart />
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[600px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Tickets Per Employee <span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2 mr-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="empstarttime" onChange={(e) => setStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="empendtime" onChange={(e) => setEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterEmployeeBarChart } className="flex justify-start bg-purple text-white hover:bg-black hover:text-white py-4 px-2 w-24 h-12 mr-8 lg:h-12 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 cursor-pointer rounded">
                                {/* <span >Filter</span> */}
                                <Filter size={22} strokeWidth={2} className="ml-5" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {employeeData.length === 0 ? (
                            <EmptyChartComponent />
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
                        <div className="flex items-center gap-2 mr-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setCustomerStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setCustomerEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterCustomerErrorsChart } className="flex justify-start bg-purple text-white hover:bg-black hover:text-white py-4 px-2 w-24 h-12 mr-8 lg:h-12 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 cursor-pointer rounded">
                                {/* <span >Filter</span> */}
                                <Filter size={22} strokeWidth={2} className="ml-5" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {customerData.length === 0 ? (
                            <EmptyChartComponent />
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
                        <p className="text-gray-500 font-medium uppercase text-md">No. Common Tasks Completed<span className="text-xs text-gray-500">(s)</span></p>
                        <div className="flex items-center gap-2 mr-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setEmployeeTaskStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setEmployeeTaskEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterEmployeeTasksChart } className="flex justify-start bg-purple text-white hover:bg-black hover:text-white py-4 px-2 w-24 h-12 mr-8 lg:h-12 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 cursor-pointer rounded">
                                {/* <span >Filter</span> */}
                                <Filter size={22} strokeWidth={2} className="ml-5" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {employeeTasksData.length === 0 ? (
                            <EmptyChartComponent />
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
                        <div className="flex items-center gap-2 mr-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setCustomerCallStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setCustomerCallEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <button onClick={ filterCustomerCallChart } className="flex justify-start bg-purple text-white hover:bg-black hover:text-white py-4 px-2 w-24 h-12 mr-8 lg:h-12 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 cursor-pointer rounded">
                                {/* <span >Filter</span> */}
                                <Filter size={22} strokeWidth={2} className="ml-5" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {customerCallsData.length === 0 ? (
                            <EmptyChartComponent />
                        ) : (
                            <CustomerCallsComponent customerCallsData={customerCallsData} />
                    )}
                    </div>
                    <div className="w-full items-center justify-center">
                        <p className='text-center text-gray-500 font-medium uppercase text-sm'>Legend Chart</p>
                    </div>
                </div>
            </div>
            {/* new chart */}
            <div className="flex flex-col justify-start space-y-2">
                <div className="w-full rounded p-2 shadow h-[450px] bg-white flex items-start justify-between flex-col">
                    <div className="flex items-center justify-between w-full h-[15%]">
                        <p className="text-gray-500 font-medium uppercase text-md">No. Tickets Per Employee <span className="text-xs text-gray-500">(weekly)</span></p>
                        <div className="flex items-center gap-2 mr-2">
                            <label className="mr-2">Start Date</label>
                            <input type="datetime-local" name="starttime" onChange={(e) => setEmployeeWeeklyStartTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left mr-4" />
                            <label className="mr-2">End Date</label>
                            <input type="datetime-local" name="endtime" onChange={(e) => setEmployeeWeeklyEndTime(e.target.value)} className="p-3 border rounded text-black outline-none md:cursor-pointer placeholder:text-sm placeholder-italic text-left" />
                            <div className="w-36 sm:w-32 md:w-40 lg:w-44 xl:w-48 flex flex-col text-gray-500 rounded">
                                <select 
                                    className='p-3 ml-2 border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic'
                                    value={employee}
                                    onChange={(e) => setEmployee(e.target.value)}
                                >
                                    <option value="" className="text-gray-500">All</option>
                                        {allEmployees?.map(({ ID, Technician }) =>
                                            <option key={ID} value={Technician}>{Technician}</option>
                                        )}
                                </select>
                            </div>
                            <button onClick={ getEmployeeWeeklyData } className="flex justify-start bg-purple text-white hover:bg-black hover:text-white py-4 px-2 w-24 h-12 mr-8 lg:h-12 lg:px-4 lg:py-4 lg:mr-8 gap-2 ml-2 cursor-pointer rounded">
                                {/* <span >Filter</span> */}
                                <Filter size={22} strokeWidth={2} className="ml-5" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center justify-center h-[95%]">
                    {employeeWeeklyData.length === 0 ? (
                            <EmptyChartComponent />
                        ) : (
                            <EmployeeWeeklyChart weeklyData={employeeWeeklyData} />
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
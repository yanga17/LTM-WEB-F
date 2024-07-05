'use client'

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";

import { CustomerCallsReport } from './customerCallsReport';
import { CustomerErrorsReport } from './customerErrorsReport';
import { EmployeeTaskReport } from './employeeTasksReport'
import { EmployeeAvgReport } from './employeeAvgReport';
import { EmployeeSummaryReport } from './employeeSummaryReport';
import { CustomerCallTimesReport } from './customerCallTimesReport'

import { CallHistoryPDF } from '../../components/component/customerCallHistoryPDF'
import { Button } from "@/components/ui/button"
import { Expand } from "lucide-react";
import { PDFViewer } from '@react-pdf/renderer';
import { X } from "lucide-react";


interface CallHistoryProps {
    ID: number,
    Customer: string,
    Activity: string,
    Support_No: string,
    StartTime: string,
    EndTime: string,
    Duration: string,
    Comments: string,
    Phone_Number: number,
    Solution: string,
    IssueType: string,
    Employee: string,
    Type: string,
    name: string
}
export type CallHistoryResponse = CallHistoryProps[]

//getAll Customers
interface CustomerProps {
    uid: number;
    Customer: any;
}
type CustomerType = CustomerProps[]

export const ReportsContext = createContext<CallHistoryProps | null>(null)

export const ReportsModule = () => {
    const [clHistoryStartTime, setCLHistoryStartTime] = useState('');
    const [clHistoryEndTime, setCLHistoryEndTime] = useState('');
    const [currentReport, setCurrentReport] = useState('CallHistory');

    const [data, setData] = useState<CallHistoryResponse>([]);
    const [allCustomers, setAllCustomers] = useState<CustomerType>([]);

    const [customer, setCustomer] = useState('')
    const [filteredData, setFilteredData] = useState<CallHistoryResponse>([]);

    const headers = ['Call ID', 'Customer', 'Activity', 'Start Time', 'End Time', 'Duration', 'Issue Type', 'Action']
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [reportDetail, setReportDetail] = useState<CallHistoryProps | null>(null);
    const [currentOpen, setCurrentOpen] = useState('');
    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });

    const splitCustomerName = (customerName: string) => {
        return customerName.split(',')[0].trim().toLocaleLowerCase();
    };

    const filterCallHistoryReport = async () => {
        try {
            const url = `reports/getclienthistorydata/${clHistoryStartTime}/${clHistoryEndTime}`
            const response = await axios.get<CallHistoryResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;

            if (fetchedData.length === 0) {
                toast.error('There is no available data between the selected date periods!', {
                    icon: <X color={colors.red} size={24} />,
                    duration: 3000,
                });
                return;
            }

            const filtered = customer 
                ? fetchedData.filter(item => splitCustomerName(item.Customer) === splitCustomerName(customer)) 
                : fetchedData;
                
                if (filtered.length === 0) {
                    toast.error('No data was found for the selected customer between the date periods!', {
                        duration: 3000,
                    });
                }
        
                setFilteredData(filtered);
        } catch (error) {
            console.error('An error occurred while fetching the Client History Reports:', error);
            filterNotification();
        }
    }

    const generateCustomers = async () => {
        try {
          const url = `tickets/getcustomers`
          const response = await axios.get<CustomerType>(`${apiEndPoint}/${url}`);
      
          setAllCustomers(response.data)
      
          if (response.data.length === 0) {
            toast.error(`No data available for legend clients.`, {
              icon: '❌',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
      
        }} catch (error) {
      
          console.error('An error occurred while fetching clients:', error);
          
        }
    }

    const viewNotification = () => {
        toast.error('Please generate the report before viewing the PDF File!', {
            icon: <X color={colors.red} size={24} />,
            duration: 3000,
        })
    }

    const filterNotification = () => {
        toast.error('Please select dates before generating the report!', {
            icon: <X color={colors.red} size={24} />,
            duration: 3000,
        })
    }

    const viewPDF = () => {
        if (filteredData.length === 0) {
            viewNotification();
        } else {
            setIsModalOpen(true);
        }
    };

    const openReport = (id: any) => {
        if (currentOpen === id) {
            setCurrentOpen('');
            setState({ ...state, isOpen: false, expandView: null });

        } else {
            setCurrentOpen(id);
            setState({ ...state, isOpen: true, expandView: id});

            const selectedTicket = filteredData?.find(client => client.ID === id || null);

            if (selectedTicket) {
                setReportDetail(selectedTicket);
            }
  
            console.log('Customer Call History ID:', selectedTicket);
        }
    }

    const closeReport = () => {
        setState({...state, isOpen: false, expandView: null });
        setCurrentOpen('');
    }

    useEffect(() => {
        generateCustomers();
    }, [])


    
    return (
        <>
            <ReportsContext.Provider value={reportDetail}>
            {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className='relative w-[800px]'>
                    <button className="absolute top-0 right-0 p-2 h-25 w-25 text-red" onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </button>
                    <PDFViewer width="100%" height="600">
                        <CallHistoryPDF data={filteredData} starttime={clHistoryStartTime} endtime={clHistoryEndTime} />
                    </PDFViewer>
                </div>
            </div>
        )}
        <div className="h-screen overflow-auto">
            <div className="w-full p-2 hidden lg:flex items-center justify-center md:justify-start gap-2 md:gap-4 flex-wrap">
                <button onClick={() => setCurrentReport('CallHistory')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CallHistory'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Call History</button>
                <button onClick={() => setCurrentReport('CallTimes')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CallTimes'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Call Times</button>
                <button onClick={() => setCurrentReport('CustomerCalls')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CustomerCalls'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Customer Calls</button>
                <button onClick={() => setCurrentReport('CustomerErrors')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CustomerErrors'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Customer Errors</button>
                <button onClick={() => setCurrentReport('EmployeeTasks')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeTasks'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Tasks</button>
                <button onClick={() => setCurrentReport('EmployeeAvg')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeAvg'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Average Time</button>
                <button onClick={() => setCurrentReport('EmployeeSummary')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeSummary'? 'bg-purple' : 'bg-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Summary</button>
            </div>
            {currentReport === 'CallHistory' && (
                <>
            <div className="w-full flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2 text-black">
                    <label>Start Date:</label>
                    <input type="datetime-local" name="starttime" value={clHistoryStartTime} onChange={(e) => setCLHistoryStartTime(e.target.value)} className="p-3 w-full border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col p-2 text-black">
                    <label>End Date:</label>
                    <input type="datetime-local" name="endtime" value={clHistoryEndTime} onChange={(e) => setCLHistoryEndTime(e.target.value)} className="p-3 w-full border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="mt-6 w-56 sm:w-52 md:w-60 lg:w-64 flex flex-col text-gray-500 rounded">
                <select 
                    className='p-3 border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic'
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    >
                    <option value="" className="text-black">All</option>
                        {allCustomers?.map(({ uid, Customer }) =>
                        <option key={uid} value={Customer}>{Customer}</option>
                    )}
                </select>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-4 mt-6 mr-2">
                    <div className="flex flex-col">
                        <button onClick={ filterCallHistoryReport } className="bg-purple hover:bg-black hover:text-white border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                            Filter
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={ viewPDF } className="bg-purple hover:bg-black hover:text-white border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                            View PDF
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            {filteredData?.map(({ ID, Customer, Activity, Support_No, StartTime, EndTime, Duration, Comments, Phone_Number, Solution, IssueType, Employee, Type, name }, index) => (
                <div>
                    <div key={ID} className={`bg-white text-black p-4 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''} h-20`}>
                        <p className="text-sm text-purple font-medium w-1/4 lg:w-1/4 text-center uppercase">{ID}</p>
                        <p className="text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center uppercase">{Customer}</p>
                        <p className="text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center break-words truncate uppercase">{Activity}</p>
                        <p className="text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center uppercase">{new Date(StartTime.slice(0, 19).replace('T', ' ')).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center uppercase">{new Date(EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center uppercase">{Duration}</p>
                        <p className={`text-sm text-gray-500 font-medium w-1/4 lg:w-1/4 text-center uppercase ${IssueType === 'Task' ? 'text-green' : 'text-red'}`}>{IssueType}</p>
                        <Expand onClick={() => { openReport(ID)}} className="text-sm text-purple font-medium w-1/4 lg:w-1/4 text-center hover:cursor-pointer z-10" />
                    </div>
                    <div>
                        <div className={`w-full p-4 mr-2 mt-2 mx-2 rounded bg-white text-black ${state.isOpen && state.expandView === ID? 'block' : 'hidden'}`}>
                            <div className="flex flex-wrap">
                                <div className="w-1/3">
                                    <div>
                                        <p className="font-medium text-gray-500 text-md">Call ID</p>
                                        <p className="font-semibold text-md">{ID || '--:--'}</p>
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <p className="font-medium text-gray-500 text-md">Employee</p>
                                        <p className="font-semibold text-md uppercase">{Employee || '--:--'}</p>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-medium text-gray-500 text-md">Support No</p>
                                        <p>{Support_No || '--:--'}</p>
                                    </div>
                                    <div className='mt-4'>
                                        <p className="font-medium text-gray-500 text-md">IssueType</p>
                                        <p className={`font-medium text-gray-500 text-md ${IssueType === 'Task' ? 'text-green' : 'text-red'}`}>{IssueType || '--:--'}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-medium text-gray-500 text-md">Solution</p>
                                        <p className="font-semibold text-md">{Solution || '--:--'}</p>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Customer</p>
                                        <p className="font-semibold text-md">{Customer || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Problem</p>
                                        <p className="font-semibold text-md">{Activity || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Start Time</p>
                                        <p>{new Date(StartTime.slice(0, 19).replace('T', ' ')).toLocaleString()  || '--:--'}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500 text-md">End Time</p>
                                        <p>{new Date(EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString()  || '--:--'}</p>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Client Name</p>
                                        <p className="font-semibold text-md">{name  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <p className="font-medium text-gray-500 text-md">Phone Number</p>
                                        <p className="font-semibold text-md">{Phone_Number  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Comments</p>
                                        <p className="font-semibold text-md">{Comments  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-500 text-md">Duration</p>
                                        <p className="font-semibold text-md">{Duration  || '--:--'}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-5 gap-4">
                                    <Button onClick={ closeReport } className="mr-2 bg-red">Close</Button>
                                </div>
                            </div>
                        </div>
                    </div>
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
            </ReportsContext.Provider>
        </>
    )
}
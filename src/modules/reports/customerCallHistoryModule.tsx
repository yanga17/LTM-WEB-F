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
import { X, Minimize2, Check, FileText, Filter } from "lucide-react";

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
    Surname: string,
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

//getAllEmployees
interface EmployeeProps {
    ID: number;
    Technician: string;
}
type EmployeeType = EmployeeProps[]

export const ReportsContext = createContext<CallHistoryProps | null>(null)

export const ReportsModule = () => {
    const [clHistoryStartTime, setCLHistoryStartTime] = useState('');
    const [clHistoryEndTime, setCLHistoryEndTime] = useState('');
    const [currentReport, setCurrentReport] = useState('CallHistory');

    const [data, setData] = useState<CallHistoryResponse>([]);
    const [allCustomers, setAllCustomers] = useState<CustomerType>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);

    const [customer, setCustomer] = useState('')
    const [employee, setEmployee] = useState('');
    const [filteredData, setFilteredData] = useState<CallHistoryResponse>([]);

    const headers = ['Call ID', 'Customer', 'Activity', 'Start Time', 'End Time', 'Duration', 'Issue Type', 'Action']
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [reportDetail, setReportDetail] = useState<CallHistoryProps | null>(null);
    const [currentOpen, setCurrentOpen] = useState('');
    const [state, setState] = useState({
        isOpen: true,
        expandView: null
    });

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const filterCallHistoryReportEmp = async () => {
        try {
            //http://localhost:4200/reports/getclienthistorydata/Thu Aug 15 2024 18:49:34/Fri Aug 23 2024 16:19:50
            const newStartTime = new Date(clHistoryStartTime); //change to required format
            const newEndTime = new Date(clHistoryEndTime);

            const url = `reports/getclienthistorydata/${newStartTime}/${newEndTime}`
            const response = await axios.get<CallHistoryResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;
            console.log("url: " + url);

            if (!Array.isArray(fetchedData)) {
                throw new Error('Fetched data is not an array');
            }

            if (fetchedData.length === 0) {
                toast.error('No data was found for the selected employee between the date periods!', {
                    duration: 3000,
                });
                return;
            }

             // Split the customer name by comma and take the first part
            const customerName = customer ? customer.split(',')[0].trim() : '';
            const employeeName = employee ? employee.trim() : '';

            // Filter data based on both customer and employee
            const filtered = fetchedData.filter(item => {
                const customerMatch = customerName ? item.Customer.split(',')[0].trim() === customerName : true;
                const employeeMatch = employeeName ? item.Employee.trim() === employeeName : true;
                return customerMatch && employeeMatch;
            });

            if (filtered.length === 0) {
                toast.error('No data was found for the selected customer and employee between the date periods!', {
                    duration: 3000,
                });
            }
        
                setFilteredData(filtered);
                filterEmployeeNotification();
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

    const generateEmployees = async () => {
        try {
          const url = `tickets/getemployees`
          const response = await axios.get<EmployeeType>(`${apiEndPoint}/${url}`);
      
          setAllEmployees(response.data)
      
          if (response.data.length === 0) {
            toast.error(`No data available for problem types.`, {
              icon: '❌',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
      
        }} catch (error) {
      
          console.error('An error occurred while problem types:', error);
          
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

    const filterEmployeeNotification = () => {
        if (filteredData.length === 0) {
            // Do not throw any notification if filteredData is empty
            return;
        }
        
        if (employee === "") {
            toast.success('The report has been filtered!', {
                icon: <Check color={colors.green} size={24} />,
                duration: 3000,
            })
            return;
        } else {
            toast.success(`The report has been filtered based on ${employee}!`, {
                icon: <Check color={colors.green} size={24} />,
                duration: 3000,
            })
        }
    }

    const viewPDF = () => {
        console.log("filteredData in viewPDF:", filteredData); // Add this line for debugging
    
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
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

    const handleCustomerSelect = (customerID: string) => {
        setCustomer(customerID);
        // Implement any additional logic if needed when a customer is selected
    };

    useEffect(() => {
        generateCustomers();
        generateEmployees();
    }, [])

    console.log("filtered data:", filteredData)

    
    return (
        <>
            <ReportsContext.Provider value={reportDetail}>
            {isModalOpen && (  
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className='relative w-[1000px]'>
                        <button className="absolute top-0 -right-2 p-2" onClick={() => setIsModalOpen(false)}>
                            <X size={24} strokeWidth={2} color='red'/>
                        </button>
                        <PDFViewer width="100%" height="600px">
                            <CallHistoryPDF data={filteredData} starttime={clHistoryStartTime} endtime={clHistoryEndTime} />
                        </PDFViewer>
                    </div>
                </div> 
            )}
        <div className="h-screen overflow-y-scroll report-background">
            <div className="w-full p-2 sm:flex justify-start md:gap-2 flex-wrap md:flex justify-start md:gap-4 flex-wrap lg:flex items-center justify-start dark:report-button">
                <button onClick={() => setCurrentReport('CallHistory')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CallHistory'? 'bg-purple text-white' : 'report-button dark:text-white'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Call History</button>
                <button onClick={() => setCurrentReport('CallTimes')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CallTimes'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Call Times</button>
                <button onClick={() => setCurrentReport('CustomerCalls')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CustomerCalls'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Customer Calls</button>
                <button onClick={() => setCurrentReport('CustomerErrors')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'CustomerErrors'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Customer Errors</button>
                <button onClick={() => setCurrentReport('EmployeeTasks')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeTasks'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Tasks</button>
                <button onClick={() => setCurrentReport('EmployeeAvg')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeAvg'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Average Time</button>
                <button onClick={() => setCurrentReport('EmployeeSummary')} className={`whitespace-nowrap w-10 lg:ease-in-out duration-500 shadow ${currentReport === 'EmployeeSummary'? 'bg-purple text-white' : 'report-button'} rounded text-sm p-2 cursor-pointer text-gray-500 font-medium hover:text-white hover:bg-purple lg:ease-in-out duration-300 w-44 outline-none`}>Employee Summary</button>
            </div>
            {currentReport === 'CallHistory' && (
                <>
            <div className="w-full flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2">
                    <label className="header-text">Start Date:</label>
                    <input type="datetime-local" name="starttime" value={clHistoryStartTime} onChange={(e) => setCLHistoryStartTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="flex flex-col p-2">
                    <label className="header-text">End Date:</label>
                    <input type="datetime-local" name="endtime" value={clHistoryEndTime} onChange={(e) => setCLHistoryEndTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="mt-6 flex gap-4 text-gray-500 rounded">
                <select 
                    className="select-input w-36 sm:w-32 md:w-40 lg:w-44 xl:w-48"
                    value={ customer }
                    onChange={(e) => setCustomer(e.target.value)}
                    >
                    <option value="" className="option-item rounded-lg">All</option>
                        {allCustomers?.map(({ uid, Customer }) =>
                        <option key={uid} value={Customer}>{Customer}</option>
                    )}
                </select>
                <select 
                    className="select-input w-36 sm:w-32 md:w-40 lg:w-44 xl:w-48"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    >
                    <option value="" className="option-item rounded-lg">All</option>
                        {allEmployees?.map(({ ID, Technician }) =>
                        <option key={ID} value={Technician}>{Technician}</option>
                    )}
                </select>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-4 mt-8 mr-2 sm:pl-2">
                    <div className="flex flex-col">
                        <button onClick={ filterCallHistoryReportEmp } className="start-call font-medium gap-1">
                            Filter
                            <Filter size={18} strokeWidth={2} />
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={ viewPDF } className="start-call font-medium gap-1">
                            View PDF
                            <FileText size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 report-header p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase report-text font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            {Array.isArray(filteredData) ? filteredData?.map(({ ID, Customer, Activity, Support_No, StartTime, EndTime, Duration, Comments, Phone_Number, Solution, IssueType, Employee, Surname, Type, name }, index) => (
                <div key={ID}>
                    <div className={`report-header report-text p-4 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''} h-20`}>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center uppercase text-purple">{ID || '--:--'}</p>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase">{Customer || '--:--'}</p>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase">{Activity || '--:--'}</p>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase">{StartTime ? `${(StartTime).toString().split(' ').slice(1, 5).join(' ')}`  : '--:--'}</p>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase">{EndTime ? `${(EndTime).toString().split(' ').slice(1, 5).join(' ')}`  : '--:--'}</p>
                        <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase">{Duration || '--:--'}</p>
                        <p className={`text-sm font-medium w-1/4 lg:w-1/4 text-center break-words line-clamp-1 uppercase ${IssueType === 'Task' ? 'text-green' : IssueType === 'Problem' ? 'text-red' : 'report-text'}`}>{IssueType || '--:--'}</p>
                        <Expand onClick={() => { openReport(ID)}} className="text-sm text-purple font-medium w-1/4 lg:w-1/4 text-center hover:cursor-pointer z-10" />
                    </div>
                    <div>
                        <div className={`w-full p-4 mr-2 mt-2 mx-2 rounded report-header text-black ${state.isOpen && state.expandView === ID? 'block' : 'hidden'}`}>
                            <div className="flex flex-wrap">
                                <div className="w-1/3">
                                    <div>
                                        <p className="font-medium reportdetail-headertext text-md">Call ID</p>
                                        <p className="font-semibold text-md text-purple">{ID || '--:--'}</p>
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <p className="font-medium reportdetail-headertext text-md">Employee Name</p>
                                        <p className="font-semibold text-md uppercase report-text">{Employee || '--:--'}</p>
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <p className="font-medium reportdetail-headertext text-md">Surname</p>
                                        <p className="font-semibold text-md uppercase report-text">{Surname || '--:--'}</p>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-medium reportdetail-headertext text-md">Support No</p>
                                        <p className="font-semibold text-md uppercase report-text">{Support_No || '--:--'}</p>
                                    </div>
                                    <div className='mt-4'>
                                        <p className="font-medium reportdetail-headertext text-md">IssueType</p>
                                        <p className={`font-semibold text-md uppercase ${IssueType === 'Task' ? 'text-green' : IssueType === 'Problem' ? 'text-red' : 'report-text'}`}>{IssueType || '--:--'}</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-medium reportdetail-headertext text-md">Solution</p>
                                        <p className="font-semibold text-md uppercase report-text">{Solution || '--:--'}</p>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Customer</p>
                                        <p className="font-semibold text-md uppercase report-text">{Customer || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Problem</p>
                                        <p className="font-semibold text-md uppercase report-text">{Activity || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Start Time</p>
                                        <p className="font-semibold text-md uppercase report-text">{StartTime ? `${new Date(StartTime).toString().split(' ').slice(1, 5).join(' ')}`  : '--:--'}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium reportdetail-headertext text-md">End Time</p>
                                        <p className="font-semibold text-md uppercase report-text">{EndTime ? `${new Date(EndTime).toString().split(' ').slice(1, 5).join(' ')}`  : '--:--'}</p>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Client Name</p>
                                        <p className="font-semibold text-md uppercase report-text">{name  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4 mt-4">
                                        <p className="font-medium reportdetail-headertext text-md">Phone Number</p>
                                        <p className="font-semibold text-md uppercase report-text">{Phone_Number  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Duration</p>
                                        <p className="font-semibold text-md uppercase report-text">{Duration  || '--:--'}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-medium reportdetail-headertext text-md">Comments</p>
                                        <p className="font-semibold text-md uppercase report-text">{Comments  || '--:--'}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-5 gap-4">
                                    <Button onClick={ closeReport } className="cancel-detail mr-2">Close
                                        <Minimize2 size={18} strokeWidth={2} color="white" className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )) : <p>No data available</p>}
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
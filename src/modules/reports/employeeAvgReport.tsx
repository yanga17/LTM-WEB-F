'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { EmployeeAvgTimePDF } from '../../components/component/employeeAvgPDF'
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { X } from "lucide-react";

interface EmployeeAvgProps {
    ID: number,
    Employee: string,
    EmployeeCount: number,
    Activities: string,
    AvgTimePerTicket: string,
    TotalAllEmpTickets: number
}
export type EmployeeAvgResponse = EmployeeAvgProps[]

interface EmployeeProps {
    ID: number;
    Technician: string;
}
type EmployeeType = EmployeeProps[]


export const EmployeeAvgReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [data, setData] = useState<EmployeeAvgResponse>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);

    const [employee, setEmployee] = useState("");
    const [filteredData, setFilteredData] = useState<EmployeeAvgResponse>([]);
    const [dropdownValue, setDropDownvalue] = useState('');

    const headers = ['No.', 'Employee', 'Average Time Per Ticket', 'Tasks', 'Total Tickets']
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterEmployeeAvgReport = async () => {
        try {
            //
            const newStartTime = new Date(startTime); //change to required format
            const newEndTime = new Date(endTime);

            const url = `reports/getemployeeavgdata/${newStartTime}/${newEndTime}`
            const response = await axios.get<EmployeeAvgResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;

            if (fetchedData.length === 0) {
                toast.error('There is no available data between the selected date periods!', {
                    icon: <X color={colors.red} size={24} />,
                    duration: 3000,
                });
                return;
            }

            if (employee) {
                const filteredByEmployee = fetchedData.filter((item) => item.Employee === employee);
                setFilteredData(filteredByEmployee);
            } else {
                setFilteredData(fetchedData);
            }

            setData(fetchedData);
        } catch (error) {
            console.error('An error occurred while fetching the Client Error Report:', error);
            filterNotification();
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

    const generateEmployeeAvgPDF = async () => {
        if (data.length === 0) {
            generateNotification();

        } else {

            const blob = await ReactPDF.pdf(<EmployeeAvgTimePDF data={data} starttime={startTime} endtime={endTime} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Employee Average Time Report.pdf';
            document.body.appendChild(a); // Append to the document to trigger the download
            a.click();
            document.body.removeChild(a); // Remove after download
        }
    };

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

    const generateNotification = () => {
        toast.error('Please generate the report before downloading the PDF File!', {
            icon: <X color={colors.red} size={24} />,
            duration: 3000,
        })
    }

    const viewPDF = () => {
        if (data.length === 0) {
            viewNotification();
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        generateEmployees();
    }, []);


    // Assuming TotalAllEmpTickets from filtered data is to be used as total value
    //const totalAllEmpTickets = filteredData.reduce((total, item) => total + item.TotalAllEmpTickets, 0);
    const allTotals = filteredData[0]?.TotalAllEmpTickets


    return (
        <>
        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className='relative w-[800px]'>
                    <button className="absolute top-0 -right-2 p-2" onClick={() => setIsModalOpen(false)}
                    >
                        <X size={24} strokeWidth={2} color='red'/>
                    </button>
                    <PDFViewer width="100%" height="600">
                        <EmployeeAvgTimePDF data={filteredData} starttime={startTime} endtime={endTime} />
                    </PDFViewer>
                </div>
            </div>
        )}
        <div className="h-screen overflow-y-scroll mb-6">
        <div className="w-full flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2">
                    <label className="header-text">Start Date:</label>
                    <input type="datetime-local" name="starttime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="flex flex-col p-2">
                    <label className="header-text">End Date:</label>
                    <input type="datetime-local" name="endtime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="mt-6 w-36 sm:w-32 md:w-40 lg:w-44 xl:w-48 flex flex-col text-gray-500 rounded">
                    <select 
                    className="select-input"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    >
                    <option value="" className="text-gray-500">All</option>
                        {allEmployees?.map(({ ID, Technician }) =>
                        <option key={ID} value={Technician}>{Technician}</option>
                    )}
                    </select>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-4 mt-6 mr-2">
                    <div className="flex flex-col">
                        <button onClick={ filterEmployeeAvgReport } className="start-call font-medium gap-1">
                            Filter
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={ viewPDF } className="start-call font-medium gap-1">
                            View PDF
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 report-header p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase report-text font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {filteredData?.map(({ ID, Employee, EmployeeCount, Activities, AvgTimePerTicket, TotalAllEmpTickets }, index) => (
                <div key={index} className={`report-header report-text p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{index + 1}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Employee}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{AvgTimePerTicket}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Activities}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{EmployeeCount}</p>
                </div>
            ))}
            {/* New row for TotalAllEmpTickets
            <div className="report-header report-text p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 bg-gray-200 font-bold">
                <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">Total</p>
                <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">-</p>
                <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">-</p>
                <p className="text-sm uppercase text-green font-medium w-1/4 lg:w-1/4 text-center">{allTotals}</p>
            </div> */}
        </div>
        </>
    )
}
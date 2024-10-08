'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { EmployeeSummaryPDF } from '../../components/component/employeeSummaryPDF'
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { X } from "lucide-react";

interface EmployeeSumProps {
    ID: number,
    Employee: string,
    Surname: string,
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

interface EmployeeProps {
    ID: number;
    Technician: string;
}

type EmployeeType = EmployeeProps[]


export const EmployeeSummaryReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [data, setData] = useState<EmployeeSumResponse>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);

    const [employee, setEmployee] = useState("");
    const [filteredData, setFilteredData] = useState<EmployeeSumResponse>([]);
    const [dropdownValue, setDropDownvalue] = useState('');

    const headers = ['No.', 'Employee', 'Surname', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Total']

    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterEmployeeAvgReport = async () => {
        try {
            const newStartTime = new Date(startTime); //change to required format
            const newEndTime = new Date(endTime);

            const url = `reports/getemployeesummarydata/${newStartTime}/${newEndTime}`
            const response = await axios.get<EmployeeSumResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response?.data;
            console.log("fetched data response:", fetchedData);

            if (!Array.isArray(fetchedData)) {
                throw new Error('Fetched data is not an array');
            }

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
            console.error('An error occurred while fetching the Employee Summary Report:', error);
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

    const generateEmployeeSummaryPDF = async () => {
        if (data.length === 0) {
            generateNotification();

        } else {

            const blob = await ReactPDF.pdf(<EmployeeSummaryPDF data={data} starttime={startTime} endtime={endTime} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Employee Tasks Report.pdf';
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
        console.log("filteredData in viewPDF:", filteredData); // Add this line for debugging
    
        if (!Array.isArray(filteredData) || filteredData.length === 0) {
            viewNotification();
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        generateEmployees();
    }, []);

        // Calculate totals for each day
        const totalMonday = data.reduce((total, row) => total + row.Monday, 0);
        const totalTuesday = data.reduce((total, row) => total + row.Tuesday, 0);
        const totalWednesday = data.reduce((total, row) => total + row.Wednesday, 0);
        const totalThursday = data.reduce((total, row) => total + row.Thursday, 0);
        const totalFriday = data.reduce((total, row) => total + row.Friday, 0);
        const totalSaturday = data.reduce((total, row) => total + row.Saturday, 0);
        const totalSunday = data.reduce((total, row) => total + row.Sunday, 0);
        const totalOverall = data.reduce((total, row) => total + row.OverallTotal, 0);

    return (
        <>
        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className='relative w-[1000px]'>
                    <button className="absolute top-0 -right-2 p-2" onClick={() => setIsModalOpen(false)}
                    >
                        <X size={24} strokeWidth={2} color='red'/>
                    </button>
                    <PDFViewer width="100%" height="600">
                        <EmployeeSummaryPDF data={filteredData} starttime={startTime} endtime={endTime} />
                    </PDFViewer>
                </div>
            </div>
        )}
        <div className="h-screen mb-6">
        <div className="w-full flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2">
                    <label className="dash-text">Start Date:</label>
                    <input type="datetime-local" name="starttime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="flex flex-col p-2">
                    <label className="dash-text">End Date:</label>
                    <input type="datetime-local" name="endtime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="select-input"></input>
                </div>
                <div className="mt-6 w-36 sm:w-32 md:w-40 lg:w-44 xl:w-48 flex flex-col text-gray-500 rounded">
                    <select 
                    className="select-input"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    >
                    <option value="" className="text-black">All</option>
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
                    {/* <div className="flex flex-col">
                        <button onClick={ generateCustomerCallsPDF } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                            Generate PDF
                        </button>
                    </div> */}
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 report-header p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase report-text font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {filteredData?.map(({ ID, Employee, Surname, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, OverallTotal }, index) => (
                <div key={index + 1} className={`report-header report-text p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{index + 1}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Employee}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Surname}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Monday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Tuesday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Wednesday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Thursday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Friday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Saturday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Sunday}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{OverallTotal}</p>
                </div>
            ))}
            <div className="report-header report-text p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500">
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center text-purple">Total:</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">--:--</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">--:--</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalMonday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalTuesday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalWednesday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalThursday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalFriday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalSaturday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalSunday}</p>
                <p className="text-sm uppercase font-sm w-1/4 lg:w-1/4 text-center">{totalOverall}</p>
            </div>
        </div>
        </>
    )
}
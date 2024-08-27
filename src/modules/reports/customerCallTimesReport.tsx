'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CustomerCallTimesPDF } from '../../components/component/customerCallTimesPDF'
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { X } from 'lucide-react';

interface CustomerCallTimesProps {
    Call_ID: number,
    Customer: string,
    CallCount: number,
    AverageTime: string,
    TotalHours: string
}
export type CallTimesResponse = CustomerCallTimesProps[]

//getAll Customers
interface CustomerProps {
    uid: number;
    Customer: any;
}
type CustomerType = CustomerProps[]

export const CustomerCallTimesReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    //const [data, setData] = useState<CallTimesResponse>([]);
    const [allCustomers, setAllCustomers] = useState<CustomerType>([]);

    const [customer, setCustomer] = useState('')
    const [filteredData, setFilteredData] = useState<CallTimesResponse>([]);

    const headers = ['Customer', 'Call Count', 'Average Time', 'Total']
    const [isModalOpen, setIsModalOpen] = useState(false);

    const splitCustomerName = (customerName: string) => {
        return customerName.split(',')[0].trim().toLocaleLowerCase();
    };

    const filterCallHistoryReport = async () => {
        try {
            //http://localhost:4200/reports/getcalltimesdata/Thu Aug 15 2024 18:49:34/Fri Aug 23 2024 16:19:50
            const newStartTime = new Date(startTime).toString().split(' ').slice(1, 5).join(' '); //change to required format
            const newEndTime = new Date(endTime).toString().split(' ').slice(1, 5).join(' ');

            const url = `reports/getcalltimesdata/${newStartTime}/${newEndTime}`
            const response = await axios.get<CallTimesResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;
            console.log("MY RESPONSE DATA: MY RESPONSE DATA:", response);

            if (fetchedData.length === 0) {
                toast.error('No data was found for the selected customer between the date periods!', {
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
            console.error('An error occurred while fetching the Client Error Report:', error);
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

    useEffect(() => {
        generateCustomers();
    }, [])

    //console.log("MY FILTERED DATA: MY FILTERED DATA:", filteredData);
    console.log("MY RESPONSE DATA: MY RESPONSE DATA:", filteredData);


    return (
        <>
        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className='relative w-[1000px]'>
                    <button className="absolute top-0 -right-2 p-2" onClick={() => setIsModalOpen(false)}
                    >
                        <X size={24} strokeWidth={2} color="red" /> 
                    </button>
                    <PDFViewer width="100%" height="600">
                        <CustomerCallTimesPDF data={filteredData} starttime={startTime} endtime={endTime} />
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
                <div className="mt-6 w-56 sm:w-52 md:w-60 lg:w-64 flex flex-col text-gray-500 rounded">
                <select 
                    className="select-input"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    >
                    <option value="" className="dash-text">All</option>
                        {allCustomers?.map(({ uid, Customer }) =>
                        <option key={uid} value={Customer}>{Customer}</option>
                    )}
                    </select>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-4 mt-6 mr-2">
                    <div className="flex flex-col">
                        <button onClick={ filterCallHistoryReport } className="start-call uppercase font-medium gap-1">
                            Filter
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={ viewPDF } className="start-call uppercase font-medium gap-1">
                            View PDF
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 report-header p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase report-text font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {filteredData?.map(({ Call_ID, Customer, CallCount, AverageTime, TotalHours }, index) => (
                <div key={Call_ID} className={` report-header report-text p-4 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{Customer}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{CallCount}</p>
                    <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center">{AverageTime}</p>
                    <p className="text-sm font-medium w-1/4 lg:w-1/4 text-center">
                        {TotalHours}
                    </p>
                </div>
            ))}
        </div>
        </>
    )
}
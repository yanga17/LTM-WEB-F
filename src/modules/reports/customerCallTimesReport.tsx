'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { CustomerCallTimesPDF } from '../../components/component/customerCallTimesPDF'
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { X } from 'lucide-react'

interface CustomerCallTimesProps {
    Call_ID: number,
    Customer: string,
    CallCount: number,
    AverageTime: string,
    TotalHours: string
}
export type CallTimesResponse = CustomerCallTimesProps[]

export const CustomerCallTimesReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [data, setData] = useState<CallTimesResponse>([]);

    const headers = [ 'Call_ID', 'Customer', 'Call Count', 'Average Time', 'Total Hours']
    const [isModalOpen, setIsModalOpen] = useState(false);


    const filterCallHistoryReport = async () => {
        try {
            const url = `reports/getcalltimesdata/${startTime}/${endTime}`
            const response = await axios.get<CallTimesResponse>(`${apiEndPoint}/${url}`);
            setData(response?.data)
        } catch (error) {
            console.error('An error occurred while fetching the Client Error Report:', error);
            filterNotification();
        }
    }

    const generateCustomerCallHistoryPDF = async () => {
        if (data.length === 0) {
            generateNotification();

        } else {

            const blob = await ReactPDF.pdf(<CustomerCallTimesPDF data={data} starttime={startTime} endtime={endTime} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Customer Call History Report.pdf';
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


    return (
        <>
        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className='relative w-[800px]'>
                    <button className="absolute top-0 right-0 p-2 h-25 w-25 text-red" onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </button>
                    <PDFViewer width="100%" height="600">
                        <CustomerCallTimesPDF data={data} starttime={startTime} endtime={endTime} />
                    </PDFViewer>
                </div>
            </div>
        )}
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
                    <button onClick={ filterCallHistoryReport } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Filter
                    </button>
                </div>
                <div className="flex flex-col mt-5">
                    <button onClick={ viewPDF } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        View PDF
                    </button>
                </div>
                <div className="flex flex-col mt-5">
                    <button onClick={ generateCustomerCallHistoryPDF } className="bg-purple hover:bg-white hover:text-purple border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                        Generate PDF
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {data?.map(({ Call_ID, Customer, CallCount, AverageTime, TotalHours }, index) => (
                <div key={Call_ID} className={` bg-white text-black p-4 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{Call_ID}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{Customer}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{CallCount}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{AverageTime}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center text-overflow truncate">{TotalHours}</p>
                </div>
            ))}
        </div>
        </>
    )
}
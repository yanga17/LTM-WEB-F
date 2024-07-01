'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState, useEffect, createContext } from "react";
import { Filter, UserRound, TicketX, AlignCenterVertical, ClipboardCheck  } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { CustomerCallPDF } from '../../components/component/customerCallsPDF'
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { X } from 'lucide-react'

interface CustomerCallsProps {
    ID: number,
    Customer: string,
    Activity: string,
    CallCount: number
}
export type CustomerCallsResponse = CustomerCallsProps[]

export const CustomerCallsReport = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [data, setData] = useState<CustomerCallsResponse>([]);
    const [filteredData, setFilteredData] = useState<CustomerCallsResponse>([]);
    const [dropdownValue, setDropDownvalue] = useState('');

    const headers = ['No.', 'Customer', 'Error/Task', 'No. Times Called']

    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterCustomerCallsReport = async () => {
        try {
            const url = `reports/getcustomercalldata/${startTime}/${endTime}`
            const response = await axios.get<CustomerCallsResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;

            let topData = fetchedData;
            switch (dropdownValue) {
                case 'TopTen':
                    topData = fetchedData.slice(0, 10);
                    break;
                case 'TopTwenty':
                    topData = fetchedData.slice(0, 20);
                    break;
                case 'TopThirty':
                    topData = fetchedData.slice(0, 30);
                    break;
                case 'TopFifty':
                    topData = fetchedData.slice(0, 50);
                    break;
                default:
                    break;
            }

            setData(fetchedData);
            setFilteredData(topData);
        } catch (error) {
            console.error('An error occurred while fetching the Client History Reports:', error);
            filterNotification();
        }
    }

    // const generateCustomerCallsPDF = async () => {
    //     if (filteredData.length === 0) {
    //         generateNotification();

    //     } else {
    //         const blob = await ReactPDF.pdf(<CustomerCallPDF data={filteredData} starttime={startTime} endtime={endTime} />).toBlob();
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'CustomerCallsReport.pdf';
    //         document.body.appendChild(a); // Append to the document to trigger the download
    //         a.click();
    //         document.body.removeChild(a); // Remove after download
    //     }
    // };

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
                        <CustomerCallPDF data={filteredData} starttime={startTime} endtime={endTime} />
                    </PDFViewer>
                </div>
            </div>
        )}
        <div className="h-screen overflow-auto mb-6">
        <div className="w-full flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex flex-col p-2 text-black">
                    <label>Start Date:</label>
                    <input type="datetime-local" name="starttime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-3 w-full border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="flex flex-col p-2 text-black">
                    <label>End Date:</label>
                    <input type="datetime-local" name="endtime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-3 w-full border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic"></input>
                </div>
                <div className="mt-6 flex flex-col p-2 text-gray-500 rounded">
                    <select value={dropdownValue} onChange={(e) => setDropDownvalue(e.target.value)} className='p-3 w-full border rounded text-gray-500 outline-none md:cursor-pointer placeholder:text-sm placeholder:italic'>
                        <option value="">All</option>
                        <option value="TopTen">Top 10</option>
                        <option value="TopTwenty">Top 20</option>
                        <option value="TopThirty">Top 30</option>
                        <option value="TopFifty">Top 50</option>
                    </select>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center gap-4 mt-6 mr-2">
                    <div className="flex flex-col">
                        <button onClick={ filterCustomerCallsReport } className="bg-purple hover:bg-black hover:text-white border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
                            Filter
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={ viewPDF } className="bg-purple hover:bg-black hover:text-white border border-purple text-white cursor-pointer px-4 lg:px-8 lg:py-3 text-sm rounded uppercase font-medium gap-1">
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
            <div className="flex items-center justify-between divide-x divide-gray-500 bg-white text-black p-3 mt-4 mx-2 rounded">
                {headers?.map((header, index) => <p key={index} className={`text-xs uppercase text-gray-500 font-medium w-${100 / headers?.length} w-full text-center ${index === 1 && 'hidden lg:block'}`}>{header}</p>)}
            </div>
            
            {filteredData?.map(({ ID, Customer, Activity, CallCount }, index) => (
                <div key={index} className={` bg-white text-black p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{index + 1}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center p-2">{Customer}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center p-2">{Activity}</p>
                    <p className="text-sm uppercase text-gray-500 font-medium w-1/4 lg:w-1/4 text-center">{CallCount}</p>
                </div>
            ))}
        </div>
        </>
    )
}
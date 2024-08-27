'use client'

import { apiEndPoint, colors } from '@/utils/colors';
import { useState } from "react";
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
            const newStartTime = new Date(startTime); //change to required format
            const newEndTime = new Date(endTime);
            
            const url = `reports/getcustomercalldata/${newStartTime}/${newEndTime}`
            const response = await axios.get<CustomerCallsResponse>(`${apiEndPoint}/${url}`);
            const fetchedData = response.data;

            let topData = fetchedData;
            switch (dropdownValue) {
                case 'TopTen':
                    topData = fetchedData.slice(0, 10);

                    if (fetchedData.length === 0) {
                        toast.error('No data found for the selected date range.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                        return;
                    } else if (fetchedData.length < 10) {
                        toast.error('Report between dates selected does not exceed 10.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                    }
                    break;
                case 'TopTwenty':
                    topData = fetchedData.slice(0, 20);

                    if (fetchedData.length === 0) {
                        toast.error('No data found for the selected date range.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                        return;
                    } else if (fetchedData.length < 20) {
                        toast.error('Report between dates selected does not exceed 20.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                    }
                    break;
                case 'TopThirty':
                    topData = fetchedData.slice(0, 30);

                    if (fetchedData.length === 0) {
                        toast.error('No data found for the selected date range.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                        return;
                    } else if (fetchedData.length < 30) {
                        toast.error('Report between dates selected does not exceed 30.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                    }
                    break;
                case 'TopFifty':
                    topData = fetchedData.slice(0, 50);

                    if (fetchedData.length === 0) {
                        toast.error('No data found for the selected date range.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                        return;
                    } else if (fetchedData.length < 50) {
                        toast.error('Report between dates selected does not exceed 50.', {
                            icon: <X color={colors.red} size={24} />,
                            duration: 3000,
                        });
                    }
                    break;
                default:

                if (topData.length <= 0) {
                    toast.error('There is no data between the selected date periods!', {
                        icon: <X color={colors.red} size={24} />,
                        duration: 3000,
                    })
                }
                    break;
            }

            setData(fetchedData);
            setFilteredData(topData);
        } catch (error) {
            console.error('An error occurred while fetching the Client History Reports:', error);
            filterNotification();
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

    const generateNotification = () => {
        toast.error('Please generate the report before downloading the PDF File!', {
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
                    <select value={dropdownValue} onChange={(e) => setDropDownvalue(e.target.value)} className="select-input">
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
                        <button onClick={ filterCustomerCallsReport } className="start-call font-medium gap-1">
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
            
            {filteredData?.map(({ ID, Customer, Activity, CallCount }, index) => (
                <div key={index} className={`report-header report-text p-2 mt-2 mx-2 rounded flex items-center justify-between divide-x divide-gray-500 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                    <p className="text-sm uppercase text-purple font-medium w-1/4 lg:w-1/4 text-center">{index + 1}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center p-2">{Customer}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center p-2">{Activity}</p>
                    <p className="text-sm uppercase font-medium w-1/4 lg:w-1/4 text-center">{CallCount}</p>
                </div>
            ))}
        </div>
        </>
    )
}
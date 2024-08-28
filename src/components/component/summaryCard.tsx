'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { useQuery } from "@/hooks/useQuery";
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from "react-hot-toast"

interface TaskProps {
    NumberOfTasks: number
}

interface ErrorProps {
    NumberOfProblems: number
  }

type TaskResponse = TaskProps[]
type ErrorResponse = ErrorProps[]
export function SummaryCard() {
    const [totalTasks, setTotalTasks] = useState<TaskResponse>([]);
    const [totalErrors, setTotalErrors] = useState<ErrorResponse>([]);

    const taskSummary = async () => {
        try {
            const taskUrl = `tickets/getasksummary`;
            const taskSummary = await axios.get<TaskResponse>(`${apiEndPoint}/${taskUrl}`);
    
            if (taskSummary?.data && taskSummary.data.length > 0) {
                setTotalTasks(taskSummary.data);
            }
    
            console.log("my number of tasks returned:", taskSummary.data);
            } catch (error) {
            console.error("Error fetching task summary:", error);
            }
    }
    
    //getProblemSummary
    const errorSummary = async () => {
        try {
            const errorUrl = `tickets/geterrosummary`;
            const errorSummary = await axios.get<ErrorResponse>(`${apiEndPoint}/${errorUrl}`);
    
            if (errorSummary?.data && errorSummary.data.length > 0) {
                setTotalErrors(errorSummary.data);
            }
    
            console.log("my number of errors/problems returned:", errorSummary.data);
            } catch (error) {
                console.error("Error fetching problem/error summary:", error);
            }
    }

    useEffect(() => {
        taskSummary();
        errorSummary();
    }, [])

    return (
        <div className="grid grid-cols-2 w-[500px] gap-2 max-[500px]:grid-cols-1">
            {totalTasks.map(({ NumberOfTasks }, index) => (
            <div key={index} className="group w-full rounded-lg bg-[#a17efa] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2ea1ff]">
                <p className="text-white text-2xl">{NumberOfTasks || 0}</p>
                <p className="text-white text-sm">Completed Task(s)</p>
                <svg
                    className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 "
                    xmlns="http://www.w3.org/2000/svg" 
                    height="36"
                    width="36" 
                    viewBox="0 0 24 24" 
                    fill="#fffff" 
                    stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                >
                <g>
                    <path
                        className=""
                        data-original="#000000"
                        opacity="1"
                        fill="#ffffff"
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </g>
                </svg>
            </div>
            ))}
        {totalErrors.map(({ NumberOfProblems }, index) => (
        <div key={index} className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#a17efa]">
            <p className="text-white text-2xl">{NumberOfProblems || 0}</p>
            <p className="text-white text-sm">Completed Error(s)</p>
        <svg
            className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300"
            xmlSpace="preserve"
            viewBox="0 0 405.333 405.333"
            y="0"
            x="0"
            height="36"
            width="36"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path
                        className=""
                        data-original="#000000"
                        opacity="1"
                        fill="#ffffff"
                        d="M202.667 0C117.333 0 32 10.667 32 85.333V288c0 41.173 33.493 74.667 74.667 74.667l-32 32v10.667h47.573l42.667-42.667h80.427L288 405.333h42.667v-10.667l-32-32c41.173 0 74.667-33.493 74.667-74.667V85.333C373.333 10.667 296.96 0 202.667 0zm-96 320c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.294 32-32 32zm74.666-149.333H74.667V85.333h106.667v85.334zM298.667 320c-17.707 0-32-14.293-32-32s14.293-32 32-32 32 14.293 32 32-14.294 32-32 32zm32-149.333H224V85.333h106.667v85.334z">
                    </path>
                </g>
            </svg>
        </div>
        ))}
    </div>
    );
}
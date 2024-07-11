'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

interface TaskProps {
  NumberOfTasks: number
}

interface ErrorProps {
  NumberOfProblems: number
}

interface OverallTotalProps {
  TicketsCompleted: number
}

interface ActiveProps {
  ActiveTickets: number
}

interface QueuedProps {
  QueuedTickets: number
}

type TaskResponse = TaskProps[]
type ErrorResponse = ErrorProps[]
type OverallTotalResponse = OverallTotalProps[]
type ActiveResponse = ActiveProps[]
type QueuedResponse = QueuedProps[]

export function TicketSummary() {
  const [totalTasks, setTotalTasks] = useState<TaskResponse>([]);
  const [totalErrors, setTotalErrors] = useState<ErrorResponse>([]);
  const [overallTotal, setOverallTotal] = useState<OverallTotalResponse>([]);
  const [activeTotal, setActiveTotal] = useState<ActiveResponse>([]);
  const [queuedTotal, setQueuedTotal] = useState<QueuedResponse>([]);

  //getTaskSummary
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

  //getTotalSummary
  const totalSummary = async () => {
    try {
      const totalUrl = `tickets/getotalsummary`;
      const totalSummary = await axios.get<OverallTotalResponse>(`${apiEndPoint}/${totalUrl}`);

      if (totalSummary?.data && totalSummary.data.length > 0) {
        setOverallTotal(totalSummary.data);
      }

      console.log("number of total tickets returned:", totalSummary.data);
    } catch (error) {
      console.error("Error fetching number of completed tickets summary:", error);
    }
  }


  const activeSummary = async () => {
    try {
      const activeUrl = `tickets/getactivesummary`;
      const activeSummary = await axios.get<ActiveResponse>(`${apiEndPoint}/${activeUrl}`);

      if (activeSummary?.data && activeSummary.data.length > 0) {
        setActiveTotal(activeSummary.data);
      }
      console.log("my number of active tickets returned:", activeSummary.data);

    } catch (error) {
      console.error("Error fetching active summary:", error);
    }
  }

  const queuedSummary = async () => {
    try {
      const queuedUrl = `tickets/getloggedsummary`;
      const queuedSummary = await axios.get<QueuedResponse>(`${apiEndPoint}/${queuedUrl}`);

      if (queuedSummary?.data && queuedSummary.data.length > 0) {
        setQueuedTotal(queuedSummary?.data);
      }
      console.log("my number of queued tickets returned:", queuedSummary.data);

    } catch (error) {
      console.error("Error fetching queued summary:", error);
    }
  }
  

  useEffect(() => {
    taskSummary();
    errorSummary();
    totalSummary();
    activeSummary();
    queuedSummary();
  }, [])


  return (
    <>
    {totalTasks.map(({ NumberOfTasks }, index) => (
      <div key={index} className="w-[400px] bg-white rounded-lg shadow-md">
      <header className="bg-gray-100 sm:bg-gray-100 px-3 py-2 rounded-t-lg">
        <h2 className="text-gray-800 font-medium text-lg">Daily Summary:</h2>
      </header>
      <div className="grid grid-cols-3 gap-3 p-3">
        <div className="bg-gray-100 sm:bg-gray-100 rounded-lg p-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-800">
            {NumberOfTasks}
          </h3>
          <p className="text-sm text-gray-500 sm:text-gray-500 dark:text-gray-400">Task(s) Completed</p>
        </div>
        <div className="bg-gray-100 sm:bg-gray-100 rounded-lg p-3">
          <h3 className="text-xl font-bold text-gray-800 sm:text-gray-800">
          {totalErrors[index]?.NumberOfProblems || '0'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer Errors Solved</p>
        </div>
        <div className="bg-gray-100 sm:bg-gray-100 rounded-lg p-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {overallTotal[index]?.TicketsCompleted || '0'}
          </h3>
          <p className="text-sm text-gray-500 sm:text-gray-500">Ticket(s) Completed</p>
        </div>
        <div className="bg-gray-100 sm:bg-gray-100 rounded-lg p-3 col-span-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 sm:text-gray-500">No. Active Tickets</p>
            <h3 className="text-xl font-bold text-gray-800 sm:text-gray-800">
            {activeTotal[index]?.ActiveTickets || '0'}
            </h3>
          </div>
        </div>
        <div className="bg-gray-100 sm:bg-gray-100 rounded-lg p-3 col-span-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 sm:text-gray-500">No. Queued Tickets</p>
            <h3 className="text-xl font-bold text-gray-800 sm:text-gray-800">
            {queuedTotal[index]?.QueuedTickets || '0'}
            </h3>
          </div>
        </div>
      </div>
    </div>
    ))} 
    </>
  )
}

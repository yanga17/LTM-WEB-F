'use client'

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, CheckCheck, XIcon } from "lucide-react";

import * as React from "react"
import {useState, useEffect} from 'react'
import { useQuery } from "@/hooks/useQuery";

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from "react-hot-toast"


interface Props {
  onClose: () => void;
}

//interface for gettingAllcustomers
interface CustomerProps {
  uid: number;
  Customer: any;
}
type CustomerType = CustomerProps[]


//interface for gettinErrors
interface ErrorProps {
  idx: number;
  Errors: string;
}
type ErrorsType = ErrorProps[]


//interface for gettinEmployees
interface EmployeeProps {
  ID: number;
  Technician: string;
}
type EmployeeType = EmployeeProps[]

//interface for gettinTypes
interface TypesProps {
  ID: number;
  Type: string;
}

type TypeErrors = TypesProps[]

export function StartCall({ onClose}: Props) {
  //storing data for input fields
  const [allCustomers, setAllCustomers] = useState<CustomerType>([]);
  const [allProblems, setAllProblems] = useState<ErrorsType>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);
  const [alltypes, setAllType] = useState<TypeErrors>([]);

  //inserting data into tables
  const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [anydesk, setAnydesk] = useState("");
  const [type, setType] = useState("");
  const [employee, setEmployee] = useState("");
  const [priority, setPriority] = useState("");
  const [urgent, setUrgent] = useState(0);
  const [comments, setComments] = useState("");
  const [issueType, setIssueType] = useState("Problem");

  const [tickets, setTickets] = useState(""); 
  
  //insert new ticket
  const startCallurl = 'insertnewtickets'
  const { data, loading, error } = useQuery<ResponseType>(startCallurl);

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

  const generateProblems = async () => {
    try {
      const url = `tickets/geterrors`
      const response = await axios.get<ErrorsType>(`${apiEndPoint}/${url}`);
  
      setAllProblems(response.data)
  
      if (response.data.length === 0) {
        toast.error(`No data available for client problems.`, {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
  
    }} catch (error) {
  
      console.error('An error occurred while client problems:', error);
      
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

  const generateTypes = async () => {
    try {
      const url = `tickets/getypes`
      const response = await axios.get<TypeErrors>(`${apiEndPoint}/${url}`);
  
      setAllType(response.data)
  
      if (response.data.length === 0) {
        toast.error(`No data available for call types.`, {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
  
    }} catch (error) {
  
      console.error('An error occurred while call types:', error);
      
    }
  }
  
  
  // Function to save comments
  const saveComments = (comments: string) => {
    setComments(comments);
  };

  const savePriority = (priority: string) => {

    let urgency: number;

    if (priority  === "Urgent") {
      urgency = 1;

    } else if (priority === "Moderate") {
      urgency = 2;

    } else if (priority === "Low") {
      urgency = 0;

    } else {
      urgency = 0;
    }

    console.log('Priority:', priority); // Add this line to log the priority state
    console.log('Urgent:', urgency); // Add this line to log the urgent state

    setPriority(priority)
    setUrgent(urgency)
  }


  useEffect(() => {
    generateCustomers();
    generateProblems();
    generateEmployees();
    generateTypes();
  }, []);


  const submitTicket = async () => {
    const currentDate = new Date().toISOString().slice(0, 10); // Extracting YYYY-MM-DD part
    const currentTime = new Date().toISOString().slice(11, 19); // Extracting HH:MM:SS part
    const dateTime = currentDate + ' ' + currentTime; // Concatenate date and time

    let customerData = customer
    let supportNo = null;

    if (customer.includes(",")) {
      const customerArray = customer.split(",");
      customerData = customerArray[0].trim();
      supportNo = customerArray[1].trim();
    }

    //property names which be exactly like the ones declared in the backend routes
    const ticketData = {
      customer: customerData,
      problem: problem,
      time: dateTime,
      phoneNumber: phonenumber,
      clientsAnydesk: anydesk,
      name: clientName,
      support_No: supportNo, // Assuming a default value
      empl: employee,
      logger: null, // Assuming a default value
      comments: comments,
      urgent: urgent, // Assuming "high" is represented as 1 and other priorities as 0
      issueType: issueType, // Assuming the issueType is the same as the problem
    };

    try {
      const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, ticketData);
      console.log('Ticket submitted successfully:', response.data);

      //setCustomer(response.data)

      console.log('my ticketData', ticketData);
      
      //Reset form fields
      setCustomer("");
      setProblem("");
      setPhoneNumber("");
      setClientName("");
      setAnydesk("");
      setType("");
      setEmployee("");
      setPriority("");
      setComments("");

      // Close the modal
      onClose();
    } catch (error) {
      
      console.error('Error submitting ticket:', error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-200 rounded-lg shadow-md dark:border-gray-800 bg-white overlay">
    <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
        <XIcon className="w-5 h-5" onClick={onClose}/>
        <span className="sr-only">Close</span>
      </button>
      <h1 className="text-2xl font-bold mb-6">Start Call</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="customer">Customer</label>
          <div className="relative">
            <select
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            >
              <option value="" className="border rounded-md">Select customer</option>
                {allCustomers?.map(({ uid, Customer }) =>
                  <option key={uid} value={Customer}>{Customer}</option>
                )}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label>Problem</label>
            <div className="relative">
              <select
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
            >
              <option value="">Select problem</option>
                {allProblems?.map(({ idx, Errors }) =>
                  <option key={idx} value={Errors}>{Errors}</option>
                )}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" placeholder="Enter phone number" type="tel" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setPhoneNumber(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <input id="name" placeholder="Enter name" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setClientName(e.target.value)}/>
          </div>
        <div className="space-y-2">
          <label htmlFor="anydesk">Clients Anydesk</label>
          <input id="anydesk" placeholder="Enter Anydesk ID" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setAnydesk(e.target.value)}/>
        </div>
        <div className="space-y-2">
          <label htmlFor="type">Type</label>
            <div className="relative">
              <select
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select type</option>
                  {alltypes?.map(({ ID, Type }) =>
                  <option key={ID} value={Type}>{Type}</option>
                )}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <div className="relative">
              <select
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">Select employee</option>
                  {allEmployees?.map(({ ID, Technician }) =>
                  <option key={ID} value={Technician}>{Technician}</option>
                )}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="urgent">Priority</label>
              <div className="relative">
                <select
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={priority}
                  onChange={(e) => savePriority(e.target.value)}
                >
                  <option value="">Determine Priority</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
      </div>
      <div className="space-y-2 mt-6">
        <label htmlFor="comments">Comments</label>
        <textarea id="comments" placeholder="Enter comments" className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black h-20 text-top" onChange={(e) => saveComments(e.target.value)}/>
      </div>
      <div className="flex justify-between gap-2 mt-6">
        <Button className="flex-1" variant="outline">
          Take Call
        </Button>
        <Button className="flex-1" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1"
        onClick={submitTicket}
        >Save</Button>
      </div>
      </div>
    </div>
  )
}

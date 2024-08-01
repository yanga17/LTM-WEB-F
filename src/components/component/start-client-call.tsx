'use client'

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import * as React from "react"
import {useState, useEffect} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from '@/context';
import { CheckProps } from '@/modules/home/ticketsModule';
import { XIcon, Check } from 'lucide-react';
import { ClientResponseType } from '@/modules/customers/clientsModule';
import { ClientProps } from '@/modules/customers/clientsModule';

interface Props {
    onClose: () => void;
    data: ClientResponseType;
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

export function StartClientCall({ onClose, data }: Props) {
    const { user } = useSession();

    //storing data for input fields
    const [allCustomers, setAllCustomers] = useState<CustomerType>([]);
    const [allProblems, setAllProblems] = useState<ErrorsType>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);
    const [alltypes, setAllType] = useState<TypeErrors>([]);

    //inserting data into tables
    const [customer, setCustomer] = useState("");
    const [problem, setProblem] = useState("");
    const [phonenumber, setPhoneNumber] = useState(0);
    const [clientName, setClientName] = useState("");
    const [anydesk, setAnydesk] = useState("");
    const [type, setType] = useState("");
    const [employee, setEmployee] = useState("");
    const [priority, setPriority] = useState("");
    const [comments, setComments] = useState("");
    const [issueType, setIssueType] = useState("");
    const [emailAdd, setEmailAdd] = useState("");

    const [tickets, setTickets] = useState("");
    const [checkStatus, setCheckStatus] = useState(false); //checkbox

    const [callid, setCallID] = useState(0);


    useEffect(() => {
        generateCustomers();
        generateProblems();
        generateEmployees();
        generateTypes();
        // generateEdtitedData();
        // filterCustomer(allCustomers);
    }, []);

    useEffect(() => {
        if (checkStatus === true) {
            setIssueType("Task");
        } else {
            setIssueType("Problem");
        }
            console.log("MY CHECKSTATUS TEXT:", checkStatus)
    }, [checkStatus])

    useEffect(() => {
        if (user?.emp_name) {
          setEmployee(user.emp_name);
        }
    }, [user]);

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

    // const generateEdtitedData = () => {
    //     setCustomer(data.client_name)
    //     setPhoneNumber(data.phone_number || data.cellphone)
    //     console.log('SETTING CLIENT CALL CUSTOMER EDIT DATA WAS SUCCESSFUL', customer)
    //     console.log('SETTING CLIENT CALL CUSTOMER EDIT DATA WAS SUCCESSFUL', phonenumber)
    // }

    const handleCheckStatus = () => {
        setCheckStatus((prevStatus) => !prevStatus);
    }

    const saveComments = (comments: string) => {
        setComments(comments);
    };

    const saveEdit = async () => {
        const editData = {
            customer: customer, 
            problem: problem, 
            number: phonenumber,
            name: clientName,
            email: emailAdd,
            anydesk: anydesk,
            type: type,
            employee: employee,
            issueType: issueType,
            comments: comments
        }

        try {
            const fields = [
                { value: customer, message: 'Please select a client.' },
                { value: problem, message: 'Please select a problem.' },
                { value: phonenumber, message: 'Please enter the phone number.' },
                { value: clientName, message: 'Please enter the client name.' },
                { value: emailAdd, message: 'Please enter the clients email address.' },
                { value: anydesk, message: 'Please enter the client`s Anydesk.' },
                { value: type, message: 'Please select a call type.' },
                { value: employee, message: 'Please select an employee.' },
                { value: comments, message: 'Please entered any comments relevant to the Task/Error'},
            ];
        
            for (const field of fields) {
                if (!field.value) {
                    toast.error(field.message, {
                        icon: '🚨',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                    return;
                }
            }


            const url = `tickets/editloggedticket/${callid}`
            const response = await axios.patch<CheckProps>(`${apiEndPoint}/${url}`, editData);
            console.log("Success - Editing Ticket Values with new information was successful.")
            editSuccessNotification();
            onClose();
        } catch (error) {
            console.error('An error occurred while editing ticket:', error);
            editErrorNotification();
        }

    }

    const editSuccessNotification = () => {
        toast.success('Ticket has been edited successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const editErrorNotification = () => {
        toast.error('Ticket has been edited successfully', {
            icon: <XIcon color={colors.red} size={24} />,
            duration: 3000,
        });
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-200 rounded-lg shadow-md dark:border-gray-800 chart-background overlay">
            <div className="text-black flex items-center gap-2 justify-end hover:cursor-pointer">
                <XIcon size={26} strokeWidth={2} color="red" onClick={ onClose } />
            </div>
            <h1 className="dash-text text-2xl font-bold mb-6">Start Client Call</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <label htmlFor="customer" className="dash-text">Customer</label>
                    <div className="relative">
                        <select
                            className="call-input p-2"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            >
                                <option value="" className="call-item">Select Customer</option>
                                    {allCustomers?.map(({ uid, Customer }) =>
                                        <option key={uid} value={Customer} className="call-item">{Customer}</option>
                                    )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="dash-text">Problem</label>
                    <div className="relative">
                        <select
                            className="call-input p-2"
                            value={ problem }
                            onChange={(e) => setProblem(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Problem</option>
                                {allProblems?.map(({ idx, Errors }) =>
                                    <option key={idx} value={Errors} className="call-item">{Errors}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="name"  className="dash-text">Client Name</label>
                    <input id="name" placeholder="Enter name" value={ clientName } className="call-input rounded-md shadow-sm p-2" onChange={(e) => setClientName(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone"  className="dash-text">Phone Number</label>
                    <input id="phone" placeholder="Enter phone number" value={ phonenumber } type="tel" className="call-input rounded-md shadow-sm p-2" onChange={(e) => setPhoneNumber(parseInt(e.target.value))}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="dash-text">Email Address</label>
                    <input id="email" placeholder="Enter the email address" className="call-input rounded-md shadow-sm p-2" onChange={(e) => setEmailAdd(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="anydesk" className="dash-text">Clients Anydesk</label>
                    <input id="anydesk" placeholder="Enter Anydesk ID" value={ anydesk } className="call-input rounded-md shadow-sm p-2" onChange={(e) => setAnydesk(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="type" className="dash-text">Type</label>
                    <div className="relative">
                        <select
                            className="call-input p-2"
                            value={ type }
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Type</option>
                                {alltypes?.map(({ ID, Type }) =>
                                    <option key={ID} value={Type} className="call-item">{Type}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="employee" className="dash-text">Employee</Label>
                    <div className="relative">
                        <select
                            className="call-input p-2"
                            value={ employee }
                            onChange={(e) => setEmployee(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Employee</option>
                                {allEmployees?.map(({ ID, Technician }) =>
                                    <option key={ID} value={Technician} className="call-item">{Technician}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="urgent" className="dash-text">Priority</label>
                    <div className="relative">
                        <select
                            className="call-input p-2"
                            value={ priority }
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="">Determine Priority</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                        <option value="P4">P4</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between space-y-2 mt-6">
                <div className="flex items-center">
                    <label htmlFor="comments" className="dash-text">Comments</label>
                </div>
                <div className="flex items-center space-x-2 mt-6 mb-2">
                    <Checkbox id="task" checked={checkStatus} onClick={ handleCheckStatus }/>
                    <label className="ml-2 text-sm dash-text" htmlFor="task">Task</label>
                </div>
            </div>
            <textarea id="comments" 
                placeholder="Enter comments" 
                value={comments} 
                className="textarea-input rounded-md shadow-sm p-2"
                onChange={(e) => saveComments(e.target.value)}
            />
            <div className="flex justify-between gap-2 mt-6">
                <Button className="flex-1 bg-red hover:bg-rose-300 text-white hover:text-black" onClick={ onClose }>Cancel</Button>
                <Button className="flex-1 bg-green hover:bg-emerald-300 text-white hover:text-black" onClick={() => saveEdit()}>Save</Button>
            </div>
        </div>
    </div>
    )
}

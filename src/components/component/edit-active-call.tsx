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
import { ActiveProps } from '@/modules/home/activeTicketsModule';
import { XIcon, Check } from 'lucide-react';

interface Props {
    closeEdit: () => void;
    data: ActiveProps;
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

export function EditActiveCall({ closeEdit, data }: Props) {
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

    useEffect(() => {
        generateCustomers();
        generateProblems();
        generateEmployees();
        generateTypes();
        generateEdtitedData();
        filterCustomer(allCustomers);
    }, []);

    useEffect(() => {
        if (checkStatus === true) {
            setIssueType("Task");
        } else {
            setIssueType("Problem");
        }
            console.log("MY CHECKSTATUS TEXT:", checkStatus)
    }, [checkStatus])

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

    const handleCheckStatus = () => {
        setCheckStatus((prevStatus) => !prevStatus);
    }

    const saveComments = (comments: string) => {
        setComments(comments);
    };

    const generateEdtitedData = () => {
        setCustomer(data.Customer)
        setProblem(data.Activity)
        setPhoneNumber(data.Phone_Number)
        setClientName(data.Name)
        setEmailAdd(data.Email_Address)
        //setAnydesk(data.Clients_Anydesk)
        setType(data.Type)
        setEmployee(data.Employee)
        setComments(data.Comments)
        console.log('SETTING EDIT DATA WAS SUCCESSFUL', customer)
    }

    const filterCustomer = (customers: CustomerType) => {
        const editCustomer = data.Customer.toLowerCase();
        const newCustomer = customers.find((item) =>
            item.Customer.toLowerCase() === editCustomer
        );

        if (newCustomer) {
            setCustomer(newCustomer.Customer);
        }
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

            const url = `tickets/editactiveticket/${data.ID}`
            const response = await axios.patch<ActiveProps>(`${apiEndPoint}/${url}`, editData);
            console.log("Success - Editing Ticket Values with new information was successful.")
            editSuccessNotification();
            closeEdit();
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

    const submitTicket = async (callId: number) => {
        const currentDate = new Date().toISOString().slice(0, 10); 
        const currentTime = new Date().toISOString().slice(11, 19); 
        const dateTime = currentDate + ' ' + currentTime; 

        let customerData = customer
        let supportNo = null;

        if (customer.includes(",")) {
            const customerArray = customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        // let priorityValue = 0;

        // if (priority === "Urgent") {
        //     priorityValue = 1;
        // } else if (priority === "Moderate") {
        //     priorityValue = 2;
        // } else if (priority === "Low") {
        //     priorityValue = 0;
        // }

        //property names should be exactly like the ones declared in the backend routes
        const ticketData = {
            callid: callId,
            customer: customerData,
            problem: problem,
            time: dateTime,
            phoneNumber: phonenumber,
            clientsAnydesk: anydesk,
            name: clientName,
            support_No: supportNo, 
            empl: employee,
            logger: user ? `${user.emp_name}` : null,
            comments: comments,
            urgent: priority, 
            issueType: issueType, 
            type: type,
        };

        try {
            const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, ticketData);
            console.log('Ticket submitted successfully:', response.data);

            //Reset form fields
            setCustomer("");
            setProblem("");
            setPhoneNumber(0);
            setClientName("");
            setAnydesk("");
            setType("");
            setEmployee("");
            setPriority("");
            setComments("");

            closeEdit();
            } catch (error) {
                console.error('Error updating the logged ticket:', error);
            }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-200 rounded-lg shadow-md dark:border-gray-800 chart-background overlay">
            <div className="text-black flex items-center gap-2 justify-end hover:cursor-pointer">
                <XIcon size={26} strokeWidth={2} color="red" onClick={ closeEdit } />
            </div>
            <h1 className="dash-text text-2xl font-bold mb-6">Edit Active Ticket</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <label htmlFor="customer" className="dash-text">Customer</label>
                    <div className="relative">
                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            value={data.Customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            >
                                <option value="" className="border rounded-md">Select Customer</option>
                                    {allCustomers?.map(({ uid, Customer }) =>
                                        <option key={uid} value={Customer} className="border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-100 focus:bg-gray-200">{Customer}</option>
                                    )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="dash-text">Problem</label>
                    <div className="relative">
                        <select
                            className="ticket-dropdown block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={ problem }
                            onChange={(e) => setProblem(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Problem</option>
                                {allProblems?.map(({ idx, Errors }) =>
                                    <option key={idx} value={Errors}>{Errors}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="name"  className="dash-text">Client Name</label>
                    <input id="name" placeholder="Enter name" value={ clientName } className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setClientName(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone"  className="dash-text">Phone Number</label>
                    <input id="phone" placeholder="Enter phone number" value={ phonenumber } type="tel" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setPhoneNumber(parseInt(e.target.value))}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="dash-text">Email Address</label>
                    <input id="email" placeholder="Enter the email address" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setEmailAdd(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="anydesk" className="dash-text">Clients Anydesk</label>
                    <input id="anydesk" placeholder="Enter Anydesk ID" value={ anydesk } className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setAnydesk(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="type" className="dash-text">Type</label>
                    <div className="relative">
                        <select
                            className="ticket-dropdown block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={ type }
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Type</option>
                                {alltypes?.map(({ ID, Type }) =>
                                    <option key={ID} value={Type}>{Type}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="employee" className="dash-text">Employee</Label>
                    <div className="relative">
                        <select
                            className="ticket-dropdown block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={ employee }
                            onChange={(e) => setEmployee(e.target.value)}
                        >
                            <option value="" className="dash-text">Select Employee</option>
                                {allEmployees?.map(({ ID, Technician }) =>
                                    <option key={ID} value={Technician}>{Technician}</option>
                                )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="urgent" className="dash-text">Priority</label>
                    <div className="relative">
                        <select
                            className="ticket-dropdown block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="ticket-input w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm h-20 text-top" 
                onChange={(e) => saveComments(e.target.value)}
            />
            <div className="flex justify-between gap-2 mt-6">
                <Button className="flex-1 bg-red hover:bg-rose-300 text-white" variant="outline" onClick={ closeEdit }>Cancel</Button>
                <Button className="flex-1 bg-green hover:bg-emerald-300 text-white" variant="outline" onClick={() => saveEdit()}>Save</Button>
            </div>
        </div>
    </div>
    )
}

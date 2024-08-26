'use client'

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as React from "react";
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
import { format } from "date-fns";

interface Props {
    onClose: () => void;
    data: ClientProps | null; // Update the type to allow null
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
    const [phonenumber, setPhoneNumber] = useState("");
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
    }, []);

    useEffect(() => {
        if (allCustomers.length > 0) {
            generateEditedData();
        }
    }, [allCustomers]);

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

    const generateEditedData = () => {
        if (!data) return;

        const { client_name, LEG_num, phone_number, cellphone } = data;

        // Convert client_name to lowercase for case-insensitive matching
        //const lowerClientName = client_name.toLowerCase();
        const lowerClientName = client_name.trim().toLowerCase();

        // Extract Customer names
        const customerNames = allCustomers.map(customerObj => customerObj.Customer);
        console.log("NEW CUSTOMER NAMES NEW CUSTOMER NAMES", customerNames);

        // Find matching customer from allCustomers
        const matchedCustomer = customerNames.find(customer => {
            const [name, leg] = customer.split(',');
            //return name.trim().toLowerCase() === lowerClientName && leg.trim() === LEG_num;
            //return name.trim().toLowerCase() === lowerClientName;
            return name.trim().toLowerCase() === lowerClientName;
        });

        if (matchedCustomer) {
            setCustomer(matchedCustomer);
            //toast.success("A MATCH WAS FOUND!!!");
            console.log("MATCHED CUSTOMER MATCHED CUSTOMER MATCHED CUSTOMER MATCHED CUSTOMER: ", matchedCustomer);
        } else {
            setCustomer(client_name); // Set to client_name if no match found
            toast.error("NO MATCH WAS FOUND");
            //console.log("NO MATCHED CUSTOMER: ", client_name);
            console.log("LOWER CASE CUSTOMER LOWER CASE CUSTOMER: ", lowerClientName);
        }

        setPhoneNumber((phone_number || cellphone).toString());
    }

    const handleCheckStatus = () => {
        setCheckStatus((prevStatus) => !prevStatus);
    }

    const saveComments = (comments: string) => {
        setComments(comments);
    };

    const submitTicket = async () => {
        let customerData = customer
        let supportNo;
    
        if (customer.includes(",")) {
            const customerArray = customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        
    
        try {
    
          //values notEntered
          const fields = [
            { value: customer, message: "Please select a client." },
            { value: problem, message: "Please select a problem." },
            { value: phonenumber, message: "Please enter the phone number." },
            { value: clientName, message: "Please enter the client name." },
            { value: emailAdd, message: "Please enter the clients email address." },
            { value: anydesk, message: 'Please enter the clients Anydesk.' }, // Escaped single quote
            { value: type, message: "Please select a call type." },
            { value: employee, message: "Please select an employee." },
            { value: comments, message: "Please enter any comments relevant to the Task/Error." },
            { value: priority, message: "Please determine the priority of the ticket." },
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

            //insert new Date with new format
            const ticketDate = format(
                new Date(),
                "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
            );
        
            const ticketData = {
                customer: customerData,
                problem: problem,
                time: ticketDate,
                phoneNumber: phonenumber,
                clientsAnydesk: anydesk,
                name: clientName,
                email_address: emailAdd,
                support_no: supportNo,
                empl: employee,
                logger: user ? `${user.emp_name}` : null,
                comments: comments,
                priority: priority, 
                issueType: issueType, 
                type: type,
            };
    
            const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, ticketData);
            console.log('Ticket submitted successfully:', response.data);
            logSuccessNotification();

            //Reset form fields
            setCustomer("");
            setProblem("");
            setPhoneNumber("");
            setClientName("");
            setEmailAdd("");
            setAnydesk("");
            setType("");
            setEmployee("");
            setPriority("");
            setComments("");
    
            onClose();
        } catch (error) {
            console.error('Error submitting ticket:', error);
            logErrorNotification();
        }
    };

    const logSuccessNotification = () => {
        toast.success('Ticket has been logged successfully', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const logErrorNotification = () => {
        toast.error('An error was encountered when logging the ticket', {
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
            <h1 className="dash-text text-2xl font-bold mb-6">Start Call</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <label htmlFor="customer" className="dash-text">Customer</label>
                    <div className="relative">
                        <select
                            className="call-input p-2 uppercase"
                            value={ customer }
                            onChange={(e) => setCustomer(e.target.value)}
                            >
                                <option value="" className="call-item">Select Customer</option>
                                    {allCustomers?.map(({ uid, Customer }) =>
                                        <option key={uid} value={Customer}>{Customer}</option>
                                    )}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="dash-text">Problem</label>
                    <div className="relative">
                        <select
                            className="call-input p-2 uppercase"
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
                    <input id="name" placeholder="Enter name" value={ clientName } className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setClientName(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone"  className="dash-text">Phone Number</label>
                    <input id="phone" placeholder="Enter phone number" value={ phonenumber } type="tel" className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="dash-text">Email Address</label>
                    <input id="email" placeholder="Enter the email address" value={ emailAdd } className="call-input rounded-md shadow-sm p-2" onChange={(e) => setEmailAdd(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="anydesk" className="dash-text">Clients Anydesk</label>
                    <input id="anydesk" placeholder="Enter Anydesk ID" value={ anydesk } className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setAnydesk(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="type" className="dash-text">Type</label>
                    <div className="relative">
                        <select
                            className="call-input p-2 uppercase"
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
                            className="call-input p-2 uppercase"
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
                            className="call-input p-2 uppercase"
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
                className="textarea-input rounded-md shadow-sm p-2 uppercase"
                onChange={(e) => saveComments(e.target.value)}
            />
            <div className="flex justify-between gap-2 mt-6">
                <button className="flex-1 cancel-detail" onClick={ onClose }>
                    <span>Cancel</span>
                </button>
                <button className="flex-1 save-detail" onClick={() => submitTicket()}>
                    <span>Save</span>
                </button>
            </div>
        </div>
    </div>
    )
}

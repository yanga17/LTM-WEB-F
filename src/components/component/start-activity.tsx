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
import { Checkbox } from "@/components/ui/checkbox"
import { DoorClosedIcon, MinimizeIcon, MaximizeIcon } from "@/components/component/ticket-solution"
import { useSession } from '@/context';


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

//interface for tbltime - TakeCall
interface TakeCallProps {
    Call_ID: number,
    Customer: string,
    Problem: string,
    Clients_Anydesk: number,
    Phone_Number: number,
    Time: string,
    EndTime: string,
    Duration: number,
    Taken: number,
    Support_No: number,
    Empl: string,
    logger: string,
    Comments: string,
    Solution: string,
    Name: string,
    urgent: number,
    IssueType: string,
    Type: string,
}

type TakeCallType = TakeCallProps[]

export function StartActivity({ onClose }: Props) {
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
    const [urgent, setUrgent] = useState(0);
    const [comments, setComments] = useState("");
    const [issueType, setIssueType] = useState("Problem");
    const [emailAdd, setEmailAdd] = useState("");

    const [tickets, setTickets] = useState("");
    const [checkStatus, setCheckStatus] = useState(false); //checkbos

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
            }});

            }} catch (error) {

                console.error('An error occurred while call types:', error);
    
        }
    }

    const activityNotification = () => {
        toast.success('Activity has been started', {
          icon: <Check color={colors.green} size={24} />,
          duration: 3000,
        });
    }

    const takeCall = async () => {
        let customerData = customer
        let supportNo = null;

        if (customer.includes(",")) {
            const customerArray = customer.split(",");
            customerData = customerArray[0].trim();
            supportNo = customerArray[1].trim();
        }

        try {
            const payLoad = {
                employee: employee,
                customer: customerData,
                activity: problem,
                phoneNumber: phonenumber,
                clientAnydesk: anydesk,
                startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                type: type,
                supportNo: supportNo,
                comments: comments,
                name: clientName,
                email_address: emailAdd,
                timeTaken: new Date().toISOString().slice(0, 19).replace('T', ' '),
                issueType: issueType,
        };

        //check if values have been entered/selected
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

        const response = await axios.post<TakeCallType>(`${apiEndPoint}/tickets/insertactiveticket`, payLoad);
        console.log('TAKE CALL BUTTON WORKS!!!!!!!!!!:', response.data);
        onClose();
        activityNotification();

        } catch (error) {
            console.error('Error starting an activity ticket:', error);
        }
    }

    const handleCheckStatus = () => {
    setCheckStatus((prevStatus) => !prevStatus);
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


    const submitTicket = async () => {
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

        //property names should be exactly like the ones declared in the backend routes
        const ticketData = {
            customer: customerData,
            problem: problem,
            time: dateTime,
            phoneNumber: phonenumber,
            clientsAnydesk: anydesk,
            name: clientName,
            support_No: supportNo, 
            empl: employee,
            logger: null, 
            comments: comments,
            priority: priority, 
            issueType: issueType, 
            type: type,
        };

        try {
            //http://localhost:4200/tickets/insertloggedticket
            const response = await axios.post(`${apiEndPoint}/tickets/insertloggedticket`, ticketData);
            console.log('Ticket submitted successfully:', response.data);
            console.log('my ticket type:', ticketData.support_No)
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

            activityNotification();
            onClose();
            } catch (error) {

                console.error('Error submitting ticket:', error);
            }
    }; 


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-200 rounded-lg shadow-md dark:border-gray-800 bg-white overlay">
                <div className="text-black flex items-center gap-2 justify-end">
                    <XIcon size={26} strokeWidth={2} color="red" onClick={onClose} />
                </div>
                <h1 className="text-black text-2xl font-bold mb-6">Start Activity</h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <label htmlFor="customer" className="text-black">Customer</label>
                        <div className="relative">
                            <select
                                className="text-black block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                value={customer}
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
                        <label className="text-black">Problem</label>
                        <div className="relative">
                        <select
                            className="text-black block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                        >
                            <option value="">Select Problem</option>
                            {allProblems?.map(({ idx, Errors }) =>
                                <option key={idx} value={Errors}>{Errors}</option>
                            )}
                        </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-black">Client Name</label>
                        <input id="name" placeholder="Enter name" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setClientName(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-black">Phone Number</label>
                        <input id="phone" placeholder="Enter phone number" type="tel" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setPhoneNumber(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-black">Email Address</label>
                        <input id="email" placeholder="Enter the email address" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setEmailAdd(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="anydesk" className="text-black">Clients Anydesk</label>
                        <input id="anydesk" placeholder="Enter Anydesk ID" className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black" onChange={(e) => setAnydesk(e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="type" className="text-black">Type</label>
                        <div className="relative">
                            <select
                                className="text-black block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="" className="text-black">Select Type</option>
                                {alltypes?.map(({ ID, Type }) =>
                                    <option key={ID} value={Type}>{Type}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employee" className="text-black">Employee</Label>
                        <div className="relative">
                            <select
                                className="text-black block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={employee}
                                onChange={(e) => setEmployee(e.target.value)}
                            >
                                <option value="" className="text-black">Select Employee</option>
                                    {allEmployees?.map(({ ID, Technician }) =>
                                        <option key={ID} value={Technician}>{Technician}</option>
                                    )}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="urgent" className="text-black">Priority</label>
                            <div className="relative">
                                <select
                                    className="text-black block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={priority}
                                    onChange={(e) => savePriority(e.target.value)}
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
                        <label htmlFor="comments" className="text-black">Comments</label>
                    </div>
                    <div className="flex items-center space-x-2 mt-6 mb-2">
                        <Checkbox id="task" checked={checkStatus} onClick={handleCheckStatus}/>
                            <label className="ml-2 text-sm text-black" htmlFor="task">
                                Task
                            </label>
                    </div>
                </div>
                <textarea id="comments" placeholder="Enter comments" className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-black h-20 text-top" onChange={(e) => saveComments(e.target.value)}/>
                <div className="flex justify-between gap-2 mt-6">
                    <Button className="flex-1 bg-red hover:bg-black text-white hover:text-white" variant="outline" onClick={ onClose }>Cancel</Button>
                    <Button className="flex-1 bg-green hover:bg-black text-white hover:text-white" variant="outline" onClick={ takeCall }>Save</Button>
                </div>
            </div>
        </div>
    )
}

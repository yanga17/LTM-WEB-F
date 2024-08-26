'use client'

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {useState, useEffect} from 'react';
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from '@/context';
import { XIcon } from "lucide-react";
import { X, Check  } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  Priority: string,
  IssueType: string,
  Type: string,
}

type TakeCallType = TakeCallProps[]

//customer combobox
// customer combobox item
// Custom command item for the dropdown list
const CustomCommandItem = ({ client, isSelected, onSelect }: any) => {
  if (!client) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => onSelect(client.Customer)} // Pass the customer name instead of UID
    >
      {client.Customer}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export function StartCall({ onClose}: Props) {
  const { user } = useSession();

  //storing data for input fields
  const [allCustomers, setAllCustomers] = useState<CustomerType>([]);
  const [allProblems, setAllProblems] = useState<ErrorsType>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);
  const [alltypes, setAllType] = useState<TypeErrors>([]);

  //inserting data into tables
  //const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [anydesk, setAnydesk] = useState("");
  const [type, setType] = useState("");
  const [employee, setEmployee] = useState("");
  const [priority, setPriority] = useState("");
  //const [urgent, setUrgent] = useState(0);
  const [comments, setComments] = useState("");
  const [issueType, setIssueType] = useState("Problem");
  const [emailAdd, setEmailAdd] = useState("");

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [customer, setCustomer] = React.useState<string>(""); // State to store the selected customer name

  const [tickets, setTickets] = useState("");
  const [checkStatus, setCheckStatus] = useState(false); //checkbox

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
  
      setAllEmployees(response?.data)
  
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

  const takeCall = async () => {
    let customerData = customer
    let supportNo = null;

    if (customer.includes(",")) {
      const customerArray = customer.split(",");
      customerData = customerArray[0].trim();
      supportNo = customerArray[1].trim();
    }
    

    try {
      const fields = [
        { value: customer, message: "Please select a client." },
        { value: problem, message: "Please select a problem." },
        { value: phonenumber, message: "Please enter the phone number." },
        { value: clientName, message: "Please enter the client name." },
        { value: emailAdd, message: "Please enter the clients email address." },
        { value: anydesk, message: "Please enter the clients Anydesk" }, 
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

      const ticketDate = format(
        new Date(),
        "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
      );

      const payLoad = {
        employee: employee,
        customer: customerData,
        activity: problem,
        phoneNumber: phonenumber,
        clientsAnydesk: anydesk,
        startTime: ticketDate,
        type: type,
        supportNumber: supportNo,
        comments: comments,
        name: clientName,
        email_address: emailAdd,
        issueType: issueType,
        priority: priority
      };

      const response = await axios.post<TakeCallType>(`${apiEndPoint}/tickets/insertactiveticket`, payLoad);
      console.log('Take Call:', response.data);
      onClose();
      TakeCallNotification();
  
    } catch (error) {
      console.error('Error taking ticket:', error);
    }
  }

  const handleCheckStatus = () => {
    setCheckStatus((prevStatus) => !prevStatus);
  }
  
  // Function to save comments
  const saveComments = (comments: string) => {
    setComments(comments);
  };

  const TakeCallNotification = () => {
    toast.success('Activity has been started successfully', {
      icon: <Check color={colors.green} size={24} />,
      duration: 3000,
    });
  }

  const LogTicketNotification = () => {
    toast.success('Ticket has been logged successfully', {
      icon: <Check color={colors.green} size={24} />,
      duration: 3000,
    });
  }

  // Customers combobox
  const handleSelect = (customerName: string) => {
    console.log(`Selected: ${customerName}`);
    setCustomer(customerName === customer ? "" : customerName);
    setOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = allCustomers.filter((client) =>
    client.Customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNewCustomer = () => {
    if (search.trim()) {
      setCustomer(search.trim());
      setOpen(false);
    } else {
      toast.error("Please enter a valid customer name.", {
        icon: '🚨',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  
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
    let customerData = customer
    let supportNo;

    if (customer.includes(",")) {
      const customerArray = customer.split(",");
      customerData = customerArray[0].trim();
      supportNo = customerArray[1].trim();
    }
    console.log("SUPPORT SUPPORT SUPPORT: " + supportNo)

    // Get the current time in MySQL format
    // const now = new Date();-

    //insert new Date with new format
    const ticketDate = format(
      new Date(),
      "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX"
    );


    //property names should be exactly like the ones declared in the backend routes
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

    try {

      //values notEntered
      const fields = [
        { value: customer, message: "Please select a client." },
        { value: problem, message: "Please select a problem." },
        { value: phonenumber, message: "Please enter the phone number." },
        { value: clientName, message: "Please enter the client name." },
        { value: emailAdd, message: "Please enter the clients email address." },
        { value: anydesk, message: "Please enter the clients Anydesk" }, 
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

      const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, ticketData);
      console.log('Ticket submitted successfully:', response.data);
      

      // try {
      //   await axios.post(`${apiEndPoint}/send-sms`, { clientName, phonenumber });
      //   toast.success('SMS has been sent to the client')

      // } catch (smsError) {
      //   console.error('Error sending SMS:', smsError);
      // }
      
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
      LogTicketNotification();
    } catch (error) {
      
      console.error('Error submitting ticket:', error);
    }
  }; 


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 border border-gray-200 rounded-lg shadow-md dark:border-gray-800 chart-background overlay">
        <div className="dash-text flex items-center gap-2 justify-end hover:cursor-pointer">
          <XIcon size={26} strokeWidth={2} color="red" onClick={onClose} />
        </div>
      <h1 className="dash-text text-2xl font-bold mb-6">Start Call</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="customer" className="dash-text">Customer</label>
          <div className="relative">
            {/* combobox */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="call-input shadow shadow-md chart-background justify-between truncate break-words uppercase"
                  >
                    {/* Convert the value to a number for comparison */}
                    {customer || "Select Customer"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 chart-background">
                  <Command>
                    <input
                      type="text"
                      placeholder="Search customer"
                      className="h-9 w-full px-2 call-input"
                      value={search}
                      onChange={ handleSearchChange }
                    />
                    <CommandList className="">
                    {filteredCustomers.length > 0 ? (
                  <CommandGroup>
                    {filteredCustomers.map((client) => (
                      <CustomCommandItem
                        key={client.uid}
                        client={client}
                        isSelected={customer === client.Customer}
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>
                    <div
                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-300"
                      onClick={handleAddNewCustomer}
                    >
                      Add "{search}" as a new customer
                    </div>
                  </CommandEmpty>
                )}
                    </CommandList>
                  </Command>
                </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <label className="dash-text">Problem</label>
            <div className="relative">
              <select
                className="call-input p-2 uppercase"
                value={problem}
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
            <label htmlFor="name" className="dash-text">Client Name</label>
            <input id="name" placeholder="Enter name" className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setClientName(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="dash-text">Phone Number</label>
            <input id="phone" placeholder="Enter phone number" type="tel" className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setPhoneNumber(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="dash-text">Email Address</label>
            <input id="email" placeholder="Enter the email address" className="call-input rounded-md shadow-sm p-2" onChange={(e) => setEmailAdd(e.target.value)}/>
          </div>
        <div className="space-y-2">
          <label htmlFor="anydesk" className="dash-text">Clients Anydesk</label>
          <input id="anydesk" placeholder="Enter Anydesk ID" className="call-input rounded-md shadow-sm p-2 uppercase" onChange={(e) => setAnydesk(e.target.value)}/>
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="dash-text">Type</label>
            <div className="relative">
              <select
                className="call-input p-2 uppercase"
                value={type}
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
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="" className="dash-text">Select Employee</option>
                  {allEmployees?.map(({ ID, Technician }) =>
                  <option key={ID} value={Technician}>{Technician}</option>
                )}
              </select>
              {/* <ComboboxDemo /> */}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="urgent" className="dash-text">Priority</label>
              <div className="">
                <select
                  className="call-input p-2 uppercase"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="" className="option-item">Determine Priority</option>
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
        <div className="flex items-center space-x-2 mt-6 mb-2 dash-text">
          <Checkbox 
            id="task" 
            checked={checkStatus} 
            onClick={handleCheckStatus}
            />
            <label className="ml-2 text-sm dash-text" htmlFor="task">
              Task
            </label>
        </div>
      </div>
      <textarea 
        id="comments" 
        placeholder="Enter comments" 
        className="textarea-input rounded-md shadow-sm p-2 uppercase" 
        onChange={(e) => saveComments(e.target.value)}
      />
      <div className="flex justify-between gap-2 mt-6">
        <button className="flex-1 view-detail" onClick={ takeCall }>
          <span>Take Call</span>
        </button>
        <button className="flex-1 cancel-detail" onClick={ onClose }>
          <span>Cancel</span>
        </button>
        <button className="flex-1 save-detail" onClick={ submitTicket }>
          <span>Save</span>
        </button>
      </div>
      </div>
    </div>
  )
}
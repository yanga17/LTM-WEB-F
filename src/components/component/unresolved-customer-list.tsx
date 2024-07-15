"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';

//interface for the customer list
interface UnresolvedFollowUpProps {
    ID: number,
    Customer: string,
    name: string,
    Email_Address: null,
    Phone_Number: number,
    EndTime: string
}
type UnresolvedResponse = UnresolvedFollowUpProps[]


//interface for starting a followUp
interface FollowUpsProps {
  idx: number,
  ID: number,
  Employee: string,
  Customer: string,
  Activity: string,
  Phone_Number: number,
  StartTime: string,
  EndTime: string,
  Duration: number,
  Type: string,
  Solution: string,
  Support_No: number,
  Comments: string,
  FollowUp: number,
  Completed: number,
  name: string,
  Clients_Anydesk: number,
  NumberOfDays: number,
  IssueType: string,
  Priority: number
}

type FollowUpsType = FollowUpsProps[]


export function UnresolvedCustomerList() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      companyName: "Acme Inc.",
      name: "John Doe",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      lastContacted: "2023-05-15",
    },
    {
      id: 2,
      companyName: "Globex Corporation",
      name: "Jane Smith",
      email: "jane@globex.com",
      phone: "+1 (555) 987-6543",
      lastContacted: "2023-04-20",
    },
    {
      id: 3,
      companyName: "Stark Industries",
      name: "Bob Johnson",
      email: "bob@stark.com",
      phone: "+1 (555) 555-5555",
      lastContacted: "2023-03-01",
    },
    {
      id: 4,
      companyName: "Wayne Enterprises",
      name: "Sarah Lee",
      email: "sarah@wayne.com",
      phone: "+1 (555) 111-2222",
      lastContacted: "2023-02-10",
    },
    {
      id: 5,
      companyName: "Umbrella Corporation",
      name: "Tom Wilson",
      email: "tom@umbrella.com",
      phone: "+1 (555) 333-4444",
      lastContacted: "2023-01-25",
    },
  ])

  const [unresolvedCustomers, setUnresolvedCustomers] = useState<UnresolvedResponse>([])

  const handleFollowUp = (customerId: any) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId))
  }

  const getUnresolvedFollowUps = async () => {
    try {
      const url = `followups/getunresolvedtickets`
      const response = await axios.get<UnresolvedResponse>(`${apiEndPoint}/${url}`);
      setUnresolvedCustomers(response?.data);
      console.log("GETTING THE UNRESOLVED CUSTOMERS WAS SUCCESSFUL")
    } catch (error) {
      console.error("Error fetching unresolved follow-ups:", error)
    }
  }

  const getCurrentDateTimeString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


const startFollowUp = async (id: any) => {
  const selectedTicket = unresolvedCustomers?.find(ticket => ticket.ID === id);
  console.log("Selected Ticket:", selectedTicket);

      try {
          const response = await axios.post(`${apiEndPoint}/followups/startunresolvedfollowup/${id}`);
          if (response.status === 200) {
              toast.success('Follow-Up has been started successfully.');

          } else {
              toast.error('An error occurred while starting the follow-up.');
          }
      } catch (error) {
          toast.error('An error occurred while starting the follow-up.');
          console.log("An error occurred while starting the follow-up:", error)
      }
  }
    

  useEffect(() => {
      getUnresolvedFollowUps();
  }, [])

  const activecheckInLog = unresolvedCustomers?.map((property) => ({
    id: property?.ID,
    customer: property?.Customer,
    name: property?.name,
    email: property?.Email_Address,
    phone: property?.Phone_Number,
    endtime: new Date(property.EndTime?.slice(0, 19).replace('T', ' ')).toLocaleString(),
}))

  return (
    <div className="bg-white w-full h-screen overflow-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Unresolved Customers</h1>
        <div className="grid gap-6">
          {activecheckInLog?.map(({ id, customer, name, email, phone, endtime }, index) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle>{customer || '--:--'}</CardTitle>
                <CardDescription>
                  <div className="font-medium">{name || '--:--'}</div>
                  {email || 'no available email address'}
                  <div className="text-muted-foreground">{phone || '--:--'}</div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Last contacted: <span className="text-red">{endtime}</span></p>
                  <Button className="bg-purple text-white hover:bg-black hover:text-white hover:cursor-pointer" size="sm" onClick={() => startFollowUp(id)}>
                    Start Follow-Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

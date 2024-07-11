"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UnresolvedFollowUpsList() {
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

  const handleFollowUp = (customerId: any) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId))
  }

  return (
    <div className="w-full px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Uncontacted Customers</h1>
      <div className="grid gap-6">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <CardTitle>{customer.companyName}</CardTitle>
              <CardDescription>
                <div className="font-medium">{customer.name}</div>
                {customer.email}
                <div className="text-muted-foreground">{customer.phone}</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Last contacted: {customer.lastContacted}</p>
                <Button variant="secondary" size="sm" onClick={() => handleFollowUp(customer.id)}>
                  Mark as Followed Up
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

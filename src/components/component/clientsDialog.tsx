'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { Bell, User } from "lucide-react";

interface ClientsTotal {
    TotalClients: number
}
type ClientsResonse = ClientsTotal[]

export function ClientsDialog() {
    const [clientsTotal, setClientsTotal] = useState<ClientsResonse>([])

    const getClientTotal = async () => {
        try {
            const url = `customers/getcustomerstotal`
            const response = await axios.get(`${apiEndPoint}/${url}`)
            setClientsTotal(response?.data)
        } catch (error) {
            console.error("Error clients total", error)
        }
    };
    
    
    useEffect(() => {
        getClientTotal();
    }, [])


    return (
        <Dialog>
            {clientsTotal.map((summary, index) => (
                <DialogTrigger asChild key={index}>
                    <Button variant="outline" className="dialog-background text-black">
                        <User size={22} strokeWidth={2} color="#a17efa" className="mr-2" />Clients Summary&apos;s
                            <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-medium font-medium text-secondary-foreground">
                                {summary.TotalClients}
                            </span>
                    </Button>
                </DialogTrigger>
            ))}
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="dialog-text">Clients Summary</DialogTitle>
                        {clientsTotal.map((summary, index) => (
                            <DialogDescription key={index} className="dialog-text">
                                You have {summary.TotalClients} total clients within the company.
                            </DialogDescription>
                        ))}
                </DialogHeader>
                <DialogClose asChild>
                    <div className="flex justify-end">
                        <button className="inline-flex h-10 items-center justify-center rounded-md bg-purple text-white px-6 text-sm font-medium text-primary-foreground shadow hover:cursor-pointer hover:bg-black hover:text-white">
                            Close
                        </button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

function BellIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}


function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { PencilRuler } from "lucide-react";
import { UnresolvedCustomerList } from "@/components/component/unresolved-customer-list"

interface FollowUpsTotal {
  FollowUpsTotal: number;
}
type FollowUpsResonse = FollowUpsTotal[]

export function UnresolvedFollowUps() {
  const [followUpsTotal, setFollowUpsTotal] = useState<FollowUpsResonse>([])
  const [followUpCustomerList, setFollowUpCustomerList] = useState(false);

  const getFollowUpsTotal = async () => {
    try {
      const url = `followups/getunresolvedticketstotal`
      const response = await axios.get(`${apiEndPoint}/${url}`)
        setFollowUpsTotal(response?.data)
    } catch (error) {
      console.error("Error fetching follow ups total", error)
    }

  };

  useEffect(() => {
    getFollowUpsTotal()
  }, [])


  return (
    <Dialog defaultOpen>
      {followUpsTotal.map((summary, index) => (
      <DialogTrigger asChild key={index}>
        <Button variant="outline" className="bg-white text-black">
          <BellIcon className="w-5 h-5 mr-2" />Unresolved Follow-Up's
          <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {summary.FollowUpsTotal}
          </span>
        </Button>
      </DialogTrigger>
      ))}
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unresolved Customer Tickets</DialogTitle>
          {followUpsTotal.map((summary, index) => (
            <DialogDescription key={index}>You have {summary.FollowUpsTotal} unresolved customer tickets that need to be followed up.</DialogDescription>
          ))}
        </DialogHeader>
        <div className="flex justify-end">
          <Link
            href="follow-ups/unresolved" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple text-white px-6 text-sm font-medium text-primary-foreground shadow hover:cursor-pointer hover:bg-black hover:text-white"
            onClick={() => setFollowUpCustomerList(true)}
          >
            View Tickets
          </Link>
        </div>
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

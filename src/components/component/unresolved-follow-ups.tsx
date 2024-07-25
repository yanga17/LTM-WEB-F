'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';

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
    <Dialog>
      {followUpsTotal.map((summary, index) => (
      <DialogTrigger asChild key={index}>
        <Button variant="outline" className="dialog-background text-black">
        <BellIcon size={22} strokeWidth={2} color="#a17efa" className="mr-2" />Unresolved Follow-Up&apos;s
          <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-medium font-medium text-secondary-foreground">
            {summary.FollowUpsTotal}
          </span>
        </Button>
      </DialogTrigger>
      ))}
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="dialog-text">Unresolved Customer Tickets</DialogTitle>
          {followUpsTotal.map((summary, index) => (
            <DialogDescription key={index} className="dialog-text">
              You have <span className="text-red">{summary.FollowUpsTotal}</span> unresolved customer tickets that need to be followed up.
            </DialogDescription>
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

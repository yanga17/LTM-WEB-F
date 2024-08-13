'use client'

import * as React from "react";
import { useState, useEffect } from 'react';
import { TicketsModule } from "@/modules";
import { ActiveTicketsModule } from "@/modules";
import {  CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { StartCall } from "@/components/component/start-call";
import { StartActivity } from "@/components/component/start-activity";
import { useRouter } from 'next/navigation';
import { HoverCard } from "@/components/component/hoverCard";
import { SummaryCard } from "@/components/component/summaryCard";
import { PhoneIcon, ActivityIcon } from "lucide-react";
import { SheetSide } from "@/components/component/navigation-button";
import AppWrapper from '@/layout/mainLayout'; // Import the AppWrapper component

export default function Home() {
  const [startCallPopup, setStartCallPopup] = useState(false);
  const [startActivityPopup, setStartActivityPopup] = useState(false);
  const [navVisible, setNavVisible] = useState(false); // State to manage navigation visibility
  const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track screen size

  const router = useRouter();

  const toggleStartCall = () => {
    setStartCallPopup(!startCallPopup);
  }

  const toggleStartActivity = () => {
    setStartActivityPopup(!startActivityPopup);
  }

  const toggleNavigation = () => {
    setNavVisible(!navVisible); // Toggle navigation visibility
  }

  // Use effect to update screen size state
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSmallScreen(screenWidth < 1024); // Consider screens smaller than 1024px (lg breakpoint) as small/medium
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="pg-background">
    <div className="h-screen w-full mb-6 overflow-auto">
    <header className="text-gray-50 px-5 py-0 mt-4 flex justify-between">
      <div className="flex sm:flex-wrap sm:gap-2 md:flex-wrap md:gap-2 lg:gap-4">
            <HoverCard />
            <SummaryCard /> 
      </div>
      <div className="pt-6 sm:block md:block lg:hidden">
          <SheetSide />
      </div>
    </header>
    <div className="grid gap-6 w-full">
        <div className="max-h-[600px] overflow-auto">
          <div className="flex justify-between mt-6">
            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Active Tickets</h6>
              <div className="pr-4 pt-4">
                <button
                  onClick={toggleStartCall}
                  className="start-call mr-2"
                >
                  <span>Start Call</span>
                  <PhoneIcon size={18} strokeWidth={2} className="ml-2" />
                </button>
                {startCallPopup && <StartCall onClose={toggleStartCall} />}
                <button
                  onClick={toggleStartActivity}
                  className="start-activity"
                >
                  <span>Start Activity</span>
                  <ActivityIcon size={18} strokeWidth={2} className="ml-2" />
                </button>
                {startActivityPopup && <StartActivity onClose={toggleStartActivity} />}
              </div>
          </div>
            <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
              <div className="max-h-[350px] overflow-auto table-container">
                <table className="w-full table-fixed">
                  <thead className="table-headerup">
                    <tr className="bg-gray text-left h-10 p-2 text-md sm:text-sm md:text-md font-medium border-rounded rounded-full">
                      <th className="p-2 w-[80px] sm:w-[60px] md:w-[70px] lg:w-[70px] xl:w-[80px]">Call ID</th>
                      <th className="p-2 w-[180px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[220px]">Customer</th>
                      <th className="p-2 w-[100px] sm:w-[100px] md:w-[115px] lg:w-[140px] xl:w-[160px]">Problem</th>
                      <th className="p-2 w-[100px] hidden lg:table-cell lg:w-[120px] xl:w-[150px]">Client Name</th>
                      <th className="p-2 w-[140px] sm:w-[120px] md:w-[110px] lg:w-[140px] xl:w-[170px]">Time</th>
                      <th className="p-2 w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px] xl:w-[80px]">Employee</th>
                      <th className="p-2 w-[90px] sm:w-[105px] md:w-[100px] lg:sm:w-[120px] xl:w-[102px] 2xl:w-[80px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ActiveTicketsModule />
                  </tbody>
                </table>
              </div>
            </CardContent>
        </div>
        <div className="max-h-[600px] overflow-auto">
        <div>
            <h6 className="ml-6 text-3xl py-4 font-bold header-text">Logged Tickets</h6>
          </div>
            <CardContent className="p-0 ml-4 mr-4 shadow-md border rounded-sm">
              <div className="max-h-[250px] overflow-auto table-container">
                <table className="w-full table-fixed p-4">
                  <thead className="table-headerup">
                    <tr className="bg-gray text-left h-10 p-2 text-md sm:text-sm md:text-md font-medium border-rounded rounded-full">
                      <th className="p-2 w-[80px] sm:w-[60px] md:w-[70px] lg:w-[70px] xl:w-[80px]">Call ID</th>
                      <th className="p-2 w-[180px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[220px]">Customer</th>
                      <th className="p-2 w-[100px] sm:w-[100px] md:w-[115px] lg:w-[140px] xl:w-[160px]">Problem</th>
                      <th className="p-2 w-[100px] hidden lg:table-cell lg:w-[120px] xl:w-[150px]">Client Name</th>
                      <th className="p-2 w-[140px] sm:w-[120px] md:w-[110px] lg:w-[140px] xl:w-[170px]">Time</th>
                      <th className="p-2 w-[60px] sm:w-[70px] md:w-[80px] lg:w-[90px] xl:w-[80px]">Employee</th>
                      <th className="p-2 w-[90px] sm:w-[105px] md:w-[100px] lg:sm:w-[120px] xl:w-[102px] 2xl:w-[80px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="mb-4">
                    <TicketsModule />
                  </tbody>
                </table>
              </div>
            </CardContent>
        </div>
      </div> 
    </div>
    </div>
  );
}

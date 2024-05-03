'use client'

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/context";
import { colors } from "@/utils/colors";
import { usePathname } from 'next/navigation';
import { CalendarClock, LayoutDashboard, X } from "lucide-react";

//import logo from "/public/images/LTM logo@3x.png";
import logo from "../../../../../../public/images/LTM logo@3x.png";
import Image from 'next/image';

export const Navigation = () => {
  const { user } = useSession();
  const pathname = usePathname();

  const { logout } = useSession();

  const MobileNavigation = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleVisibility = () => setIsOpen(!isOpen);

    if (!user) {
      return;
    }
    const { role } = user

    return (
      <div className={`lg:hidden flex relative p-4 ${pathname === '/' ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <div className="w-full items-center justify-between flex">
          <p className="uppercase font-medium text-sm">TrainLog</p>
          <LayoutDashboard size={25} strokeWidth={1.5} color={pathname === '/' ? colors?.black : colors?.white} className="cursor-pointer" onClick={toggleVisibility} />
        </div>
        {isOpen &&
          <div className="absolute top-0 left-0 bottom-0 right-0 w-full bg-black-light mx-auto h-screen flex items-center justify-center">
            <div className="text-white bg-black-dark rounded w-11/12 h-1/2 relative">
              <X size={40} strokeWidth={1.5} color={colors?.red} className="cursor-pointer absolute top-2 right-2" onClick={toggleVisibility} />
              <ul className="w-full h-full flex flex-col items-center justify-center gap-4">
                {
                  role === 'Admin' &&
                  <li>
                    <Link href='/'>Home</Link>
                  </li>
                }
                <li>
                  <Link href='/check-in'>Attend</Link>
                </li>
                <li>
                  <button className="text-sm font-medium uppercase rounded bg-red text-white w-full py-2 px-10" onClick={logout}>Logout</button>
                </li>
              </ul>
              <p className="absolute uppercase text-xs w-full text-center bottom-2">Powered by <Link target='__blank' href='https://www.legendsystems.co.za/' className="text-purple">Legend Systems</Link></p>
            </div>
          </div>
        }
      </div>
    )
  }

  const DesktopNavigation = () => {
    if (!user) {
      return;
    }
    const { role } = user

    return (
      <div className="hidden lg:flex flex-col justify-between gap-1 h-full w-full bg-white rounded py-4">
        {/* <div className="mt-5">
          <Image
          alt="Logo"
          className="rounded-full"
          height={300}
          src={logo}
          width={400}
          />
        </div> */}
        <ul className="flex flex-col justify-between gap-2 w-full">
          {
            role === 'Admin' &&
            <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
              <LayoutDashboard size={25} strokeWidth={1} color={pathname === '/' ? colors?.purple : colors?.white} />
              <Link href='/' className="text-sm font-medium text-black-dark group-hover:text-purple" >Home</Link>
            </li>
          }
          <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
            <CalendarClock size={25} strokeWidth={1} color={pathname === '/' ? colors?.purple : colors?.white} />
            <Link href='/check-in' className="text-sm font-medium text-black-dark group-hover:text-purple">Attend</Link>
          </li>
        </ul>
        <button className="gap-2 flex items-center justify-center w-10/12 mx-auto rounded p-2 bg-red text-white" onClick={logout}>
          <span className="text-white font-medium uppercase text-xs">Logout</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <MobileNavigation />
      <DesktopNavigation />
    </>
  )
}

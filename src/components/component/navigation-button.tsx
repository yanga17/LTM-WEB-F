import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { useSession } from "@/context";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, LayoutDashboard, CalendarClock, LayoutList, Trash2, Speech, FilePieChart, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Toggler } from "@/components/component/toggler";
import { colors } from "@/utils/colors";

const SHEET_SIDES = ["left"] as const;
type SheetSide = (typeof SHEET_SIDES)[number];

export function SheetSide() {
  const { user } = useSession();
  const pathname = usePathname();

  const { logout } = useSession();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }

    const handleStorageChange = (event: any) => {
      if (event.key === "theme" && event.newValue) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === "dark");
  }, [theme]);

  const [isOpen, setIsOpen] = useState(false); // State to manage sheet open/close

  if (!user) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="flex self-end -right-10">
              <button className="hover:cursor-pointer">
                <Menu size={40} color={colors?.purple} className="ml-8"/>
              </button>
            </div>
          </SheetTrigger>
          <SheetContent
            side={side}
            className="lg:w-[12.33%] w-full h-full pg-background" // Match Navigation's width and height
          >
            <div className="lg:flex flex-col justify-between gap-1 h-full pg-background rounded py-4 lg:w-[100%]">

              {/* Close Button */}
              <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                <X size={28} color={colors?.red} />
              </button>


              <ul className="flex flex-col justify-between gap-2 w-full">
                {theme === 'dark' ? (
                  <Image
                    src="/covers/Banner.png"
                    alt="Banner"
                    width={400}
                    height={400}
                    className="m-0 p-5 h-20px"
                  />
                ) : (
                  <Image
                    src="/covers/legendSystems.png"
                    alt="Legend Systems"
                    width={400}
                    height={400}
                    className="m-0 p-5 h-20px"
                  />
                )}
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <LayoutDashboard size={25} strokeWidth={1} color={pathname === '/' ? colors?.purple : colors?.black} />
                  <Link href='/' className="nav-text text-md font-medium text-black-dark group-hover:text-purple">Home</Link>
                </li>
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <CalendarClock size={25} strokeWidth={1} color={pathname === '/customers' ? colors?.purple : colors?.black} />
                  <Link href='/customers' className="nav-text dark:dark-nav-text text-md font-medium text-black-dark group-hover:text-purple">Customers</Link>
                </li>
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <LayoutList size={25} strokeWidth={1} color={pathname === '/dashboard' ? colors?.purple : colors?.black} />
                  <Link href='/dashboard' className="nav-text text-md font-medium text-black-dark group-hover:text-purple">Dashboard</Link>
                </li>
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <FilePieChart size={25} strokeWidth={1} color={pathname === '/reports' ? colors?.purple : colors?.black} />
                  <Link href='/reports' className="nav-text text-md font-medium text-black-dark group-hover:text-purple">Reports</Link>
                </li>
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <Trash2 size={25} strokeWidth={1} color={pathname === '/deletedlogs' ? colors?.purple : colors?.black} />
                  <Link href='/deletedlogs' className="nav-text text-md font-medium text-black-dark group-hover:text-purple">Deleted Logs</Link>
                </li>
                <li className="m-0 p-2 flex items-center justify-start gap-1 uppercase cursor-pointer hover:bg-white ease-in-out duration-500 rounded group w-11/12 mx-auto">
                  <Speech size={25} strokeWidth={1} color={pathname === '/follow-ups' ? colors?.purple : colors?.black} />
                  <Link href='/follow-ups' className="nav-text text-md font-medium text-black-dark group-hover:text-purple">Follow-Ups</Link>
                </li>
              </ul>
              <div className="flex flex-col items-center justify-center w-10/12 gap-6 pt-96">
                <Toggler />
                <button className="gap-2 flex items-center justify-center w-10/12 mx-auto rounded p-2 bg-red text-white" onClick={logout}>
                  <span className="text-white font-medium uppercase text-xs">Logout</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

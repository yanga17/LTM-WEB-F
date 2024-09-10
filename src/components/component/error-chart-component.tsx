import { Activity, CookingPot } from "lucide-react";

export function ErrorChartComponent() {
  return (
    <div className="">
      <div className="bg-red w-[700px] h-[200px] rounded-lg p-8 text-center">
        <TriangleAlertIcon className="h-12 w-12 mx-auto text-white dark:text-gray-50" />
        <h3 className="text-2xl font-bold mt-4 text-white dark:text-gray-50">No Data Available</h3>
        <p className="text-base text-white mt-2 dark:text-gray-50 uppercase">
          An error was encountered when fetching chart data. Please Refresh!
        </p>
      </div>
    </div>
  )
}

export function EmptyChartComponent() {
  return (
    <div className="">
      <div className="bg-green w-[700px] h-[200px] rounded-lg p-8 text-center">
        <CookingPot size={44} strokeWidth={2} className="mx-auto text-white dark:text-gray-50" />
        <h3 className="text-2xl font-bold mt-4 text-white dark:text-gray-50">No Available Data</h3>
        <p className="text-base text-white mt-2 dark:text-gray-50 uppercase">
          Please adjust the selected date periods!
        </p>
      </div>
    </div>
  )
}

function TriangleAlertIcon(props: any) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

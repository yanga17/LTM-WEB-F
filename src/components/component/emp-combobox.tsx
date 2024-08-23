"use client"

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiEndPoint } from '@/utils/colors'; // Removed unused colors import

interface EmployeeProps {
  ID: number;
  Technician: string;
}
type EmployeeType = EmployeeProps[]

const CustomCommandItem = ({ employee, isSelected, onSelect }: any) => (
  <div
    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    onClick={() => onSelect(employee.ID.toString())} // Ensure ID is passed as a string
  >
    {employee.Technician}
    <CheckIcon
      className={cn(
        "ml-auto h-4 w-4",
        isSelected ? "opacity-100" : "opacity-0"
      )}
    />
  </div>
)

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(""); // Ensure value is a string
  const [search, setSearch] = React.useState("");
  const [allEmployees, setAllEmployees] = useState<EmployeeType>([]);

  const generateEmployees = async () => {
    try {
      const url = `tickets/getemployees`
      const response = await axios.get<EmployeeType>(`${apiEndPoint}/${url}`);
      setAllEmployees(response.data);
      if (response.data.length === 0) {
        toast.error(`No data available for employees.`, {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error('An error occurred while fetching employees:', error);
    }
  }

  const handleSelect = (employeeValue: string) => {
    console.log(`Selected: ${employeeValue}`)
    setValue(employeeValue === value ? "" : employeeValue)
    setOpen(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const filteredEmployees = allEmployees.filter((employee) =>
    employee.Technician.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    generateEmployees()
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-[56px] chart-background justify-between"
        >
          {/* Convert the value to a number for comparison */}
          {value
            ? allEmployees.find((employee) => employee.ID.toString() === value)?.Technician
            : "Select employee..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 chart-background">
        <Command>
          <input
            type="text"
            placeholder="Search employee..."
            className="h-9 w-full px-2 call-input"
            value={search}
            onChange={handleSearchChange}
          />
          <CommandList className="call-item">
            {filteredEmployees.length > 0 ? (
              <CommandGroup>
                {filteredEmployees.map((employee) => (
                  <CustomCommandItem
                    key={employee.ID}
                    employee={employee}
                    isSelected={value === employee.ID.toString()} // Convert ID to string for comparison
                    onSelect={handleSelect}
                  />
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No employee found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
"use client"

import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandList, CommandItem } from "@/components/ui/command"

export function ComboboxDemo() {
  const customers = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Davis",
    "David Wilson",
    "Sarah Lee",
    "Christopher Brown",
    "Olivia Taylor",
    "Daniel Anderson",
    "Sophia Martinez",
  ]
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-56 justify-between"
          role="combobox"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          {selectedCustomer}
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <ScrollArea className="max-h-[200px]">
          <Command>
            <CommandList>
              {customers.map((customer) => (
                <CommandItem
                  key={customer}
                  onSelect={() => setSelectedCustomer(customer)}
                  className={selectedCustomer === customer ? "bg-muted" : ""}
                >
                  {customer}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function ChevronsUpDownIcon(props: any) {
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
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
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

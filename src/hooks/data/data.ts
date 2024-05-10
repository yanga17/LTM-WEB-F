'use client'

import { apiEndPoint } from "@/utils/colors"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

//interface for getcustomers
interface CustomerProps {
    Customer: string;
}

type CustomerType = CustomerProps[]

export const Customers = () => {
    const [customers, setCustomers] = useState<CustomerType>()

    const getCustomers = async () => {
        try {
            const url = `/tickets/getcustomers`
            const customers = await axios.get(`${apiEndPoint}/${url}`)

            if (customers?.data) {
                setCustomers(customers?.data)
            }
            else {
                toast(``,
                    {
                        icon: '🔄',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }
        catch (error) {
            toast(``,
                {
                    icon: '🔄',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    useEffect(() => {
        getCustomers();
        console.log("GRABBED CUSTOMERS FROM DATA PAGE", customers);

        //const intervalId = setInterval(getCustomers, 2000);

        //return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return customers
}

//interface for gettinErrors
interface ErrorProps {
    Errors: string;
}

type ErrorsType = ErrorProps[]

export const Problems = () => {
    const [problems, setProblems] = useState<ErrorsType>()

    const getProblems = async () => {
        try {
            const url = `/tickets/geterrors`
            const problems = await axios.get(`${apiEndPoint}/${url}`)

            if (problems?.data) {
                setProblems(problems?.data)
            }
            else {
                toast(``,
                    {
                        icon: '🔄',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }
        catch (error) {
            toast(``,
                {
                    icon: '🔄',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    useEffect(() => {
        getProblems()

        //const intervalId = setInterval(getManagers, 2000);

        //return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return problems //'/getemployees', '/getypes'
}
//interface for gettinEmployees
interface EmployeeProps {
    Employee: string;
}

type EmployeeType = EmployeeProps[]

export const Employees = () => {
    const [employees, setEmployees] = useState<EmployeeType>()

    const getEmployees = async () => {
        try {
            const url = `/tickets/getemployees`
            const employees = await axios.get(`${apiEndPoint}/${url}`)

            if (employees?.data) {
                setEmployees(employees?.data)
            }
            else {
                toast(``,
                    {
                        icon: '🔄',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }
        catch (error) {
            toast(``,
                {
                    icon: '🔄',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    useEffect(() => {
        getEmployees();
        console.log("GRABBED Employees FROM DATA PAGE", employees);

        //const intervalId = setInterval(getEmployees, 2000);

        //return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return employees
}
//interface for gettinTypes
interface TypesProps {
    Type: string;
}

type TypeErrors = TypesProps[]

export const Types = () => {
    const [type, setType] = useState<TypeErrors>()

    const getTypes = async () => {
        try {
            const url = `/tickets/getypes`
            const type = await axios.get(`${apiEndPoint}/${url}`)

            if (type?.data) {
                setType(type?.data)
            }
            else {
                toast(``,
                    {
                        icon: '🔄',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }
        catch (error) {
            toast(``,
                {
                    icon: '🔄',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
    }

    useEffect(() => {
        getTypes();
        console.log("GRABBED Types FROM DATA PAGE", type);

        //const intervalId = setInterval(getEmployees, 2000);

        //return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return type
}
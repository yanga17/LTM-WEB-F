'use client'

import * as React from "react"
import {useState, useEffect} from 'react'
import { useQuery } from "@/hooks/useQuery";

import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { toast } from "react-hot-toast"


export function SolutionModule() {
    const [solution, setSolution] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [followUp, setFollowUp] = useState(0);
    const [completed, setCompleted] = useState(0);

    //const url = '/updateactivesolution'
    //const response = await axios.post(`${apiEndPoint}/tickets/insertcallticket`, ticketData);

    //handele's followUp x numberOfDays
    switch (numberOfDays) {
        case 1:
            setFollowUp(1);
            break;
        case 2:
            setFollowUp(2);
            break;
        case 3:
            setFollowUp(3);
            break;
        case 4:
            setFollowUp(4);
            break;
        case 5:
            setFollowUp(5);
            break;
        default:
            setFollowUp(0);
            break;
    }

    //handele's followUp x completed
    switch (followUp) {
        case 1:
            setCompleted(1);
            break;
        default:
            setCompleted(0);
            break;
    }



    return (
        <div></div>//JSX code
    );
}
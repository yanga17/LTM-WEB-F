'use client'

import * as React from "react"
import {useState, useEffect, useRef} from 'react'
import { apiEndPoint, colors } from '@/utils/colors';
import axios from 'axios';
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Minimize2, Check, Trash2, PhoneOutgoing, PencilRuler } from "lucide-react";


export function StyledCard(){


    return (
        <div className="ag-courses_item">
            <a className="ag-courses-item_link" href="#">
                <div className="ag-courses-item_bg"></div>
                    <div className="ag-courses-item_title">Logged Tickets</div>
                    <div className="ag-courses-item_date-box">Start:
                    <span className="ag-courses-item_date"> 14.11.2023 </span>
                    </div>
            </a>
        </div>
    )
}

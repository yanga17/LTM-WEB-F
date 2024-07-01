'use client'

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CustomerCallsResponse } from '../../modules/dashboard/dashboardModule';


interface props {
    customerCallsData: CustomerCallsResponse;
}

export const CustomerCallsComponent = ({ customerCallsData }: props) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={customerCallsData} margin={{ right: 40, top: 20, bottom: 20}}>
                <XAxis dataKey="Customer"/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend />
                <Bar 
                    type="monotone"
                    dataKey="CallCount"
                    stroke="#2563eb"
                    fill="#3b82f6"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
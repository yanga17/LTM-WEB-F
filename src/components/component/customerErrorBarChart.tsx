'use client'

import { BarChart, Bar, ResponsiveContainer, Label, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CustomerResponse } from '../../modules/dashboard/dashboardModule';

interface props {
    customerData: CustomerResponse;
}

export const CustomerErrorComponent = ({ customerData }: props) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={customerData} margin={{ right: 40, top: 20, bottom: 20}}>
                <XAxis dataKey="Customer"/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend />
                <Bar 
                    type="monotone"
                    dataKey="Error"
                    stroke="#2563eb"
                    fill="#3b82f6"
                />

                <Bar 
                    type="monotone"
                    dataKey="ErrorCount"
                    stroke="#7c3aed"
                    fill="#8b5cf6"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
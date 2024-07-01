'use client'

import { BarChart, Bar, ResponsiveContainer, Label, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EmployeeResponse } from '../../modules/dashboard/dashboardModule';

interface props {
    employeeData: EmployeeResponse;
}

export const BarChartComponent = ({ employeeData }: props) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={employeeData} margin={{ right: 40, top: 20, bottom: 20}}>
                <XAxis dataKey="name"/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend />
                <Bar 
                    type="monotone"
                    dataKey="Tasks"
                    stroke="#2563eb"
                    fill="#3b82f6"
                />

                <Bar 
                    type="monotone"
                    dataKey="Errors"
                    stroke="#7c3aed"
                    fill="#8b5cf6"
                />

                <Bar
                    type="monotone"
                    dataKey="Overall"
                    stroke="#00d384"
                    fill="#00d384"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
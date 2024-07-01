'use client'

import { BarChart, Bar, ResponsiveContainer, Label, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EmployeeTasksResponse } from '../../modules/dashboard/dashboardModule';

interface props {
    employeeTasksData: EmployeeTasksResponse;
}

export const EmployeeTaskComponent = ({ employeeTasksData }: props) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={employeeTasksData} margin={{ right: 40, top: 20, bottom: 20}}>
                <XAxis dataKey="Task"/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend />
                <Bar 
                    type="monotone"
                    dataKey="TasksCount"
                    stroke="#D4D4D4"
                    fill="#00d384"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
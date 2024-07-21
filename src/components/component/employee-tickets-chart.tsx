'use client'

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EmployeeWeeklyResponse } from '../../modules/dashboard/dashboardModule';


interface props {
  weeklyData: EmployeeWeeklyResponse;
}

export const formatNumericalValue = (number: number): string => {
    const absNumber = Math.abs(number);
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixIndex = Math.floor((absNumber.toFixed(0).length - 1) / 3);
    const formattedNumber = (number / Math.pow(1000, suffixIndex)).toFixed(1);
    return `${formattedNumber}${suffixes[suffixIndex]}`;
};

export const EmployeeWeeklyChart = ({ weeklyData }: props) => {
    const ItalizeLabels = (props: any) => {
        const { x, y, payload } = props;
        return (
            <g transform={`translate(${x},${y})`} >
                <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-15)" className='text-xs text-gray-500 font-medium'>
                    {payload?.value}
                </text>
            </g>
        );
    };

    const barValue = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text x={x + width / 2} y={y} fill="#6B7280" textAnchor="middle" dy={-6} className='text-xs font-medium text-gray-500 uppercase'>
                {`${formatNumericalValue(value)}`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={weeklyData} margin={{ right: 40, top: 20, bottom: 10}}>
                <XAxis dataKey="Employee" interval={0} tick={<ItalizeLabels />} 
                padding={{
                    left: 30,
                    right: 1,
                }}/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 60 }} />
                <Bar 
                    type="monotone"
                    dataKey="Monday"
                    stroke="#2563eb"
                    fill="#3b82f6"
                />

                <Bar 
                    type="monotone"
                    dataKey="Tuesday"
                    stroke="#00d384"
                    fill="#00d384"
                />

                <Bar 
                    type="monotone"
                    dataKey="Wednesday"
                    stroke="#ff2257"
                    fill="#ff2257"
                />

                <Bar 
                    type="monotone"
                    dataKey="Thursday"
                    stroke="#FFC400"
                    fill="#FFC400"
                />

                <Bar 
                    type="monotone"
                    dataKey="Friday"
                    stroke="#bdb9b9"
                    fill="#bdb9b9"
                />

                <Bar 
                    type="monotone"
                    dataKey="Saturday"
                    stroke="#855cec"
                    fill="#855cec"
                />

                <Bar 
                    type="monotone"
                    dataKey="Sunday"
                    stroke="#ff6600"
                    fill="#ff6600"
                />


                <Bar 
                    type="monotone"
                    dataKey="OverallTotal"
                    stroke="#0038FF"
                    fill="#0038FF"
                    label={barValue}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
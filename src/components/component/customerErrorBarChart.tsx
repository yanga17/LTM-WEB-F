'use client'

import { BarChart, Bar, ResponsiveContainer, Label, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CustomerResponse } from '../../modules/dashboard/dashboardModule';

interface props {
    customerData: CustomerResponse;
}

export const formatNumericalValue = (number: number): string => {
    const absNumber = Math.abs(number);
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixIndex = Math.floor((absNumber.toFixed(0).length - 1) / 3);
    const formattedNumber = (number / Math.pow(1000, suffixIndex)).toFixed(1);
    return `${formattedNumber}${suffixes[suffixIndex]}`;
};

export const CustomerErrorComponent = ({ customerData }: props) => {
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
            <BarChart width={300} height={300} data={customerData} barSize={window.screen.width > 1200 ? 25 : 10} margin={{ right: 40, top: 10, bottom: 70}}>
                <XAxis dataKey="Customer" interval={0} tick={<ItalizeLabels />} 
                padding={{
                    left: 30,
                    right: 1,
                }}/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                {/* <Legend /> */}
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
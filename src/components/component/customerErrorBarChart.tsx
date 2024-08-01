'use client'

import { BarChart, Bar, ResponsiveContainer, Label, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CustomerResponse } from '../../modules/dashboard/dashboardModule';

interface props {
    customerData: CustomerResponse;
}

export const formatNumericalValue = (value: any) => {
    return Math.floor(value);
};

export const CustomerErrorComponent = ({ customerData }: props) => {
    const ItalizeLabels = (props: any) => {
        const { x, y, payload } = props;
        return (
            <g transform={`translate(${x},${y})`} >
                <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-15)" className='text-xs dash-text font-medium' style={{ fill: 'var(--dashboard-text-light)' }}>
                    {payload?.value}
                </text>
            </g>
        );
    };

    const barValue = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text x={x + width / 2} y={y} fill="#6B7280" textAnchor="middle" dy={-6} className='text-xs font-medium dash-text uppercase' style={{ fill: 'var(--dashboard-text-light)' }}>
                {`${formatNumericalValue(value)}`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={customerData} barSize={window.screen.width > 1200 ? 25 : 10} margin={{ right: 40, top: 25, bottom: 20}}>
                <XAxis dataKey="Customer" interval={0} tick={<ItalizeLabels />} />
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 65}} />
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
                    label={barValue}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
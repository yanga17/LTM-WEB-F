'use client'

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CustomerCallsResponse } from '../../modules/dashboard/dashboardModule';


interface props {
    customerCallsData: CustomerCallsResponse;
}

export const formatNumericalValue = (value: any) => {
    return Math.floor(value);
};

export const CustomerCallsComponent = ({ customerCallsData }: props) => {
    const ItalizeLabels = (props: any) => {
        const { x, y, payload } = props;
        return (
            <g transform={`translate(${x},${y})`} >
                <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-17)" className='text-xs dash-text' style={{ fill: 'var(--dashboard-text-light)' }}>
                    {payload?.value}
                </text>
            </g>
        );
    };

    const barValue = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text x={x + width / 2} y={y} fill="#6B7280" textAnchor="middle" dy={-6} className='text-xs dash-text' style={{ fill: 'var(--dashboard-text-light)' }}>
                {`${formatNumericalValue(value)}`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="chartoption-item">
                    <p className="label">{`${label}`}</p>
                    {payload.map((entry: any, index: any) => (
                        <p key={`item-${index}`} className="intro" style={{ color: entry.color }}>
                            {`${entry.name} : ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
    
        return null;
    }


    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={300} height={300} data={customerCallsData} margin={{ right: 50, top: 20, bottom: 10, left: 10}}>
                <XAxis dataKey="Customer" interval={0} tick={<ItalizeLabels />} 
                padding={{
                    left: 30,
                    right: 1,
                }}/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip content={ CustomTooltip }/>
                <Legend wrapperStyle={{ paddingTop: 60 }} />
                <Bar 
                    type="monotone"
                    dataKey="CallCount"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    label={barValue}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
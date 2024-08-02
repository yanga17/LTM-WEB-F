'use client'

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EmployeeWeeklyResponse } from '../../modules/dashboard/dashboardModule';


interface props {
  weeklyData: EmployeeWeeklyResponse;
}

export const formatNumericalValue = (value: any) => {
    return Math.floor(value);
};

export const EmployeeWeeklyChart = ({ weeklyData }: props) => {
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
            <BarChart width={300} height={300} data={weeklyData} margin={{ right: 40, top: 20, bottom: 20}}>
                <XAxis dataKey="Employee" interval={0} tick={<ItalizeLabels />} 
                padding={{
                    left: 30,
                    right: 1,
                }}/>
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip content={ CustomTooltip }/>
                <Legend wrapperStyle={{ paddingTop: 20 }} />
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
                    stroke="#cc7b2a"
                    fill="#cc7b2a"
                    label={barValue}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
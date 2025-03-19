
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

type PieChartProps = {
  data: any;
  children?: React.ReactNode;
  [key: string]: any;
};

export const PieChart = ({ data, children, ...props }: PieChartProps) => {
  const COLORS = ['#4bce97', '#e84c3d', '#e2b203', '#8590a2'];
  
  // Convert data format if needed
  const pieData = Array.isArray(data) 
    ? data 
    : data.labels?.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index]
      }));
  
  return (
    <RechartsPieChart {...props}>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {
          (Array.isArray(data) ? data : data.labels).map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))
        }
      </Pie>
      <Tooltip />
      <Legend />
      {children}
    </RechartsPieChart>
  );
};

export default PieChart;

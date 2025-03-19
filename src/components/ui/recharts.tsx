
import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Pie,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip, clickupConfig } from './chart';

// Define TypeScript types for our props
type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

type BarChartProps = {
  data: any;
  children?: React.ReactNode;
  [key: string]: any;
};

// Wrapper component for BarChart
export const BarChart = ({ data, children, ...props }: BarChartProps) => {
  // Convert the chart data format if it has labels and datasets
  const formattedData = Array.isArray(data) 
    ? data 
    : data.labels?.map((label: string, index: number) => {
        const dataPoint: ChartDataPoint = { name: label };
        
        // Add each dataset's data to the data point
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          dataPoint[dataset.label || `data${datasetIndex}`] = dataset.data[index];
        });
        
        return dataPoint;
      });

  return (
    <RechartsBarChart data={formattedData} {...props}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {data.datasets && data.datasets.map((dataset: any, index: number) => (
        <Bar 
          key={index} 
          dataKey={dataset.label || `data${index}`} 
          fill={dataset.backgroundColor || "#8884d8"} 
        />
      ))}
      {!data.datasets && (
        <>
          <Bar dataKey="Revenue" fill="#4573d2" />
          <Bar dataKey="Expenses" fill="#e84c3d" />
        </>
      )}
      {children}
    </RechartsBarChart>
  );
};

// Wrapper component for LineChart
export const LineChart = ({ data, children, ...props }: BarChartProps) => {
  // Convert the chart data format if it has labels and datasets
  const formattedData = Array.isArray(data) 
    ? data 
    : data.labels?.map((label: string, index: number) => {
        const dataPoint: ChartDataPoint = { name: label };
        
        // Add each dataset's data to the data point
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          dataPoint[dataset.label || `data${datasetIndex}`] = dataset.data[index];
        });
        
        return dataPoint;
      });

  return (
    <RechartsLineChart data={formattedData} {...props}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {data.datasets && data.datasets.map((dataset: any, index: number) => (
        <Line 
          key={index} 
          type="monotone" 
          dataKey={dataset.label || `data${index}`} 
          stroke={dataset.borderColor || "#8884d8"} 
          activeDot={{ r: 8 }} 
        />
      ))}
      {!data.datasets && (
        <Line type="monotone" dataKey="Profit" stroke="#4bce97" activeDot={{ r: 8 }} />
      )}
      {children}
    </RechartsLineChart>
  );
};

// Wrapper component for PieChart
export const PieChart = ({ data, children, ...props }: BarChartProps) => {
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

// Wrapper component for DonutChart (actually a PieChart with innerRadius)
export const DonutChart = ({ data, children, ...props }: BarChartProps) => {
  const COLORS = ['#4bce97', '#e84c3d', '#e2b203', '#8590a2'];
  
  // Convert data format if needed
  const donutData = Array.isArray(data) 
    ? data 
    : data.labels?.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index]
      }));
  
  return (
    <RechartsPieChart {...props}>
      <Pie
        data={donutData}
        cx="50%"
        cy="50%"
        innerRadius={60}
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

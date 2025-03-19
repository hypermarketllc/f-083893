
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartDataPoint } from './types';

type BarChartProps = {
  data: any;
  children?: React.ReactNode;
  [key: string]: any;
};

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

export default BarChart;

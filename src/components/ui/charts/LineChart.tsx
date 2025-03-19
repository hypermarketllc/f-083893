
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartDataPoint } from './types';

type LineChartProps = {
  data: any;
  children?: React.ReactNode;
  [key: string]: any;
};

export const LineChart = ({ data, children, ...props }: LineChartProps) => {
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

export default LineChart;

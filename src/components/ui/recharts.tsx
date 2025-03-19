
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

// Wrapper component for BarChart
export const BarChart = ({ data, children, ...props }) => {
  return (
    <RechartsBarChart data={data} {...props}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Revenue" fill="#4573d2" />
      <Bar dataKey="Expenses" fill="#e84c3d" />
      {children}
    </RechartsBarChart>
  );
};

// Wrapper component for LineChart
export const LineChart = ({ data, children, ...props }) => {
  return (
    <RechartsLineChart data={data} {...props}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Profit" stroke="#4bce97" activeDot={{ r: 8 }} />
      {children}
    </RechartsLineChart>
  );
};

// Wrapper component for PieChart
export const PieChart = ({ data, children, ...props }) => {
  const COLORS = ['#4bce97', '#e84c3d', '#e2b203', '#8590a2'];
  
  return (
    <RechartsPieChart {...props}>
      <Pie
        data={data.labels.map((label, index) => ({
          name: label,
          value: data.datasets[0].data[index]
        }))}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {
          data.labels.map((entry, index) => (
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
export const DonutChart = ({ data, children, ...props }) => {
  const COLORS = ['#4bce97', '#e84c3d', '#e2b203', '#8590a2'];
  
  return (
    <RechartsPieChart {...props}>
      <Pie
        data={data.labels.map((label, index) => ({
          name: label,
          value: data.datasets[0].data[index]
        }))}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {
          data.labels.map((entry, index) => (
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

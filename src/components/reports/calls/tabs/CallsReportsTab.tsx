
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/recharts';
import FilterSystem from '../../shared/FilterSystem';

interface CallsReportsTabProps {
  dateRange: { from: Date; to: Date };
  searchQuery?: string;
}

const CallsReportsTab: React.FC<CallsReportsTabProps> = ({ dateRange, searchQuery }) => {
  const [chartType, setChartType] = useState('bar');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // This would come from your API with the real data
  const mockData = [
    { name: 'Jan', value: 400, category: 'Inbound' },
    { name: 'Feb', value: 300, category: 'Inbound' },
    { name: 'Mar', value: 600, category: 'Inbound' },
    { name: 'Apr', value: 800, category: 'Inbound' },
    { name: 'May', value: 500, category: 'Inbound' },
    { name: 'Jan', value: 200, category: 'Outbound' },
    { name: 'Feb', value: 400, category: 'Outbound' },
    { name: 'Mar', value: 100, category: 'Outbound' },
    { name: 'Apr', value: 700, category: 'Outbound' },
    { name: 'May', value: 200, category: 'Outbound' },
  ];

  const pieData = [
    { name: 'Inbound', value: 2600 },
    { name: 'Outbound', value: 1600 },
    { name: 'Missed', value: 800 },
    { name: 'Transferred', value: 400 },
  ];

  const filterConfig = [
    { 
      id: 'call_type', 
      label: 'Call Type', 
      options: [
        { value: 'inbound', label: 'Inbound' },
        { value: 'outbound', label: 'Outbound' },
        { value: 'missed', label: 'Missed' },
        { value: 'transferred', label: 'Transferred' },
      ] 
    },
    { 
      id: 'agent', 
      label: 'Agent', 
      options: [
        { value: 'agent1', label: 'John Doe' },
        { value: 'agent2', label: 'Jane Smith' },
        { value: 'agent3', label: 'Mike Johnson' },
      ] 
    },
    { 
      id: 'duration', 
      label: 'Duration', 
      options: [
        { value: '<30', label: 'Less than 30s' },
        { value: '30-60', label: '30s - 60s' },
        { value: '60-180', label: '1m - 3m' },
        { value: '>180', label: 'More than 3m' },
      ] 
    },
  ];

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    // In a real implementation, you would fetch data based on these filters
    console.log('Filters changed:', filters);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs value={chartType} onValueChange={setChartType} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <FilterSystem 
          filters={filterConfig} 
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call Volume by Month</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {chartType === 'bar' && (
            <div className="h-80">
              <BarChart 
                data={mockData} 
                index="name"
                categories={["value"]}
                colors={["purple"]}
                valueFormatter={(value) => `${value} calls`}
                showLegend={true}
                stack={true}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
              />
            </div>
          )}
          
          {chartType === 'line' && (
            <div className="h-80">
              <LineChart 
                data={mockData}
                index="name"
                categories={["value"]}
                colors={["purple"]}
                valueFormatter={(value) => `${value} calls`}
                showLegend={true}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
              />
            </div>
          )}
          
          {chartType === 'pie' && (
            <div className="h-80">
              <PieChart 
                data={pieData}
                index="name"
                category="value"
                colors={["indigo", "violet", "purple", "fuchsia"]}
                valueFormatter={(value) => `${value} calls`}
                showLabel={true}
                showAnimation={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Call Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <PieChart 
                data={pieData}
                index="name"
                category="value"
                colors={["indigo", "violet", "purple", "fuchsia"]}
                valueFormatter={(value) => `${value} calls`}
                showLabel={true}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <BarChart 
                data={[
                  { name: '<30s', value: 350 },
                  { name: '30s-1m', value: 250 },
                  { name: '1m-3m', value: 400 },
                  { name: '3m-5m', value: 300 },
                  { name: '>5m', value: 150 },
                ]} 
                index="name"
                categories={["value"]}
                colors={["indigo"]}
                valueFormatter={(value) => `${value} calls`}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallsReportsTab;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CallsReportsTab from './tabs/CallsReportsTab';
import CallsTablesTab from './tabs/CallsTablesTab';
import CallsWebhooksTab from './tabs/CallsWebhooksTab';
import DateRangePicker from '../shared/DateRangePicker';

interface ReportsTabContentProps {
  searchQuery?: string;
}

const ReportsTabContent: React.FC<ReportsTabContentProps> = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date()
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Call Reports</CardTitle>
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <CallsReportsTab dateRange={dateRange} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <CallsTablesTab dateRange={dateRange} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <CallsWebhooksTab dateRange={dateRange} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsTabContent;

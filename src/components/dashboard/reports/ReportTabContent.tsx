
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ReportMetrics from './ReportMetrics';
import ReportCharts from './ReportCharts';
import { chartConfig, getMetrics, getChartType, getChartTitles } from './ReportData';
import CallsReportsContent from '@/components/reports/calls/ReportsTabContent';

interface ReportTabContentProps {
  reportType: string;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({ reportType }) => {
  const metrics = getMetrics(reportType);
  const chartType = getChartType(reportType);
  const { barTitle, secondChartTitle } = getChartTitles(reportType);
  
  // If it's the calls report, use our new component, otherwise use the existing ones
  if (reportType === 'calls') {
    return (
      <TabsContent value={reportType} className="space-y-4">
        <CallsReportsContent />
      </TabsContent>
    );
  }
  
  // For other report types, use the existing implementation
  return (
    <TabsContent value={reportType} className="space-y-4">
      <ReportMetrics metrics={metrics} />
      <ReportCharts 
        chartData={chartConfig[reportType]}
        chartType={chartType}
        barTitle={barTitle}
        secondChartTitle={secondChartTitle}
      />
    </TabsContent>
  );
};

export default ReportTabContent;

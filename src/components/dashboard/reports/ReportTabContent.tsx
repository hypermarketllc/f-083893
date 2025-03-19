
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ReportMetrics from './ReportMetrics';
import ReportCharts from './ReportCharts';
import { chartConfig, getMetrics, getChartType, getChartTitles } from './ReportData';

interface ReportTabContentProps {
  reportType: string;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({ reportType }) => {
  const metrics = getMetrics(reportType);
  const chartType = getChartType(reportType);
  const { barTitle, secondChartTitle } = getChartTitles(reportType);
  
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

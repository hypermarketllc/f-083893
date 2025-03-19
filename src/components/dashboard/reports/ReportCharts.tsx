
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, DonutChart, LineChart, PieChart } from '@/components/ui/charts';
import { type ChartConfig, type ChartProps } from '@/components/ui/charts/types';

interface ReportChartsProps {
  chartData: ChartConfig;
  chartType: string;
  barTitle: string;
  secondChartTitle: string;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ 
  chartData, 
  chartType,
  barTitle,
  secondChartTitle
}) => {
  // Determine which chart to render based on chartType
  const renderSecondaryChart = () => {
    switch (chartType) {
      case 'donut':
        return <DonutChart config={chartData} />;
      case 'pie':
        return <PieChart config={chartData} />;
      case 'line':
        return <LineChart config={chartData} />;
      default:
        return <DonutChart config={chartData} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{barTitle}</h3>
        <BarChart config={chartData} />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{secondChartTitle}</h3>
        {renderSecondaryChart()}
      </Card>
    </div>
  );
};

export default ReportCharts;

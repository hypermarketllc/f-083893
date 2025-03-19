
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, DonutChart, LineChart, PieChart } from '@/components/ui/charts';

interface ReportChartsProps {
  chartData: any;
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
        return <DonutChart data={chartData} />;
      case 'pie':
        return <PieChart data={chartData} />;
      case 'line':
        return <LineChart data={chartData} />;
      default:
        return <DonutChart data={chartData} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{barTitle}</h3>
        <BarChart data={chartData} />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{secondChartTitle}</h3>
        {renderSecondaryChart()}
      </Card>
    </div>
  );
};

export default ReportCharts;

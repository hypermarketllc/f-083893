
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip,
  clickupConfig
} from '@/components/ui/chart';
import { BarChart, LineChart, PieChart, DonutChart } from '@/components/ui/recharts';

interface ChartData {
  barData?: any;
  lineData?: any;
  pieData?: any;
  donutData?: any;
}

interface ReportChartsProps {
  chartData: ChartData;
  chartType: 'bar-line' | 'bar-pie' | 'bar-donut';
  barTitle: string;
  secondChartTitle: string;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ 
  chartData, 
  chartType, 
  barTitle, 
  secondChartTitle 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{barTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={clickupConfig} className="aspect-video">
            <BarChart 
              data={chartData.barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{secondChartTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={clickupConfig} className="aspect-video">
            {chartType === 'bar-line' && (
              <LineChart
                data={chartData.lineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            )}
            {chartType === 'bar-pie' && (
              <PieChart data={chartData.pieData} />
            )}
            {chartType === 'bar-donut' && (
              <DonutChart data={chartData.donutData} />
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCharts;

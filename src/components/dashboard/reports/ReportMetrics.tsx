
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
}

interface ReportMetricsProps {
  metrics: MetricProps[];
}

const ReportMetrics: React.FC<ReportMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <p className={`text-xs flex items-center ${metric.up ? 'text-green-500' : 'text-red-500'}`}>
                {metric.up ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <metric.icon className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportMetrics;


import { 
  DollarSign, 
  PhoneCall, 
  Users, 
  Building2,
} from 'lucide-react';
import { 
  chartConfigData, 
  getChartType, 
  getChartTitles 
} from './chartConfig';
import { getMetricsData } from './metricsData';

export interface Metric {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: any; // LucideIcon type
}

export interface ChartConfig {
  barData: any;
  lineData?: any;
  pieData?: any;
  donutData?: any;
}

export const chartConfig = chartConfigData;
export { getChartType, getChartTitles };
export const getMetrics = getMetricsData;

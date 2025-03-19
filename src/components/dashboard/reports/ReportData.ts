
import { 
  DollarSign, 
  PhoneCall, 
  Users, 
  Building2,
} from 'lucide-react';

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

export const chartConfig: Record<string, ChartConfig> = {
  pandl: {
    barData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [4500, 5200, 4800, 5800, 6000, 6500],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
        },
        {
          label: 'Expenses',
          data: [3800, 4100, 3700, 4200, 4300, 4800],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
        },
      ],
    },
    lineData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Profit',
          data: [700, 1100, 1100, 1600, 1700, 1700],
          borderColor: 'rgba(16, 185, 129, 1)',
          tension: 0.3,
        },
      ],
    }
  },
  calls: {
    barData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Outbound Calls',
          data: [45, 52, 38, 58, 60, 25, 15],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
        },
        {
          label: 'Inbound Calls',
          data: [30, 41, 35, 48, 43, 18, 10],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
      ],
    },
    pieData: {
      labels: ['Answered', 'Missed', 'Voicemail', 'Rejected'],
      datasets: [
        {
          data: [63, 15, 12, 10],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
        },
      ],
    }
  },
  leads: {
    barData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'New Leads',
          data: [32, 28, 35, 42],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
        },
        {
          label: 'Converted',
          data: [12, 15, 18, 22],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
      ],
    },
    donutData: {
      labels: ['Cold', 'Warm', 'Hot', 'Converted'],
      datasets: [
        {
          data: [45, 25, 15, 15],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(16, 185, 129, 0.8)',
          ],
        },
      ],
    }
  },
  agents: {
    barData: {
      labels: ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4', 'Agent 5'],
      datasets: [
        {
          label: 'Closed Deals',
          data: [12, 19, 8, 15, 20],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
      ],
    },
    lineData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Agent 1',
          data: [12, 15, 18, 14, 16, 19],
          borderColor: 'rgba(59, 130, 246, 0.8)',
          tension: 0.3,
        },
        {
          label: 'Agent 2',
          data: [8, 9, 12, 15, 18, 20],
          borderColor: 'rgba(245, 158, 11, 0.8)',
          tension: 0.3,
        },
        {
          label: 'Agent 3',
          data: [5, 8, 7, 10, 12, 15],
          borderColor: 'rgba(239, 68, 68, 0.8)',
          tension: 0.3,
        },
      ],
    }
  },
  pubs: {
    barData: {
      labels: ['Pub 1', 'Pub 2', 'Pub 3', 'Pub 4', 'Pub 5'],
      datasets: [
        {
          label: 'Revenue',
          data: [8500, 12000, 9500, 14000, 10500],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
        },
      ],
    },
    donutData: {
      labels: ['Food', 'Drinks', 'Events', 'Merchandise'],
      datasets: [
        {
          data: [45, 35, 12, 8],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
        },
      ],
    }
  },
};

export const getMetrics = (type: string): Metric[] => {
  switch (type) {
    case 'pandl':
      return [
        { 
          label: 'Total Revenue', 
          value: '$32,800', 
          change: '+12.5%',
          up: true,
          icon: DollarSign
        },
        { 
          label: 'Total Expenses', 
          value: '$24,900', 
          change: '+8.3%',
          up: true,
          icon: DollarSign
        },
        { 
          label: 'Net Profit', 
          value: '$7,900', 
          change: '+24.8%',
          up: true,
          icon: DollarSign
        },
        { 
          label: 'Profit Margin', 
          value: '24.1%', 
          change: '+3.2%',
          up: true,
          icon: DollarSign
        }
      ];
    case 'calls':
      return [
        { 
          label: 'Total Calls', 
          value: '856', 
          change: '+15.3%',
          up: true,
          icon: PhoneCall
        },
        { 
          label: 'Avg. Duration', 
          value: '4m 23s', 
          change: '-0.8%',
          up: false,
          icon: PhoneCall
        },
        { 
          label: 'Conversion Rate', 
          value: '23.5%', 
          change: '+2.1%',
          up: true,
          icon: PhoneCall
        },
        { 
          label: 'Missed Calls', 
          value: '87', 
          change: '-5.2%',
          up: false,
          icon: PhoneCall
        }
      ];
    case 'leads':
      return [
        { 
          label: 'Total Leads', 
          value: '137', 
          change: '+22.4%',
          up: true,
          icon: Users
        },
        { 
          label: 'Conversion Rate', 
          value: '28.5%', 
          change: '+3.7%',
          up: true,
          icon: Users
        },
        { 
          label: 'Avg. Response Time', 
          value: '2h 18m', 
          change: '-15.3%',
          up: false,
          icon: Users
        },
        { 
          label: 'Cost Per Lead', 
          value: '$32.48', 
          change: '-8.1%',
          up: false,
          icon: Users
        }
      ];
    case 'agents':
      return [
        { 
          label: 'Total Agents', 
          value: '28', 
          change: '+3',
          up: true,
          icon: Users
        },
        { 
          label: 'Avg. Performance', 
          value: '84.3%', 
          change: '+2.7%',
          up: true,
          icon: Users
        },
        { 
          label: 'Top Performer', 
          value: 'Agent 5', 
          change: 'New',
          up: true,
          icon: Users
        },
        { 
          label: 'Turnover Rate', 
          value: '12.5%', 
          change: '-3.1%',
          up: false,
          icon: Users
        }
      ];
    case 'pubs':
      return [
        { 
          label: 'Total Pubs', 
          value: '12', 
          change: '+2',
          up: true,
          icon: Building2
        },
        { 
          label: 'Avg. Revenue', 
          value: '$10,875', 
          change: '+12.3%',
          up: true,
          icon: Building2
        },
        { 
          label: 'Top Performer', 
          value: 'Pub 4', 
          change: 'No change',
          up: true,
          icon: Building2
        },
        { 
          label: 'Occupancy Rate', 
          value: '78.3%', 
          change: '+5.2%',
          up: true,
          icon: Building2
        }
      ];
    default:
      return [];
  }
};

export const getChartType = (reportType: string): 'bar-line' | 'bar-pie' | 'bar-donut' => {
  switch (reportType) {
    case 'pandl':
    case 'agents':
      return 'bar-line';
    case 'calls':
      return 'bar-pie';
    case 'leads':
    case 'pubs':
      return 'bar-donut';
    default:
      return 'bar-line';
  }
};

export const getChartTitles = (reportType: string): { barTitle: string, secondChartTitle: string } => {
  switch (reportType) {
    case 'pandl':
      return {
        barTitle: 'Revenue vs Expenses',
        secondChartTitle: 'Profit Trend'
      };
    case 'calls':
      return {
        barTitle: 'Call Volume by Day',
        secondChartTitle: 'Call Outcomes'
      };
    case 'leads':
      return {
        barTitle: 'Lead Generation',
        secondChartTitle: 'Lead Status Distribution'
      };
    case 'agents':
      return {
        barTitle: 'Agent Performance',
        secondChartTitle: 'Performance Trend'
      };
    case 'pubs':
      return {
        barTitle: 'Pub Revenue Comparison',
        secondChartTitle: 'Revenue by Category'
      };
    default:
      return {
        barTitle: 'Chart 1',
        secondChartTitle: 'Chart 2'
      };
  }
};

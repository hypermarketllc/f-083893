
import { DollarSign, PhoneCall, Users, Building2 } from 'lucide-react';

export interface Metric {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: any; // LucideIcon type
}

export const getMetricsData = (type: string): Metric[] => {
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


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, DonutChart } from '@/components/ui/chart';
import { 
  DollarSign, 
  PhoneCall, 
  Users, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const ReportsSection = () => {
  const [activeReport, setActiveReport] = useState('pandl');

  // Mock data for charts
  const chartConfig = {
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

  // Metrics for each report
  const getMetrics = (type: string) => {
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

  return (
    <div className="space-y-4">
      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="mb-4">
          <TabsTrigger value="pandl" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            P&L
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="pubs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Pubs
          </TabsTrigger>
        </TabsList>

        {/* P&L Report */}
        <TabsContent value="pandl" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics('pandl').map((metric, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chartConfig.pandl.barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={chartConfig.pandl.lineData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calls Report */}
        <TabsContent value="calls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics('calls').map((metric, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chartConfig.calls.barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Call Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={chartConfig.calls.pieData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leads Report */}
        <TabsContent value="leads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics('leads').map((metric, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chartConfig.leads.barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart data={chartConfig.leads.donutData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Report */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics('agents').map((metric, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chartConfig.agents.barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={chartConfig.agents.lineData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pubs Report */}
        <TabsContent value="pubs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetrics('pubs').map((metric, index) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pub Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chartConfig.pubs.barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart data={chartConfig.pubs.donutData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsSection;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, BarChart3, CalendarIcon, Download, Filter, PieChart } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell, BarChart as RBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

// Dummy data for the P&L
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 49000, expenses: 33000, profit: 16000 },
  { month: 'Apr', revenue: 58000, expenses: 36000, profit: 22000 },
  { month: 'May', revenue: 55000, expenses: 34000, profit: 21000 },
  { month: 'Jun', revenue: 61000, expenses: 38000, profit: 23000 },
];

const expenseData = [
  { name: 'Salaries', value: 48000, color: '#7C3AED' },
  { name: 'Marketing', value: 21000, color: '#3B82F6' },
  { name: 'Operations', value: 15000, color: '#10B981' },
  { name: 'Office', value: 8000, color: '#F59E0B' },
  { name: 'Software', value: 6000, color: '#EF4444' },
  { name: 'Other', value: 2000, color: '#6B7280' },
];

const PLReport: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });
  const [selectedView, setSelectedView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Profit & Loss</h2>
          <p className="text-muted-foreground">Financial performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => range && setDateRange({ from: range.from || new Date(), to: range.to || new Date() })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select value={selectedView} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setSelectedView(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1 hover-scale">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">$320,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500 font-medium">↑ 12.5%</span> vs previous period
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 hover-scale">
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-3xl font-bold">$208,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-red-500 font-medium">↑ 8.3%</span> vs previous period
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 hover-scale">
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-500">$112,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500 font-medium">↑ 21.7%</span> vs previous period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span>Expenses</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>
                Monthly breakdown of financial performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#7C3AED" />
                    <Bar dataKey="expenses" name="Expenses" fill="#6B7280" />
                    <Bar dataKey="profit" name="Profit" fill="#10B981" />
                  </RBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Distribution of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PLReport;

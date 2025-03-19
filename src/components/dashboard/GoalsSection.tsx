
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Plus, Target, TrendingUp, Zap, AlertCircle } from 'lucide-react';

const GoalsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for goals
  const goals = [
    {
      id: 1,
      title: 'Increase Website Traffic',
      description: 'Reach 10,000 unique visitors per month',
      category: 'marketing',
      progress: 65,
      dueDate: '2023-12-31',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Improve Conversion Rate',
      description: 'Increase conversion rate to 3.5%',
      category: 'sales',
      progress: 40,
      dueDate: '2023-11-30',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Launch Mobile App',
      description: 'Complete development and launch mobile app',
      category: 'product',
      progress: 90,
      dueDate: '2023-10-15',
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'Customer Satisfaction Score',
      description: 'Achieve 95% customer satisfaction rating',
      category: 'customer',
      progress: 78,
      dueDate: '2023-12-31',
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Reduce Support Response Time',
      description: 'Average response time under 2 hours',
      category: 'support',
      progress: 100,
      dueDate: '2023-09-30',
      status: 'completed'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <TrendingUp className="h-4 w-4" />;
      case 'sales':
        return <Zap className="h-4 w-4" />;
      case 'product':
        return <Target className="h-4 w-4" />;
      case 'support':
      case 'customer':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredGoals = activeTab === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === activeTab || goal.status === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
          <p className="text-muted-foreground">
            Track progress towards your organizational goals
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                      {getCategoryIcon(goal.category)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </CardContent>
                <CardFooter className="pt-1 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                  <div>
                    {goal.progress === 100 ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Simple Badge component for the goals
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${className}`}>
      {children}
    </div>
  );
};

export default GoalsSection;

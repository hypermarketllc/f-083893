
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
  handleTaskClick: (task: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  setActiveTab,
  handleTaskClick 
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back to your dashboard.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatsCard 
          title="Recent Activity"
          value="24 actions"
          description="12% increase from last week"
          linkText="View activity"
          onLinkClick={() => setActiveTab('reports')}
        />
        
        <StatsCard 
          title="Active Webhooks"
          value="8 webhooks"
          description="2 new in the last 24h"
          linkText="View webhooks"
          onLinkClick={() => setActiveTab('webhooks')}
        />
        
        <StatsCard 
          title="Reports"
          value="5 reports"
          description="3 reports need attention"
          linkText="View reports"
          onLinkClick={() => setActiveTab('reports')}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="justify-start" 
                  onClick={() => setActiveTab('reports')}
                >
                  <span>View P&L Reports</span>
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start" 
                  onClick={() => setActiveTab('reports')}
                >
                  <span>Agent Performance</span>
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start" 
                  onClick={() => setActiveTab('webhooks')}
                >
                  <span>Create Webhook</span>
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start" 
                  onClick={() => setActiveTab('goals')}
                >
                  <span>Set New Goal</span>
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest system and feature updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="text-sm font-medium">New Reports UI</h4>
                <p className="text-sm text-muted-foreground">
                  We've updated the reports interface with improved filtering and visualization options.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="text-sm font-medium">Webhook Testing</h4>
                <p className="text-sm text-muted-foreground">
                  You can now test and validate webhooks directly from the interface.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <h4 className="text-sm font-medium">Authentication Improvements</h4>
                <p className="text-sm text-muted-foreground">
                  We've added "Remember Me" functionality to the login system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  linkText: string;
  onLinkClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  linkText, 
  onLinkClick 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Button 
            variant="link" 
            className="px-0 text-xs" 
            onClick={onLinkClick}
          >
            {linkText}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;

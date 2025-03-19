
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ListChecks, Settings } from 'lucide-react';
import TaskOverview from './TaskOverview';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/hooks/useAuth';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
  handleTaskClick: (task: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  setActiveTab,
  handleTaskClick
}) => {
  const { user } = useAuth();
  const { tasks } = useTaskContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {user?.email?.split('@')[0] || 'User'}!</CardTitle>
        <CardDescription>
          This is your project management dashboard. Navigate through the tabs to access different sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("tasks")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-500" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your tasks and team's workload</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("analytics")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View project statistics and team performance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("settings")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Customize application preferences</p>
            </CardContent>
          </Card>
        </div>
        
        <TaskOverview 
          tasks={tasks} 
          setActiveTab={setActiveTab}
          handleTaskClick={handleTaskClick}
        />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => setActiveTab("tasks")}>
          View All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardOverview;

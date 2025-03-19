
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BarChart3, Settings, ListChecks } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';

// Components
import TaskDetailModal from '@/components/dashboard/TaskDetailModal';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import TasksSection from '@/components/dashboard/TasksSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import SettingsSection from '@/components/dashboard/SettingsSection';

interface DashboardContentProps {
  searchQuery?: string;
}

export default function DashboardContent({ searchQuery = '' }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeView, setActiveView] = useState("list");
  const { 
    filteredTasks, 
    selectedTask,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultStatus,
    handleTaskClick,
    handleCreateTask,
    saveTask,
    deleteTask,
    setSearchQuery
  } = useTaskContext();
  
  // Update the search query in the task context when it changes
  useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);
  
  return (
    <div className="flex-1 overflow-auto">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="p-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview 
            setActiveTab={setActiveTab}
            handleTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TasksSection 
            activeView={activeView}
            setActiveView={setActiveView}
            filteredTasks={filteredTasks}
            handleTaskClick={handleTaskClick}
            handleCreateTask={handleCreateTask}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsSection />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsSection />
        </TabsContent>
      </Tabs>
      
      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={saveTask}
        onDelete={deleteTask}
      />
      
      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={saveTask}
        defaultStatus={createModalDefaultStatus}
      />
    </div>
  );
}

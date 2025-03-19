
import { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/task/TaskContext';
import TabNavigation from './navigation/TabNavigation';

// Components
import TaskDetailModal from '@/components/dashboard/TaskDetailModal';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import TasksSection from '@/components/dashboard/TasksSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import WebhooksSection from '@/components/dashboard/WebhooksSection';
import SettingsSection from '@/components/dashboard/SettingsSection';
import ReportsSection from '@/components/dashboard/ReportsSection';

interface DashboardContentProps {
  searchQuery?: string;
  initialActiveTab?: string;
}

export default function DashboardContent({ 
  searchQuery = '', 
  initialActiveTab = "overview" 
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
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
    console.log("DashboardContent rendered with tab:", activeTab);
  }, [searchQuery, setSearchQuery, activeTab]);
  
  // Update active tab when initialActiveTab changes (from parent props)
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);
  
  return (
    <div className="flex-1 overflow-auto">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab}>
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
        
        <TabsContent value="webhooks" className="space-y-4">
          <WebhooksSection />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsSection />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsSection />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsSection />
        </TabsContent>
      </TabNavigation>
      
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

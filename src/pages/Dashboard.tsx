
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BarChart3, Settings, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Components
import Sidebar from '@/components/Sidebar';
import TaskDetailModal from '@/components/dashboard/TaskDetailModal';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import TasksSection from '@/components/dashboard/TasksSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import SettingsSection from '@/components/dashboard/SettingsSection';

// Initial task data
const TASKS: Task[] = [
  {
    id: '1',
    title: 'Update contractor agreement',
    description: 'Review and update the terms of our standard contractor agreement template based on legal feedback.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-10',
    assignee: 'john@example.com',
    timeEstimate: '2h',
    tags: ['legal', 'contract']
  },
  {
    id: '2',
    title: 'Create project roadmap',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-12-05',
    assignee: 'user@example.com',
    timeEstimate: '4h',
    tags: ['planning', 'strategy']
  },
  {
    id: '3',
    title: 'Finalize project scope',
    status: 'review',
    priority: 'urgent',
    dueDate: '2023-12-03',
    assignee: 'jane@example.com',
    timeEstimate: '3h',
    tags: ['planning']
  },
  {
    id: '4',
    title: 'Design system implementation',
    status: 'done',
    priority: 'high',
    dueDate: '2023-12-01',
    assignee: 'user@example.com',
    timeEstimate: '8h',
    tags: ['design', 'development']
  },
  {
    id: '5',
    title: 'Quarterly report preparation',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-15',
    assignee: 'john@example.com',
    timeEstimate: '6h',
    tags: ['reporting', 'finance']
  }
];

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeView, setActiveView] = useState("list");
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<Task['status']>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  
  // Effect to filter tasks when search query or tasks change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.status.includes(query) ||
        task.priority.includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);
  
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCreateTask = (status?: Task['status']) => {
    if (status) {
      setCreateModalDefaultStatus(status);
    }
    setIsCreateModalOpen(true);
  };

  const saveTask = (task: Task) => {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (taskIndex >= 0) {
      // Update existing task
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = task;
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Create new task with unique ID
      const newId = crypto.randomUUID();
      const newTask = { ...task, id: newId };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
    
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsDetailModalOpen(false);
    toast.success("Task deleted successfully");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userEmail={user?.email}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          signOut={signOut}
        />

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
                user={user}
                setActiveTab={setActiveTab}
                tasks={tasks}
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
        </div>
      </div>
      
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

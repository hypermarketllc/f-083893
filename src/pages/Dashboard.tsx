
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskProvider } from '@/contexts/task/TaskContext';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function Dashboard() {
  const { loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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
    <TaskProvider>
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        <DashboardContent searchQuery={searchQuery} />
      </DashboardLayout>
    </TaskProvider>
  );
}

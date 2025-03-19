
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskProvider } from '@/contexts/task/TaskContext';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useTheme } from 'next-themes';
import { WebhookProvider } from '@/contexts/webhook/WebhookContext';

export default function Dashboard() {
  const { loading, user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // Set isLoaded to true without delay to avoid white screen
    setIsLoaded(true);
    
    // Ensure dark mode is set at the application level
    document.documentElement.classList.add('dark');
    setTheme('dark');
    
    console.log("Dashboard loading, auth state:", { loading, user, isLoaded });
  }, [loading, user, setTheme]);

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
      <WebhookProvider>
        <DashboardLayout
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          <DashboardContent searchQuery={searchQuery} />
        </DashboardLayout>
      </WebhookProvider>
    </TaskProvider>
  );
}

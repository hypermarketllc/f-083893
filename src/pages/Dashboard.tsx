
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useParams, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskProvider } from '@/contexts/task/TaskContext';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useTheme } from 'next-themes';
import { WebhookProvider } from '@/contexts/webhook/WebhookContext';

interface DashboardProps {
  tab?: string;
}

export default function Dashboard({ tab }: DashboardProps) {
  const { loading, user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { setTheme } = useTheme();
  const location = useLocation();
  const params = useParams();
  
  // Determine active tab from props, URL, or default to 'overview'
  const determineActiveTab = () => {
    if (tab) return tab;
    
    // Check if we're on a specific route
    if (location.pathname.includes('/webhooks')) return 'webhooks';
    if (location.pathname.includes('/notifications')) return 'notifications';
    if (location.pathname.includes('/goals')) return 'goals';
    
    return 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(determineActiveTab());
  
  useEffect(() => {
    // Set isLoaded to true without delay to avoid white screen
    setIsLoaded(true);
    
    // Force dark mode on the application level
    document.documentElement.classList.add('dark');
    setTheme('dark');
    
    // Update active tab when props or URL changes
    setActiveTab(determineActiveTab());
    
    console.log("Dashboard loading, auth state:", { loading, user, isLoaded });
  }, [loading, user, setTheme, tab, location.pathname]);

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
          <DashboardContent 
            searchQuery={searchQuery} 
            initialActiveTab={activeTab}
          />
        </DashboardLayout>
      </WebhookProvider>
    </TaskProvider>
  );
}

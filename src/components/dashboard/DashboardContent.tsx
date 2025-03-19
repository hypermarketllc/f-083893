
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import TasksSection from './TasksSection';
import WebhooksSection from './WebhooksSection';
import SettingsSection from './SettingsSection';
import ProfileSection from './ProfileSection';
import ReportsSection from './ReportsSection';
import PlaceholderView from './PlaceholderView';

interface DashboardContentProps {
  searchQuery: string;
  initialActiveTab?: string;
}

// These tabs are displayed in the dashboard
const validTabs = ['overview', 'tasks', 'webhooks', 'reports', 'settings', 'profile'];

export default function DashboardContent({ 
  searchQuery, 
  initialActiveTab = 'overview'
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const location = useLocation();

  useEffect(() => {
    // Check URL query parameters for tab
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [location.search, initialActiveTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'tasks':
        return <TasksSection searchQuery={searchQuery} />;
      case 'webhooks':
        return <WebhooksSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <PlaceholderView title={activeTab} />;
    }
  };

  return (
    <div className="h-full flex overflow-y-auto">
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

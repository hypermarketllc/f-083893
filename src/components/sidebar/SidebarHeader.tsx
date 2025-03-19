
import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

const SidebarHeader: React.FC = () => {
  const [siteTitle, setSiteTitle] = useLocalStorage('site-title', 'ClickUp');
  
  return (
    <div className="p-4 flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" strokeWidth="2" fill="none">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
      <span className="font-bold text-xl">{siteTitle}</span>
    </div>
  );
};

export default SidebarHeader;

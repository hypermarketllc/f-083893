
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useNavigate } from 'react-router-dom';

const SidebarHeader: React.FC = () => {
  const [siteTitle] = useLocalStorage('site-title', 'ClickUp');
  const [displayTitle, setDisplayTitle] = useState(siteTitle);
  const navigate = useNavigate();
  
  // Update displayed title when localStorage value changes
  useEffect(() => {
    setDisplayTitle(siteTitle);
  }, [siteTitle]);
  
  const handleTitleClick = () => {
    navigate('/dashboard?tab=settings');
  };
  
  return (
    <div className="p-4 flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" strokeWidth="2" fill="none">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
      <span 
        className="font-bold text-xl cursor-pointer hover:text-primary transition-colors" 
        onClick={handleTitleClick}
        title="Edit organization name in Settings"
      >
        {displayTitle}
      </span>
    </div>
  );
};

export default SidebarHeader;


import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ActivityIndicatorProps {
  timestamp: string | null;
  status: 'success' | 'error' | null;
  showLabel?: boolean;
  className?: string;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  timestamp,
  status,
  showLabel = true,
  className = ''
}) => {
  if (!timestamp) {
    return (
      <div className={`flex items-center text-muted-foreground ${className}`}>
        <Clock className="h-3.5 w-3.5 mr-1" />
        {showLabel && <span className="text-sm">Never executed</span>}
      </div>
    );
  }

  const getStatusIcon = () => {
    if (!status) return <AlertCircle className="h-3.5 w-3.5" />;
    
    return status === 'success' 
      ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> 
      : <XCircle className="h-3.5 w-3.5 text-red-500" />;
  };

  const getStatusText = () => {
    if (!status) return 'Unknown status';
    return status === 'success' ? 'Last execution successful' : 'Last execution failed';
  };

  try {
    const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${className}`}>
              {getStatusIcon()}
              {showLabel && <span className="text-sm ml-1">{timeAgo}</span>}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
            <p className="text-xs text-muted-foreground">{new Date(timestamp).toLocaleString()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch (error) {
    return (
      <div className={`flex items-center text-muted-foreground ${className}`}>
        <AlertCircle className="h-3.5 w-3.5 mr-1" />
        {showLabel && <span className="text-sm">Invalid date</span>}
      </div>
    );
  }
};

export default ActivityIndicator;

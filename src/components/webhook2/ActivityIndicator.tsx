
import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityIndicatorProps {
  timestamp: string | null;
  status: 'success' | 'error' | null;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ timestamp, status }) => {
  if (!timestamp) {
    return <span className="text-xs text-muted-foreground">Never executed</span>;
  }
  
  try {
    const date = new Date(timestamp);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    
    return (
      <div className="flex items-center text-xs">
        {status === 'success' ? (
          <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
        ) : status === 'error' ? (
          <XCircle className="h-3 w-3 mr-1 text-red-500" />
        ) : (
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
        )}
        <span>
          {timeAgo}
        </span>
      </div>
    );
  } catch (e) {
    return <span className="text-xs text-muted-foreground">Invalid date</span>;
  }
};

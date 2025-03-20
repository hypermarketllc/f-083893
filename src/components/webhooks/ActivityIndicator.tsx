
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ActivityIndicatorProps {
  timestamp: string | null;
  status: 'success' | 'error' | null;
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ timestamp, status }) => {
  if (!timestamp) {
    return (
      <div className="flex items-center text-muted-foreground text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Never
      </div>
    );
  }

  const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  if (status === 'success') {
    return (
      <div className="flex items-center text-green-600 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        {formattedTime}
      </div>
    );
  } else if (status === 'error') {
    return (
      <div className="flex items-center text-red-600 text-xs">
        <XCircle className="h-3 w-3 mr-1" />
        {formattedTime}
      </div>
    );
  }

  return (
    <div className="flex items-center text-muted-foreground text-xs">
      <Clock className="h-3 w-3 mr-1" />
      {formattedTime}
    </div>
  );
};

export default ActivityIndicator;

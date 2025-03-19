
import React from 'react';
import { History } from 'lucide-react';

interface EmptyLogsProps {
  message?: string;
}

export const EmptyLogs: React.FC<EmptyLogsProps> = ({ 
  message = 'No logs found' 
}) => (
  <div className="text-center p-8 border rounded-lg bg-muted/20">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
      <History className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-1">
      Execute a webhook to see activity here
    </p>
  </div>
);

export default EmptyLogs;

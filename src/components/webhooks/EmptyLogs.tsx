
import React from 'react';
import { FolderX, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyLogsProps {
  message?: string;
  onRefresh?: () => void;
}

const EmptyLogs: React.FC<EmptyLogsProps> = ({ 
  message = "No logs found", 
  onRefresh 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border rounded-md bg-muted/30">
      <FolderX className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There are no logs to display at this time.
      </p>
      {onRefresh && (
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="mt-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default EmptyLogs;

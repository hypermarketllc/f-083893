
import React from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyLogsProps {
  message: string;
}

export const EmptyLogs: React.FC<EmptyLogsProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/10">
      <FolderSearch className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No data found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {message}
      </p>
    </div>
  );
};

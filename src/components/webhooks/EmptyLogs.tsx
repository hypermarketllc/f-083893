
import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyLogsProps {
  message?: string;
}

export const EmptyLogs: React.FC<EmptyLogsProps> = ({ message = "No logs found" }) => {
  return (
    <div className="border rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground text-center bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all hover:shadow-md">
      <div className="p-4 bg-muted/20 rounded-full mb-4">
        <FileX className="h-12 w-12 opacity-50" />
      </div>
      <p className="font-medium text-lg">{message}</p>
      <p className="text-sm mt-2 max-w-md">Logs will appear here once generated</p>
      <div className="mt-4 w-16 h-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full" />
    </div>
  );
};

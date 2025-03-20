
import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyLogsProps {
  message?: string;
}

export const EmptyLogs: React.FC<EmptyLogsProps> = ({ message = "No logs found" }) => {
  return (
    <div className="border rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground text-center">
      <FileX className="h-12 w-12 mb-4 opacity-50" />
      <p>{message}</p>
      <p className="text-sm mt-2">Logs will appear here once generated</p>
    </div>
  );
};

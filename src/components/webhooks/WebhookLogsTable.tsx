
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Check, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';
import WebhookDetailView from './WebhookDetailView';
import { EmptyLogs } from './EmptyLogs';

interface WebhookLogsTableProps {
  compact?: boolean;
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ compact = false }) => {
  const { webhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);

  // If a log is selected, show the detail view
  if (selectedLog) {
    return (
      <WebhookDetailView 
        webhookLog={selectedLog} 
        onBack={() => setSelectedLog(null)} 
      />
    );
  }

  // If no logs are found, show the empty state
  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Webhook</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhookLogs.map((log) => (
              <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell onClick={() => setSelectedLog(log)}>
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell onClick={() => setSelectedLog(log)}>
                  {log.webhookName}
                </TableCell>
                <TableCell onClick={() => setSelectedLog(log)}>
                  <span className="font-mono text-xs">
                    {log.requestMethod}
                  </span>
                </TableCell>
                <TableCell onClick={() => setSelectedLog(log)}>
                  <div className="flex items-center">
                    {log.responseStatus >= 200 && log.responseStatus < 300 ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="font-mono text-xs">{log.responseStatus}</span>
                  </div>
                </TableCell>
                <TableCell onClick={() => setSelectedLog(log)}>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{log.duration}ms</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLog(log)}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">View details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WebhookLogsTable;

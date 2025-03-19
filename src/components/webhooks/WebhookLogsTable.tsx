
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { Table, TableBody } from '@/components/ui/table';
import { 
  TableHead, 
  TableHeader,
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Eye, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Empty logs component
export const EmptyLogs: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="border rounded-md p-8 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

// Logs table header component
export const LogsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Webhook</TableHead>
        <TableHead className="hidden md:table-cell">URL</TableHead>
        <TableHead className="hidden lg:table-cell">Time</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

// Log row component
export const LogRow: React.FC<{ 
  log: WebhookLogEntry; 
  onView: (log: WebhookLogEntry) => void 
}> = ({ log, onView }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Badge variant={log.success ? 'outline' : 'secondary'} className={log.success ? 'text-green-500' : 'text-red-500'}>
          {log.success ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <XCircle className="h-3 w-3 mr-1" />
          )}
          {log.status}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{log.webhookName}</TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
          {log.url}
        </span>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatDate(log.timestamp)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(log)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Log details modal component
export const LogDetailsModal: React.FC<{
  log: WebhookLogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ log, open, onOpenChange }) => {
  if (!log) return null;

  const formatJson = (json: any) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Webhook Log Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={log.success ? 'outline' : 'secondary'} className={log.success ? 'text-green-500' : 'text-red-500'}>
                {log.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Webhook</p>
              <p className="text-sm">{log.webhookName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">URL</p>
              <p className="text-sm text-muted-foreground break-all">{log.url}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Request</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.request)}</pre>
              </ScrollArea>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Response</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.response)}</pre>
              </ScrollArea>
            </div>
          </div>

          {log.error && (
            <div>
              <p className="text-sm font-medium mb-1 text-red-500">Error</p>
              <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
                <ScrollArea className="h-[80px]">
                  <pre className="text-xs text-red-500">{log.error}</pre>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            variant="default" 
            onClick={() => window.open(log.url, '_blank')}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Open URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const WebhookLogsTable: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { webhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewLog = (log: WebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <LogsTableHeader />
          <TableBody>
            {webhookLogs.map((log) => (
              <LogRow 
                key={log.id} 
                log={log} 
                onView={handleViewLog} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <LogDetailsModal
        log={selectedLog}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhookLogEntry } from '@/types/webhook';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import WebhookEmptyState from './WebhookEmptyState';

// Incoming logs table header component
const IncomingLogsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Webhook</TableHead>
        <TableHead className="hidden md:table-cell">Path</TableHead>
        <TableHead className="hidden lg:table-cell">Time</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

// Incoming log row component
const IncomingLogRow: React.FC<{ 
  log: IncomingWebhookLogEntry; 
  onView: (log: IncomingWebhookLogEntry) => void 
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
          {log.responseStatus || 200}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{log.webhookName}</TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
          {log.endpointPath || '/webhook'}
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

// Incoming log details modal component
const IncomingLogDetailsModal: React.FC<{
  log: IncomingWebhookLogEntry | null;
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
          <DialogTitle>Incoming Webhook Log Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={log.success ? 'outline' : 'secondary'} className={log.success ? 'text-green-500' : 'text-red-500'}>
                {log.responseStatus || 200}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Webhook</p>
              <p className="text-sm">{log.webhookName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Path</p>
              <p className="text-sm text-muted-foreground break-all">{log.endpointPath || '/webhook'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Source IP</p>
              <p className="text-sm">{log.sourceIp}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Headers</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.requestHeaders)}</pre>
              </ScrollArea>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Payload</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.requestBody)}</pre>
              </ScrollArea>
            </div>
          </div>

          {log.responseBody && (
            <div>
              <p className="text-sm font-medium mb-1">Response</p>
              <div className="bg-muted p-2 rounded-md">
                <ScrollArea className="h-[80px]">
                  <pre className="text-xs">{formatJson(log.responseBody)}</pre>
                </ScrollArea>
              </div>
            </div>
          )}

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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const IncomingWebhookLogsTable: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { incomingWebhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<IncomingWebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewLog = (log: IncomingWebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (incomingWebhookLogs.length === 0) {
    return <WebhookEmptyState message="No incoming webhook logs found" />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <IncomingLogsTableHeader />
          <TableBody>
            {incomingWebhookLogs.map((log) => (
              <IncomingLogRow 
                key={log.id} 
                log={log} 
                onView={handleViewLog} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <IncomingLogDetailsModal
        log={selectedLog}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

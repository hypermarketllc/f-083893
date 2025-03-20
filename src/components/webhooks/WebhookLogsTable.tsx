import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Eye, Terminal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WebhookMethodBadge } from './WebhookMethodBadge';
import { EmptyLogs } from './EmptyLogs';
import { WebhookFilterBar, WebhookFilters } from './filters/WebhookFilterBar';

// Webhook logs table header component
const LogsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Status</TableHead>
        <TableHead>Webhook</TableHead>
        <TableHead className="hidden md:table-cell">Method</TableHead>
        <TableHead className="hidden lg:table-cell">Time</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

// Webhook log row component
const LogRow: React.FC<{ 
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
          {log.responseStatus}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{log.webhookName}</TableCell>
      <TableCell className="hidden md:table-cell">
        <WebhookMethodBadge method={log.requestMethod} />
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
const LogDetailsModal: React.FC<{
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
                {log.responseStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Webhook</p>
              <p className="text-sm">{log.webhookName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Method</p>
              <p className="text-sm">{log.requestMethod}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Request Headers</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.requestHeaders)}</pre>
              </ScrollArea>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Request Body</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[120px]">
                <pre className="text-xs">{formatJson(log.requestBody)}</pre>
              </ScrollArea>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Response Headers</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[80px]">
                <pre className="text-xs">{formatJson(log.responseHeaders)}</pre>
              </ScrollArea>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Response Body</p>
            <div className="bg-muted p-2 rounded-md">
              <ScrollArea className="h-[80px]">
                <pre className="text-xs">{formatJson(log.responseBody)}</pre>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const WebhookLogsTable: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { webhookLogs } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    tags: []
  });

  const handleViewLog = (log: WebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <>
      <div className="space-y-4">
        <WebhookFilterBar 
          onFilterChange={setFilters}
          showTagFilter={false}
        />
        
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
      </div>

      <LogDetailsModal
        log={selectedLog}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

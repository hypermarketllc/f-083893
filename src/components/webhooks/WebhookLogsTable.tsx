
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
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import WebhookMethodBadge from './WebhookMethodBadge';
import { EmptyLogs } from './EmptyLogs';

export const WebhookLogsTable: React.FC = () => {
  const { webhookLogs, searchQuery } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logs based on search query
  const filteredLogs = React.useMemo(() => {
    if (!searchQuery) return webhookLogs;
    
    const lowerSearchQuery = searchQuery.toLowerCase();
    return webhookLogs.filter(log => 
      log.webhookName.toLowerCase().includes(lowerSearchQuery) ||
      log.requestUrl.toLowerCase().includes(lowerSearchQuery) ||
      (log.requestBody && log.requestBody.toLowerCase().includes(lowerSearchQuery)) ||
      (log.responseBody && log.responseBody.toLowerCase().includes(lowerSearchQuery))
    );
  }, [webhookLogs, searchQuery]);

  const handleViewLog = (log: WebhookLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (webhookLogs.length === 0) {
    return <EmptyLogs message="No webhook logs found" />;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Webhook</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead className="hidden lg:table-cell">Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
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
                    onClick={() => handleViewLog(log)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Webhook Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={selectedLog.success ? 'outline' : 'secondary'} className={selectedLog.success ? 'text-green-500' : 'text-red-500'}>
                    {selectedLog.responseStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Webhook</p>
                  <p className="text-sm">{selectedLog.webhookName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Method</p>
                  <p className="text-sm">{selectedLog.requestMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Request Headers</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[120px]">
                    <pre className="text-xs">
                      {JSON.stringify(selectedLog.requestHeaders, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Request Body</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[120px]">
                    <pre className="text-xs">
                      {selectedLog.requestBody || 'No request body'}
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Response Headers</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[80px]">
                    <pre className="text-xs">
                      {JSON.stringify(selectedLog.responseHeaders, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Response Body</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[80px]">
                    <pre className="text-xs">
                      {selectedLog.responseBody || 'No response body'}
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              {selectedLog.error && (
                <div>
                  <p className="text-sm font-medium mb-1 text-red-500">Error</p>
                  <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
                    <ScrollArea className="h-[80px]">
                      <pre className="text-xs text-red-500">{selectedLog.error}</pre>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

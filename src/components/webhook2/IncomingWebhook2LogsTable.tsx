
import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { IncomingWebhookLogEntry } from '@/types/webhook2';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from './EmptyState';

interface IncomingWebhook2LogsTableProps {
  compact?: boolean;
  webhookId?: string;
}

export const IncomingWebhook2LogsTable: React.FC<IncomingWebhook2LogsTableProps> = ({ 
  compact,
  webhookId
}) => {
  const { incomingWebhookLogs, searchQuery, setSearchQuery } = useWebhook2Context();
  const [selectedLog, setSelectedLog] = useState<IncomingWebhookLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState<IncomingWebhookLogEntry[]>([]);

  // Filter logs based on search query and webhookId
  useEffect(() => {
    let filtered = incomingWebhookLogs;
    
    // Filter by webhookId if provided
    if (webhookId) {
      filtered = filtered.filter(log => log.webhookId === webhookId);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.webhookName.toLowerCase().includes(query) ||
        log.endpointPath.toLowerCase().includes(query) ||
        log.sourceIp.toLowerCase().includes(query) ||
        String(log.responseStatus).includes(query) ||
        (log.error && log.error.toLowerCase().includes(query))
      );
    }
    
    setFilteredLogs(filtered);
  }, [incomingWebhookLogs, webhookId, searchQuery]);

  const handleViewLog = (log: IncomingWebhookLogEntry) => {
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

  const formatJson = (json: any) => {
    try {
      if (typeof json === 'string') {
        return JSON.stringify(JSON.parse(json), null, 2);
      }
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return json;
    }
  };

  if (incomingWebhookLogs.length === 0 || (webhookId && filteredLogs.length === 0)) {
    return (
      <EmptyState
        title="No incoming logs found"
        message={webhookId 
          ? "This webhook hasn't received any data yet."
          : "No incoming webhook logs found. Incoming webhooks haven't been triggered yet."}
        showRefresh
      />
    );
  }

  if (filteredLogs.length === 0 && searchQuery) {
    return (
      <div className="space-y-4">
        <div className="flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <EmptyState
          title="No matching logs"
          message="Try adjusting your search query to find what you're looking for."
          showRefresh
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!webhookId && !compact && (
        <div className="flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Webhook</TableHead>
              <TableHead className="hidden md:table-cell">Path</TableHead>
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
                  <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                    {log.endpointPath}
                  </span>
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
            <DialogTitle>Incoming Webhook Log Details</DialogTitle>
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
                <div className="col-span-2">
                  <p className="text-sm font-medium">Path</p>
                  <p className="text-sm text-muted-foreground break-all">{selectedLog.endpointPath}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Source IP</p>
                  <p className="text-sm">{selectedLog.sourceIp}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Headers</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[120px]">
                    <pre className="text-xs">{formatJson(selectedLog.requestHeaders)}</pre>
                  </ScrollArea>
                </div>
              </div>

              {selectedLog.requestBody && (
                <div>
                  <p className="text-sm font-medium mb-1">Payload</p>
                  <div className="bg-muted p-2 rounded-md">
                    <ScrollArea className="h-[120px]">
                      <pre className="text-xs">{formatJson(selectedLog.requestBody)}</pre>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {selectedLog.parsedData && (
                <div>
                  <p className="text-sm font-medium mb-1">Parsed Data</p>
                  <div className="bg-muted p-2 rounded-md">
                    <ScrollArea className="h-[120px]">
                      <pre className="text-xs">{formatJson(selectedLog.parsedData)}</pre>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {selectedLog.responseBody && (
                <div>
                  <p className="text-sm font-medium mb-1">Response</p>
                  <div className="bg-muted p-2 rounded-md">
                    <ScrollArea className="h-[80px]">
                      <pre className="text-xs">{formatJson(selectedLog.responseBody)}</pre>
                    </ScrollArea>
                  </div>
                </div>
              )}

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
    </div>
  );
};

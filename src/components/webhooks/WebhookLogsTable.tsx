
import React, { useState, useEffect } from 'react';
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
import { WebhookFilterBar, WebhookFilters } from './filters/WebhookFilterBar';

interface WebhookLogsTableProps {
  compact?: boolean;
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ compact = false }) => {
  const { webhookLogs, webhooks } = useWebhookContext();
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [filteredLogs, setFilteredLogs] = useState<WebhookLogEntry[]>(webhookLogs);
  const [filters, setFilters] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    tags: []
  });

  // Apply filters to logs
  useEffect(() => {
    let result = [...webhookLogs];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(log => 
        log.webhookName.toLowerCase().includes(searchLower) || 
        log.requestUrl.toLowerCase().includes(searchLower) ||
        (log.requestBody && log.requestBody.toLowerCase().includes(searchLower)) ||
        (log.responseBody && log.responseBody.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.method) {
      result = result.filter(log => log.requestMethod === filters.method);
    }
    
    if (filters.status) {
      result = result.filter(log => {
        if (filters.status === 'success') {
          return log.success === true || (log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300);
        } else {
          return log.success === false || log.error || (log.responseStatus && (log.responseStatus < 200 || log.responseStatus >= 300));
        }
      });
    }
    
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter(log => {
        const logDate = new Date(log.timestamp);
        if (filters.dateFrom && logDate < filters.dateFrom) return false;
        if (filters.dateTo) {
          // Add 1 day to include the end date in the range
          const endDate = new Date(filters.dateTo);
          endDate.setDate(endDate.getDate() + 1);
          if (logDate > endDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredLogs(result);
  }, [webhookLogs, filters]);

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
    <div className="space-y-4">
      <WebhookFilterBar 
        onFilterChange={setFilters}
        showTagFilter={false}
      />
      
      <div className="rounded-md border animate-in fade-in-50 duration-300">
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
            {filteredLogs.map((log) => (
                <TableRow key={log.id} 
                  className="cursor-pointer transition-all duration-200 hover:bg-muted/50"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell>
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    {log.webhookName}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {log.requestMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {log.responseStatus >= 200 && log.responseStatus < 300 ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className="font-mono text-xs">{log.responseStatus}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{log.duration}ms</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 transition-transform hover:translate-x-1"
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
    </div>
  );
};

export default WebhookLogsTable;


import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { formatDistanceToNow } from 'date-fns';
import { WebhookLogEntry } from '@/types/webhook';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { EmptyLogs } from './EmptyLogs';
import { Skeleton } from '@/components/ui/skeleton';
import WebhookMethodBadge from './WebhookMethodBadge';

export const WebhookLogsTable: React.FC = () => {
  const { webhookLogs, searchQuery, isLoading } = useWebhookContext();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [filteredLogs, setFilteredLogs] = useState<WebhookLogEntry[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredLogs(webhookLogs.filter(log => 
        log.webhookName.toLowerCase().includes(query) ||
        log.requestUrl.toLowerCase().includes(query) ||
        (log.responseBody && log.responseBody.toLowerCase().includes(query))
      ));
    } else {
      setFilteredLogs(webhookLogs);
    }
  }, [webhookLogs, searchQuery]);

  const toggleLogExpansion = (id: string) => {
    setExpandedLog(prevId => prevId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (filteredLogs.length === 0) {
    return <EmptyLogs message={searchQuery ? "No logs matching your search criteria" : "No webhook logs found"} />;
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const formatBody = (body?: string) => {
    if (!body) return null;
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(body);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If not valid JSON, return as is
      return body;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Webhook</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="w-[100px]">Method</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="hidden md:table-cell w-[100px]">Time</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map(log => (
            <React.Fragment key={log.id}>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {log.webhookName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="truncate max-w-[300px]">
                    {log.requestUrl}
                  </div>
                </TableCell>
                <TableCell>
                  <WebhookMethodBadge method={log.requestMethod} />
                </TableCell>
                <TableCell>
                  {log.success ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {log.responseStatus}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      {log.responseStatus || "Error"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLogExpansion(log.id)}
                    >
                      {expandedLog === log.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedLog === log.id && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request</h4>
                          <div className="space-y-2">
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground">Headers</h5>
                              <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-32">
                                {JSON.stringify(log.requestHeaders, null, 2) || "No headers"}
                              </pre>
                            </div>
                            
                            {log.requestBody && (
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground">Body</h5>
                                <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-32">
                                  {formatBody(log.requestBody) || "No body"}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Response</h4>
                          <div className="space-y-2">
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground">Headers</h5>
                              <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-32">
                                {JSON.stringify(log.responseHeaders, null, 2) || "No headers"}
                              </pre>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground">Body</h5>
                              <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-64">
                                {formatBody(log.responseBody) || "No body"}
                              </pre>
                            </div>
                            
                            {log.error && (
                              <div>
                                <h5 className="text-xs font-medium text-destructive">Error</h5>
                                <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded-md mt-1 overflow-auto max-h-32">
                                  {log.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <span>Duration: {log.duration}ms</span>
                        <span className="mx-2">•</span>
                        <span>Timestamp: {new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

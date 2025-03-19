
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export const WebhookLogsTable: React.FC = () => {
  const { filteredWebhookLogs } = useWebhookContext();
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id) 
        : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedLogs.includes(id);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Webhook</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWebhookLogs.length > 0 ? (
            filteredWebhookLogs.map((log) => (
              <React.Fragment key={log.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(log.id)}
                >
                  <TableCell>
                    {isExpanded(log.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.webhookName}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.requestMethod}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {log.requestUrl}
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" /> {log.responseStatus}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" /> {log.responseStatus || 'Error'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.timestamp), 'PPpp')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{log.duration}ms</span>
                    </div>
                  </TableCell>
                </TableRow>
                
                {isExpanded(log.id) && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Request</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="text-sm font-medium">URL</div>
                                <div className="text-sm break-all">{log.requestUrl}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Method</div>
                                <div className="text-sm">{log.requestMethod}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Headers</div>
                                <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-32">
                                  {JSON.stringify(log.requestHeaders, null, 2)}
                                </pre>
                              </div>
                              {log.requestBody && (
                                <div>
                                  <div className="text-sm font-medium">Body</div>
                                  <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-32">
                                    {log.requestBody}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Response</h4>
                            {log.success ? (
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm font-medium">Status</div>
                                  <div className="text-sm">{log.responseStatus}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">Headers</div>
                                  <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-32">
                                    {JSON.stringify(log.responseHeaders, null, 2)}
                                  </pre>
                                </div>
                                {log.responseBody && (
                                  <div>
                                    <div className="text-sm font-medium">Body</div>
                                    <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-32">
                                      {log.responseBody}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                                <div className="font-medium">Error</div>
                                <div>{log.error || 'Unknown error'}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

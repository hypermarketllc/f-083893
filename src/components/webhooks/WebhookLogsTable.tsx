
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry } from '@/types/webhook';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Check,
  ChevronDown, 
  Code,
  AlertCircle
} from 'lucide-react';

interface WebhookLogsTableProps {
  compact?: boolean;
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ compact = false }) => {
  const { webhookLogs, searchQuery } = useWebhookContext();
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>([]);

  const toggleLogExpand = (logId: string) => {
    if (expandedLogIds.includes(logId)) {
      setExpandedLogIds(expandedLogIds.filter(id => id !== logId));
    } else {
      setExpandedLogIds([...expandedLogIds, logId]);
    }
  };

  if (!webhookLogs) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <Check className="h-3 w-3 mr-1" /> 
          {status}
        </Badge>
      );
    } else if (status >= 400 && status < 500) {
      return <Badge variant="secondary">{status}</Badge>;
    } else if (status >= 500) {
      return <Badge variant="destructive">{status}</Badge>;
    } else {
      return <Badge>{status}</Badge>;
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {webhookLogs.length === 0 ? (
          <div className="text-center p-6 border rounded-lg">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No logs found</p>
          </div>
        ) : (
          webhookLogs.map((log) => (
            <div key={log.id} className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium truncate">{log.webhookName}</div>
                {getStatusBadge(log.responseStatus)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')} • {log.requestMethod} • {log.duration}ms
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div>
      {webhookLogs.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No logs found</h3>
          <p className="text-muted-foreground mt-1">{searchQuery ? 'Try adjusting your search query' : 'Webhook logs will appear here'}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Webhook</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Success</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhookLogs.map((log) => (
              <React.Fragment key={log.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleLogExpand(log.id)}
                >
                  <TableCell className="font-medium">{log.webhookName}</TableCell>
                  <TableCell>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                  <TableCell>{log.requestMethod}</TableCell>
                  <TableCell>{getStatusBadge(log.responseStatus)}</TableCell>
                  <TableCell>{log.duration}ms</TableCell>
                  <TableCell>
                    {log.success ? 
                      <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3" /></Badge> : 
                      <Badge variant="destructive"><AlertCircle className="h-3 w-3" /></Badge>
                    }
                  </TableCell>
                </TableRow>
                {expandedLogIds.includes(log.id) && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={6} className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="request" className="border-0">
                          <AccordionTrigger className="px-4 py-2">
                            <div className="flex items-center">
                              <Code className="h-4 w-4 mr-2" />
                              Request Details
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-sm">URL</h4>
                                <p className="text-sm text-muted-foreground break-all">{log.requestUrl}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Headers</h4>
                                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                  {JSON.stringify(log.requestHeaders, null, 2)}
                                </pre>
                              </div>
                              {log.requestBody && (
                                <div>
                                  <h4 className="font-medium text-sm">Body</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {JSON.stringify(JSON.parse(log.requestBody), null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="response" className="border-0">
                          <AccordionTrigger className="px-4 py-2">
                            <div className="flex items-center">
                              <Code className="h-4 w-4 mr-2" />
                              Response Details
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-sm">Status</h4>
                                <p className="text-sm text-muted-foreground">{log.responseStatus} ({log.success ? 'Success' : 'Failed'})</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Headers</h4>
                                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                  {JSON.stringify(log.responseHeaders, null, 2)}
                                </pre>
                              </div>
                              {log.responseBody && (
                                <div>
                                  <h4 className="font-medium text-sm">Body</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {log.responseBody}
                                  </pre>
                                </div>
                              )}
                              {log.error && (
                                <div>
                                  <h4 className="font-medium text-sm">Error</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto text-destructive">
                                    {log.error}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

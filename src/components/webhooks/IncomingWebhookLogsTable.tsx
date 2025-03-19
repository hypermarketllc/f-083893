
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhookLogEntry } from '@/types/webhook';
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
  Code,
  AlertCircle
} from 'lucide-react';

interface IncomingWebhookLogsTableProps {
  compact?: boolean;
}

export const IncomingWebhookLogsTable: React.FC<IncomingWebhookLogsTableProps> = ({ compact = false }) => {
  const { incomingWebhookLogs, searchQuery } = useWebhookContext();
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>([]);

  const toggleLogExpand = (logId: string) => {
    if (expandedLogIds.includes(logId)) {
      setExpandedLogIds(expandedLogIds.filter(id => id !== logId));
    } else {
      setExpandedLogIds([...expandedLogIds, logId]);
    }
  };

  if (!incomingWebhookLogs) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {incomingWebhookLogs.length === 0 ? (
          <div className="text-center p-6 border rounded-lg">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No logs found</p>
          </div>
        ) : (
          incomingWebhookLogs.map((log) => (
            <div key={log.id} className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium truncate">{log.webhookName}</div>
                <Badge variant={log.isParsed ? "default" : "outline"}>
                  {log.isParsed ? <Check className="h-3 w-3" /> : "Unparsed"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')} • {log.requestMethod}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div>
      {incomingWebhookLogs.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No logs found</h3>
          <p className="text-muted-foreground mt-1">{searchQuery ? 'Try adjusting your search query' : 'Incoming webhook logs will appear here'}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Webhook</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Parsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingWebhookLogs.map((log) => (
              <React.Fragment key={log.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleLogExpand(log.id)}
                >
                  <TableCell className="font-medium">{log.webhookName}</TableCell>
                  <TableCell>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</TableCell>
                  <TableCell>{log.requestMethod}</TableCell>
                  <TableCell>
                    {log.isParsed ? 
                      <Badge variant="default"><Check className="h-3 w-3" /></Badge> : 
                      <Badge variant="outline">Unparsed</Badge>
                    }
                  </TableCell>
                </TableRow>
                {expandedLogIds.includes(log.id) && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={4} className="p-0">
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
                                <h4 className="font-medium text-sm">Headers</h4>
                                <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                  {JSON.stringify(log.requestHeaders, null, 2)}
                                </pre>
                              </div>
                              {log.requestQuery && Object.keys(log.requestQuery).length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm">Query Parameters</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {JSON.stringify(log.requestQuery, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.requestBody && (
                                <div>
                                  <h4 className="font-medium text-sm">Body</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {log.requestBody}
                                  </pre>
                                </div>
                              )}
                              {log.parsedData && (
                                <div>
                                  <h4 className="font-medium text-sm">Parsed Data</h4>
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {log.parsedData}
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

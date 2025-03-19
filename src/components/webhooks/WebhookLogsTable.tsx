
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
import { Button } from '@/components/ui/button';
import { 
  Check,
  ChevronDown, 
  Code,
  AlertCircle,
  Eye,
  CopyCheck
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WebhookLogsTableProps {
  compact?: boolean;
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ compact = false }) => {
  const { webhookLogs, searchQuery } = useWebhookContext();
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>([]);
  const [viewingLog, setViewingLog] = useState<WebhookLogEntry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const toggleLogExpand = (logId: string) => {
    if (expandedLogIds.includes(logId)) {
      setExpandedLogIds(expandedLogIds.filter(id => id !== logId));
    } else {
      setExpandedLogIds([...expandedLogIds, logId]);
    }
  };

  const openLogDetails = (log: WebhookLogEntry, event: React.MouseEvent) => {
    event.stopPropagation();
    setViewingLog(log);
    setDetailsDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')} • {log.requestMethod} • {log.duration}ms</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 ml-2 -mr-1" 
                  onClick={(e) => openLogDetails(log, e)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
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
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => openLogDetails(log, e)}
                      className="h-8"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogIds.includes(log.id) && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={7} className="p-0">
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

      {/* Full Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Webhook Log Details
            </DialogTitle>
          </DialogHeader>
          
          {viewingLog && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Webhook</h3>
                  <p className="text-sm">{viewingLog.webhookName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Timestamp</h3>
                  <p className="text-sm">{format(new Date(viewingLog.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Method</h3>
                  <p className="text-sm">{viewingLog.requestMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  {getStatusBadge(viewingLog.responseStatus)}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Duration</h3>
                  <p className="text-sm">{viewingLog.duration}ms</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Success</h3>
                  {viewingLog.success ? 
                    <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1" /> Yes</Badge> : 
                    <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> No</Badge>
                  }
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Request URL</h3>
                <div className="relative">
                  <div className="text-sm bg-muted p-3 rounded-md overflow-auto">
                    {viewingLog.requestUrl}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7" 
                    onClick={() => copyToClipboard(viewingLog.requestUrl)}
                  >
                    <CopyCheck className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Request Headers</h3>
                <div className="relative">
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48">
                    {JSON.stringify(viewingLog.requestHeaders, null, 2)}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7" 
                    onClick={() => copyToClipboard(JSON.stringify(viewingLog.requestHeaders, null, 2))}
                  >
                    <CopyCheck className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {viewingLog.requestBody && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Request Body</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64">
                      {typeof viewingLog.requestBody === 'string' ? 
                        viewingLog.requestBody : 
                        JSON.stringify(viewingLog.requestBody, null, 2)}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(typeof viewingLog.requestBody === 'string' ? 
                        viewingLog.requestBody : 
                        JSON.stringify(viewingLog.requestBody, null, 2))}
                    >
                      <CopyCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Response Headers</h3>
                <div className="relative">
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48">
                    {JSON.stringify(viewingLog.responseHeaders, null, 2)}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7" 
                    onClick={() => copyToClipboard(JSON.stringify(viewingLog.responseHeaders, null, 2))}
                  >
                    <CopyCheck className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {viewingLog.responseBody && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Response Body</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64">
                      {viewingLog.responseBody}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(viewingLog.responseBody)}
                    >
                      <CopyCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {viewingLog.error && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Error</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64 text-destructive">
                      {viewingLog.error}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(viewingLog.error || '')}
                    >
                      <CopyCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

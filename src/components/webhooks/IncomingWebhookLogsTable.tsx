
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
import { Button } from '@/components/ui/button';
import { 
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Eye,
  AlertCircle,
  CopyCheck,
  Clock,
  FileJson
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IncomingWebhookLogsTableProps {
  compact?: boolean;
}

export const IncomingWebhookLogsTable: React.FC<IncomingWebhookLogsTableProps> = ({ compact = false }) => {
  const { incomingWebhookLogs, searchQuery } = useWebhookContext();
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>([]);
  const [viewingLog, setViewingLog] = useState<IncomingWebhookLogEntry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const toggleLogExpand = (logId: string) => {
    if (expandedLogIds.includes(logId)) {
      setExpandedLogIds(expandedLogIds.filter(id => id !== logId));
    } else {
      setExpandedLogIds([...expandedLogIds, logId]);
    }
  };

  const openLogDetails = (log: IncomingWebhookLogEntry, event: React.MouseEvent) => {
    event.stopPropagation();
    setViewingLog(log);
    setDetailsDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{log.requestMethod}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={(e) => openLogDetails(log, e)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
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
              <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell colSpan={5} className="p-0">
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
                                <div className="relative">
                                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                    {JSON.stringify(log.requestHeaders, null, 2)}
                                  </pre>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100" 
                                    onClick={() => copyToClipboard(JSON.stringify(log.requestHeaders, null, 2))}
                                  >
                                    <CopyCheck className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {log.requestQuery && Object.keys(log.requestQuery).length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm">Query Parameters</h4>
                                  <div className="relative">
                                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                      {JSON.stringify(log.requestQuery, null, 2)}
                                    </pre>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100" 
                                      onClick={() => copyToClipboard(JSON.stringify(log.requestQuery, null, 2))}
                                    >
                                      <CopyCheck className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {log.requestBody && (
                                <div>
                                  <h4 className="font-medium text-sm">Body</h4>
                                  <div className="relative">
                                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                      {log.requestBody}
                                    </pre>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100" 
                                      onClick={() => copyToClipboard(log.requestBody)}
                                    >
                                      <CopyCheck className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {log.parsedData && (
                                <div>
                                  <h4 className="font-medium text-sm">Parsed Data</h4>
                                  <div className="relative">
                                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                      {log.parsedData}
                                    </pre>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100" 
                                      onClick={() => copyToClipboard(log.parsedData)}
                                    >
                                      <CopyCheck className="h-3 w-3" />
                                    </Button>
                                  </div>
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
              <FileJson className="h-5 w-5" />
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
                  <Badge variant={viewingLog.isParsed ? "default" : "outline"}>
                    {viewingLog.isParsed ? "Parsed" : "Unparsed"}
                  </Badge>
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
              
              {viewingLog.requestQuery && Object.keys(viewingLog.requestQuery).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Query Parameters</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48">
                      {JSON.stringify(viewingLog.requestQuery, null, 2)}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(JSON.stringify(viewingLog.requestQuery, null, 2))}
                    >
                      <CopyCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {viewingLog.requestBody && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Request Body</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64">
                      {viewingLog.requestBody}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(viewingLog.requestBody)}
                    >
                      <CopyCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {viewingLog.parsedData && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Parsed Data</h3>
                  <div className="relative">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64">
                      {viewingLog.parsedData}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7" 
                      onClick={() => copyToClipboard(viewingLog.parsedData)}
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

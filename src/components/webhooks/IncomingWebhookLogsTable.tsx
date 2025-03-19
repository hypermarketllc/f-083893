
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
import { 
  ChevronDown, 
  ChevronRight, 
  Clock,
  Code
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export const IncomingWebhookLogsTable: React.FC = () => {
  const { filteredIncomingWebhookLogs, parseIncomingWebhookLog } = useWebhookContext();
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => 
      prev.includes(id) 
        ? prev.filter(logId => logId !== id) 
        : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedLogs.includes(id);
  
  const handleParse = (log: typeof filteredIncomingWebhookLogs[0]) => {
    parseIncomingWebhookLog(log);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Webhook</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Parsed</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIncomingWebhookLogs.length > 0 ? (
            filteredIncomingWebhookLogs.map((log) => (
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
                  </TableCell>
                  <TableCell>
                    {log.requestMethod}
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
                    {log.isParsed ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleParse(log);
                      }}
                      disabled={log.isParsed}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Parse
                    </Button>
                  </TableCell>
                </TableRow>
                
                {isExpanded(log.id) && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Request Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="space-y-2">
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
                                {log.requestQuery && Object.keys(log.requestQuery).length > 0 && (
                                  <div>
                                    <div className="text-sm font-medium">Query Parameters</div>
                                    <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-32">
                                      {JSON.stringify(log.requestQuery, null, 2)}
                                    </pre>
                                  </div>
                                )}
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
                            
                            {log.isParsed && log.parsedData && (
                              <div>
                                <div className="text-sm font-medium">Parsed Data</div>
                                <pre className="text-xs bg-background p-2 rounded-md overflow-auto max-h-96">
                                  {log.parsedData}
                                </pre>
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

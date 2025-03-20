
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookLogEntry, Webhook } from '@/types/webhook';
import { WebhookLogsTable } from './WebhookLogsTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow, format } from 'date-fns';
import { Play, ArrowLeft, Edit, Clock, CheckCircle, XCircle, Copy, Eye } from 'lucide-react';
import WebhookMethodBadge from './WebhookMethodBadge';
import { WebhookTestPanel } from './WebhookTestPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ensureLogEntryFields } from '@/contexts/webhook/webhookUtils';

interface WebhookDetailViewProps {
  webhook?: Webhook | null;
  onBack?: () => void;
}

export const WebhookDetailView: React.FC<WebhookDetailViewProps> = ({ webhook, onBack }) => {
  const { 
    webhookLogs, 
    executeWebhook, 
    isTestMode, 
    setIsTestMode,
    handleEditWebhook
  } = useWebhookContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLog, setSelectedLog] = useState<WebhookLogEntry | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  if (!webhook) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">No webhook selected</p>
      </div>
    );
  }
  
  const filteredLogs = webhookLogs.filter(log => log.webhookId === webhook.id);
  
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };
  
  const formatFullDate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    try {
      return format(new Date(timestamp), 'PPpp');
    } catch (e) {
      return timestamp;
    }
  };
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const handleViewLog = (log: WebhookLogEntry) => {
    setSelectedLog(ensureLogEntryFields(log));
    setIsLogModalOpen(true);
  };
  
  const handleExecute = () => {
    executeWebhook(webhook);
  };
  
  const getExecutionStatusColor = (status: 'success' | 'error' | null) => {
    if (status === 'success') return 'text-green-500';
    if (status === 'error') return 'text-red-500';
    return 'text-muted-foreground';
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
  
  const LogDetailsModal: React.FC = () => {
    if (!selectedLog) return null;
    
    const getQueryParamsFromUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        const params: Record<string, string> = {};
        urlObj.searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return params;
      } catch (e) {
        return {};
      }
    };
    
    // Use the requestUrl to extract query parameters if not available directly
    const queryParams = selectedLog.requestQuery || getQueryParamsFromUrl(selectedLog.requestUrl);
    
    return (
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Webhook Log Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={selectedLog.success ? 'outline' : 'secondary'} className={selectedLog.success ? 'text-green-500' : 'text-red-500'}>
                  {selectedLog.responseStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm">{formatDuration(selectedLog.duration)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">URL</p>
                <p className="text-sm text-muted-foreground break-all">{selectedLog.requestUrl}</p>
              </div>
              
              {Object.keys(queryParams).length > 0 && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Query Parameters</p>
                  <div className="bg-muted p-2 rounded-md mt-1">
                    <pre className="text-xs">{formatJson(queryParams)}</pre>
                  </div>
                </div>
              )}
              
              <div className="col-span-2">
                <p className="text-sm font-medium">Request Time</p>
                <p className="text-sm">{formatFullDate(selectedLog.requestTime || selectedLog.timestamp)}</p>
              </div>
              
              {selectedLog.ipAddress && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Source IP</p>
                  <p className="text-sm">{selectedLog.ipAddress}</p>
                </div>
              )}
              
              <div className="col-span-2">
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-sm">{formatFullDate(selectedLog.responseTime)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Request Headers</p>
              <div className="bg-muted p-2 rounded-md">
                <ScrollArea className="h-[120px]">
                  <pre className="text-xs">{formatJson(selectedLog.requestHeaders)}</pre>
                </ScrollArea>
              </div>
            </div>

            {selectedLog.requestBody && (
              <div>
                <p className="text-sm font-medium mb-1">Request Body</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[120px]">
                    <pre className="text-xs">{formatJson(selectedLog.requestBody)}</pre>
                  </ScrollArea>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-1">Response Headers</p>
              <div className="bg-muted p-2 rounded-md">
                <ScrollArea className="h-[120px]">
                  <pre className="text-xs">{formatJson(selectedLog.responseHeaders)}</pre>
                </ScrollArea>
              </div>
            </div>

            {selectedLog.responseBody && (
              <div>
                <p className="text-sm font-medium mb-1">Response Body</p>
                <div className="bg-muted p-2 rounded-md">
                  <ScrollArea className="h-[120px]">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-xl font-semibold">{webhook.name}</h2>
          <WebhookMethodBadge method={webhook.method} />
          {webhook.enabled ? (
            <Badge variant="outline" className="text-green-500">Active</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditWebhook(webhook)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant={isTestMode ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsTestMode(!isTestMode)}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Test
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExecute}
            disabled={!webhook.enabled}
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Execute
          </Button>
        </div>
      </div>

      {webhook.description && (
        <p className="text-sm text-muted-foreground">{webhook.description}</p>
      )}

      {isTestMode ? (
        <WebhookTestPanel webhook={webhook} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs ({filteredLogs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Webhook Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">URL</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm font-medium break-all">{webhook.url}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => copyToClipboard(webhook.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Method</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm font-medium">{webhook.method}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Headers</p>
                    <div className="mt-1 text-xs">
                      {webhook.headers.length > 0 ? (
                        <div className="space-y-1">
                          {webhook.headers.filter(h => h.enabled).map((header, index) => (
                            <div key={index} className="flex">
                              <span className="font-medium mr-2">{header.key}:</span>
                              <span>{header.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No headers</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Parameters</p>
                    <div className="mt-1 text-xs">
                      {webhook.params.length > 0 ? (
                        <div className="space-y-1">
                          {webhook.params.filter(p => p.enabled).map((param, index) => (
                            <div key={index} className="flex">
                              <span className="font-medium mr-2">{param.key}:</span>
                              <span>{param.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No parameters</span>
                      )}
                    </div>
                  </div>
                  
                  {webhook.body && (
                    <div>
                      <p className="text-xs text-muted-foreground">Body ({webhook.body.contentType})</p>
                      <div className="mt-1 text-xs">
                        <div className="bg-muted p-2 rounded-md">
                          <ScrollArea className="h-[100px]">
                            <pre className="text-xs">{formatJson(webhook.body.content)}</pre>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Execution History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Last Executed</p>
                    <div className="flex items-center space-x-1">
                      {webhook.lastExecutedAt ? (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <p className="text-sm font-medium">{formatTime(webhook.lastExecutedAt)}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Never executed</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Last Status</p>
                    <div className="flex items-center space-x-1">
                      {webhook.lastExecutionStatus ? (
                        <div className="flex items-center">
                          {webhook.lastExecutionStatus === 'success' ? (
                            <CheckCircle className={`h-3 w-3 mr-1 ${getExecutionStatusColor(webhook.lastExecutionStatus)}`} />
                          ) : (
                            <XCircle className={`h-3 w-3 mr-1 ${getExecutionStatusColor(webhook.lastExecutionStatus)}`} />
                          )}
                          <p className={`text-sm font-medium ${getExecutionStatusColor(webhook.lastExecutionStatus)}`}>
                            {webhook.lastExecutionStatus === 'success' ? 'Success' : 'Failed'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No status yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Webhook Created</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <p className="text-sm font-medium">{formatTime(webhook.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <p className="text-sm font-medium">{formatTime(webhook.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            {filteredLogs.length > 0 ? (
              <div className="space-y-2">
                {filteredLogs.map(log => (
                  <div 
                    key={log.id}
                    className="p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleViewLog(log)}
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant={log.success ? 'outline' : 'secondary'} className={log.success ? 'text-green-500' : 'text-red-500'}>
                        {log.success ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {log.responseStatus}
                      </Badge>
                      
                      <div>
                        <p className="text-sm font-medium">{formatTime(log.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">{formatDuration(log.duration)}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-md">
                <p className="text-muted-foreground mb-2">No execution logs yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExecute}
                  disabled={!webhook.enabled}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Execute Webhook
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <LogDetailsModal />
    </div>
  );
};


import React, { useState } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { Webhook } from '@/types/webhook2';
import { Webhook2LogsTable } from './Webhook2LogsTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Play, Clock, CheckCircle, XCircle, Copy, Eye } from 'lucide-react';
import { WebhookMethodBadge } from './WebhookMethodBadge';
import { Webhook2TestPanel } from './Webhook2TestPanel';

interface Webhook2DetailViewProps {
  webhook?: Webhook | null;
  onBack?: () => void;
}

export const Webhook2DetailView: React.FC<Webhook2DetailViewProps> = ({ 
  webhook, 
  onBack 
}) => {
  const { 
    executeWebhook, 
    isTestMode, 
    setIsTestMode,
    handleEditWebhook
  } = useWebhook2Context();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!webhook) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">No webhook selected</p>
      </div>
    );
  }
  
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    try {
      const date = new Date(timestamp);
      return format(date, 'PPpp');
    } catch (e) {
      return timestamp;
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
        <Webhook2TestPanel webhook={webhook} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
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
                    <p className="text-xs text-muted-foreground">Created</p>
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
            <Webhook2LogsTable webhookId={webhook.id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

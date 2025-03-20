
import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { Webhook, WebhookLogEntry } from '@/types/webhook2';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Play, ArrowLeft, Clock, Trash } from 'lucide-react';
import { WebhookMethodBadge } from './WebhookMethodBadge';
import { EmptyState } from './EmptyState';

interface Webhook2TestPanelProps {
  webhook: Webhook;
}

export const Webhook2TestPanel: React.FC<Webhook2TestPanelProps> = ({ webhook }) => {
  const { 
    sendTestRequest, 
    testResponse, 
    isTestLoading, 
    clearTestResponse, 
    setIsTestMode 
  } = useWebhook2Context();
  
  const [activeTab, setActiveTab] = useState('request');

  const handleTest = async () => {
    try {
      await sendTestRequest(webhook);
    } catch (error) {
      console.error('Test request failed:', error);
    }
  };

  const handleExit = () => {
    setIsTestMode(false);
    clearTestResponse();
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

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const buildRequestUrl = () => {
    let url = webhook.url;
    
    // Add params to URL for display
    if (webhook.params && webhook.params.length > 0) {
      const enabledParams = webhook.params.filter(param => param.enabled);
      if (enabledParams.length > 0) {
        const queryParams = new URLSearchParams();
        enabledParams.forEach(param => {
          queryParams.append(param.key, param.value);
        });
        
        // Check if URL already has query parameters
        url += url.includes('?') ? '&' : '?';
        url += queryParams.toString();
      }
    }
    
    return url;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExit}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Test Mode
          </Button>
        </div>
        <div className="flex space-x-2">
          {testResponse && (
            <Button variant="outline" size="sm" onClick={clearTestResponse}>
              <Trash className="h-4 w-4 mr-2" />
              Clear Results
            </Button>
          )}
          <Button size="sm" onClick={handleTest} disabled={isTestLoading}>
            <Play className="h-4 w-4 mr-2" />
            {isTestLoading ? 'Testing...' : 'Run Test'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request</CardTitle>
            <CardDescription>
              This will simulate a request to the webhook endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">URL</p>
              <p className="text-sm font-medium break-all border p-2 rounded-md bg-muted">
                {buildRequestUrl()}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Method</p>
              <div>
                <WebhookMethodBadge method={webhook.method} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Headers</p>
              {webhook.headers.filter(h => h.enabled).length > 0 ? (
                <div className="border rounded-md p-2 bg-muted">
                  <ScrollArea className="h-[100px]">
                    <div className="space-y-1 text-xs">
                      {webhook.headers.filter(h => h.enabled).map((header, index) => (
                        <div key={index} className="flex">
                          <span className="font-medium mr-2">{header.key}:</span>
                          <span>{header.value}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No headers</p>
              )}
            </div>
            
            {webhook.method !== 'GET' && webhook.body && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Body ({webhook.body.contentType})</p>
                <div className="border rounded-md p-2 bg-muted">
                  <ScrollArea className="h-[150px]">
                    <pre className="text-xs">{formatJson(webhook.body.content)}</pre>
                  </ScrollArea>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Response</CardTitle>
            <CardDescription>
              {isTestLoading 
                ? 'Waiting for response...' 
                : testResponse 
                  ? `Response received in ${formatDuration(testResponse.duration)}` 
                  : 'Run the test to see the response'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTestLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Executing webhook...</p>
              </div>
            ) : testResponse ? (
              <Tabs defaultValue="response" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="response" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant={testResponse.success ? 'outline' : 'secondary'}
                      className={testResponse.success ? 'text-green-500' : 'text-red-500'}
                    >
                      {testResponse.success ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {testResponse.responseStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(testResponse.duration)}
                    </p>
                  </div>
                  
                  {testResponse.responseBody ? (
                    <div className="border rounded-md p-2 bg-muted">
                      <ScrollArea className="h-[300px]">
                        <pre className="text-xs">{formatJson(testResponse.responseBody)}</pre>
                      </ScrollArea>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No response body</p>
                  )}
                  
                  {testResponse.error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error</p>
                      <p className="text-xs text-red-600 dark:text-red-400">{testResponse.error}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="headers">
                  {Object.keys(testResponse.responseHeaders || {}).length > 0 ? (
                    <div className="border rounded-md p-2 bg-muted">
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-1 text-xs">
                          {Object.entries(testResponse.responseHeaders || {}).map(([key, value], index) => (
                            <div key={index} className="flex">
                              <span className="font-medium mr-2">{key}:</span>
                              <span className="text-muted-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No response headers</p>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <EmptyState
                title="No test results yet"
                message="Click the 'Run Test' button to send a test request and see the results here."
                icon={<Play className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

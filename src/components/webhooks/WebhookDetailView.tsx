
import React, { useState } from 'react';
import { WebhookLogEntry } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Code,
  Globe,
  Server,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Copy,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WebhookDetailViewProps {
  webhookLog: WebhookLogEntry;
  onBack: () => void;
}

const WebhookDetailView: React.FC<WebhookDetailViewProps> = ({ webhookLog, onBack }) => {
  const [activeTab, setActiveTab] = useState('request');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss.SSS');
    } catch (e) {
      return dateString;
    }
  };

  const formatJson = (json: string | undefined) => {
    if (!json) return '';
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  const copyToClipboard = (text: string | undefined, field: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Logs
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        {/* Header */}
        <div className="px-5 py-4 bg-muted/30 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {webhookLog.webhookName}
                <Badge 
                  variant={webhookLog.success ? 'outline' : 'secondary'} 
                  className={webhookLog.success ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}
                >
                  {webhookLog.success ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {webhookLog.responseStatus}
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formatDate(webhookLog.timestamp)}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-mono text-sm px-2 py-1 rounded bg-muted">
                {webhookLog.requestMethod}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{webhookLog.duration}ms</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-5 py-3 border-b bg-background">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <div className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center">
              {webhookLog.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="ml-3 text-sm">
              <div className="font-medium">
                {webhookLog.requestUrl}
              </div>
              <div className="text-muted-foreground text-xs">
                Request: {formatDate(webhookLog.requestTime)} • Response: {formatDate(webhookLog.responseTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-5 pt-4">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="request">
                <ArrowRight className="h-4 w-4 mr-1.5" />
                Request
              </TabsTrigger>
              <TabsTrigger value="response">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Response
              </TabsTrigger>
              <TabsTrigger value="details">
                <Code className="h-4 w-4 mr-1.5" />
                Details
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-5">
            <TabsContent value="request" className="mt-0 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">URL</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(webhookLog.requestUrl, 'URL')}
                  >
                    {copiedField === 'URL' ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                  {webhookLog.requestUrl}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Headers</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(JSON.stringify(webhookLog.requestHeaders, null, 2), 'Request Headers')}
                  >
                    {copiedField === 'Request Headers' ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-[150px] w-full">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="font-mono text-xs">
                      {JSON.stringify(webhookLog.requestHeaders, null, 2)}
                    </pre>
                  </div>
                </ScrollArea>
              </div>

              {webhookLog.requestBody && (
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Body</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(formatJson(webhookLog.requestBody), 'Request Body')}
                    >
                      {copiedField === 'Request Body' ? (
                        <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <ScrollArea className="h-[250px] w-full">
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="font-mono text-xs">
                        {formatJson(webhookLog.requestBody)}
                      </pre>
                    </div>
                  </ScrollArea>
                </div>
              )}

              {webhookLog.requestQuery && Object.keys(webhookLog.requestQuery).length > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Query Parameters</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(JSON.stringify(webhookLog.requestQuery, null, 2), 'Query Parameters')}
                    >
                      {copiedField === 'Query Parameters' ? (
                        <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="font-mono text-xs">
                      {JSON.stringify(webhookLog.requestQuery, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="response" className="mt-0 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge
                    variant={webhookLog.success ? 'outline' : 'secondary'}
                    className={webhookLog.success ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}
                  >
                    {webhookLog.success ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {webhookLog.responseStatus}
                  </Badge>
                </div>
                {webhookLog.error && (
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-md text-red-600 dark:text-red-400">
                    <p className="font-medium mb-1">Error</p>
                    <p className="text-sm">{webhookLog.error}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Headers</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(JSON.stringify(webhookLog.responseHeaders, null, 2), 'Response Headers')}
                  >
                    {copiedField === 'Response Headers' ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-[150px] w-full">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="font-mono text-xs">
                      {JSON.stringify(webhookLog.responseHeaders, null, 2)}
                    </pre>
                  </div>
                </ScrollArea>
              </div>

              {webhookLog.responseBody && (
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Body</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(formatJson(webhookLog.responseBody), 'Response Body')}
                    >
                      {copiedField === 'Response Body' ? (
                        <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <ScrollArea className="h-[250px] w-full">
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="font-mono text-xs">
                        {formatJson(webhookLog.responseBody)}
                      </pre>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Request Details</h3>
                  <dl className="space-y-2">
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Webhook ID</dt>
                      <dd className="text-sm font-mono">{webhookLog.webhookId}</dd>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Request Time</dt>
                      <dd className="text-sm">{formatDate(webhookLog.requestTime)}</dd>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Method</dt>
                      <dd className="text-sm font-mono">{webhookLog.requestMethod}</dd>
                    </div>
                    {webhookLog.ipAddress && (
                      <div className="bg-muted p-2 rounded-md">
                        <dt className="text-xs text-muted-foreground">IP Address</dt>
                        <dd className="text-sm font-mono">{webhookLog.ipAddress}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Response Details</h3>
                  <dl className="space-y-2">
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Response Time</dt>
                      <dd className="text-sm">{formatDate(webhookLog.responseTime)}</dd>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Status</dt>
                      <dd className="text-sm font-mono flex items-center">
                        {webhookLog.responseStatus}
                        {webhookLog.success ? (
                          <CheckCircle className="h-3.5 w-3.5 ml-1.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 ml-1.5 text-red-500" />
                        )}
                      </dd>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <dt className="text-xs text-muted-foreground">Duration</dt>
                      <dd className="text-sm">{webhookLog.duration}ms</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WebhookDetailView;

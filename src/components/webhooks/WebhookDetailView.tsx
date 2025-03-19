
import React, { useState } from 'react';
import { Webhook, WebhookLogEntry } from '@/types/webhook';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  Copy, 
  ArrowRight, 
  Clock, 
  Calendar, 
  X,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import WebhookMethodBadge from './WebhookMethodBadge';

interface WebhookDetailViewProps {
  webhookLog: WebhookLogEntry;
  onBack: () => void;
}

const WebhookDetailView: React.FC<WebhookDetailViewProps> = ({ webhookLog, onBack }) => {
  const [activeTab, setActiveTab] = useState('request');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <CardTitle>Webhook Log Details</CardTitle>
          </div>
          <Badge 
            className={`${
              webhookLog.status >= 200 && webhookLog.status < 300 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {webhookLog.status >= 200 && webhookLog.status < 300 ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <X className="h-3 w-3 mr-1" />
            )}
            Status: {webhookLog.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-4">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(webhookLog.timestamp), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(webhookLog.timestamp), 'HH:mm:ss')}
          </span>
          <span className="flex items-center">
            <WebhookMethodBadge method={webhookLog.method} />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">URL</h3>
                <div className="relative">
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    {webhookLog.url}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(webhookLog.url)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Headers</h3>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {webhookLog.headers.map((header, index) => (
                    <div key={index} className="flex items-start py-1 border-b last:border-0">
                      <div className="font-medium min-w-32">{header.key}:</div>
                      <div className="text-muted-foreground truncate">{header.value}</div>
                    </div>
                  ))}
                  {webhookLog.headers.length === 0 && (
                    <div className="text-muted-foreground">No headers</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">URL Parameters</h3>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {webhookLog.urlParams.map((param, index) => (
                    <div key={index} className="flex items-start py-1 border-b last:border-0">
                      <div className="font-medium min-w-32">{param.key}:</div>
                      <div className="text-muted-foreground truncate">{param.value}</div>
                    </div>
                  ))}
                  {webhookLog.urlParams.length === 0 && (
                    <div className="text-muted-foreground">No URL parameters</div>
                  )}
                </div>
              </div>

              {webhookLog.body && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Request Body</h3>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                      {formatJSON(webhookLog.body)}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(webhookLog.body)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="response" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="flex items-center mt-1">
                    <Badge 
                      className={`${
                        webhookLog.status >= 200 && webhookLog.status < 300 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {webhookLog.status}
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {webhookLog.status >= 200 && webhookLog.status < 300 
                        ? 'Success' 
                        : 'Error'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">Duration</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {webhookLog.duration ? `${webhookLog.duration}ms` : 'N/A'}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Response Headers</h3>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {webhookLog.responseHeaders && webhookLog.responseHeaders.map((header, index) => (
                    <div key={index} className="flex items-start py-1 border-b last:border-0">
                      <div className="font-medium min-w-32">{header.key}:</div>
                      <div className="text-muted-foreground truncate">{header.value}</div>
                    </div>
                  ))}
                  {(!webhookLog.responseHeaders || webhookLog.responseHeaders.length === 0) && (
                    <div className="text-muted-foreground">No response headers</div>
                  )}
                </div>
              </div>

              {webhookLog.responseBody && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Response Body</h3>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                      {formatJSON(webhookLog.responseBody)}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(webhookLog.responseBody)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WebhookDetailView;

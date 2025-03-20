
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WebhookTestPanelProps {
  webhook: Webhook;
}

export const WebhookTestPanel: React.FC<WebhookTestPanelProps> = ({ webhook }) => {
  const { 
    isTestMode, 
    setIsTestMode, 
    sendTestRequest, 
    testResponse, 
    clearTestResponse,
    isTestLoading
  } = useWebhookContext();

  const handleTestMode = (enabled: boolean) => {
    setIsTestMode(enabled);
    if (!enabled) {
      clearTestResponse();
    }
  };

  const handleExecuteTest = async () => {
    // Validate webhook data before testing
    if (!webhook.url) {
      alert('Webhook URL is required before testing');
      return;
    }
    
    await sendTestRequest(webhook);
  };

  // Format the response body for better display
  const formatResponseBody = (body?: string) => {
    if (!body) return 'No response body';
    
    try {
      // Try to parse as JSON and prettify
      const parsed = JSON.parse(body);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If not valid JSON, return as is
      return body;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="test-mode"
            checked={isTestMode}
            onCheckedChange={handleTestMode}
          />
          <Label htmlFor="test-mode" className="font-medium">Test Mode</Label>
          <span className="text-xs text-muted-foreground">
            (Execute without recording to logs)
          </span>
        </div>

        {isTestMode && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExecuteTest}
            disabled={isTestLoading}
          >
            {isTestLoading ? 'Sending...' : 'Send Test Request'}
          </Button>
        )}
      </div>

      {isTestMode && isTestLoading && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 animate-spin" />
                <span>Waiting for response...</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {isTestMode && testResponse && !isTestLoading && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Test Results</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearTestResponse}
              >
                Clear
              </Button>
            </div>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Request completed in {testResponse.duration}ms</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {testResponse.responseStatus >= 200 && testResponse.responseStatus < 300 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResponse.responseStatus === 0 ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <h3 className="font-medium">
                    Status: {testResponse.responseStatus === 0 ? 'Error' : testResponse.responseStatus}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Headers</h4>
                    <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-32">
                      {JSON.stringify(testResponse.responseHeaders, null, 2) || 'No headers'}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Response Body</h4>
                    <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-64">
                      {formatResponseBody(testResponse.responseBody)}
                    </pre>
                  </div>

                  {testResponse.error && (
                    <div>
                      <h4 className="text-sm font-medium text-destructive">Error</h4>
                      <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded-md mt-1 overflow-auto max-h-32">
                        {testResponse.error}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

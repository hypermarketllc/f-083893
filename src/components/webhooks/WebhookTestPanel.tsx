
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface WebhookTestPanelProps {
  webhook: Webhook;
}

export const WebhookTestPanel: React.FC<WebhookTestPanelProps> = ({ webhook }) => {
  const { 
    isTestMode, 
    setIsTestMode, 
    executeWebhook, 
    testResponse, 
    clearTestResponse 
  } = useWebhookContext();

  const handleTestMode = (enabled: boolean) => {
    setIsTestMode(enabled);
    if (!enabled) {
      clearTestResponse();
    }
  };

  const handleExecuteTest = async () => {
    await executeWebhook(webhook, true);
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
          >
            Send Test Request
          </Button>
        )}
      </div>

      {isTestMode && testResponse && (
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
                  {testResponse.status >= 200 && testResponse.status < 300 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResponse.status === 0 ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <h3 className="font-medium">
                    Status: {testResponse.status === 0 ? 'Error' : testResponse.status}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Headers</h4>
                    <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-32">
                      {JSON.stringify(testResponse.headers, null, 2) || 'No headers'}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Response Body</h4>
                    <pre className="text-xs bg-muted p-2 rounded-md mt-1 overflow-auto max-h-64">
                      {testResponse.body || 'No response body'}
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

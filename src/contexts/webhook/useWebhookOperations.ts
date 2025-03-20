
import { useState } from 'react';
import { Webhook, WebhookLogEntry, WebhookTestResponse } from '@/types/webhook';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useWebhookOperations = (
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  webhookLogs: WebhookLogEntry[],
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>,
  selectedWebhook: Webhook | null,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setTestResponse: React.Dispatch<React.SetStateAction<WebhookLogEntry | null>>,
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Execute a webhook and return the result
  const executeWebhook = async (webhook: Webhook, isTest: boolean = false): Promise<WebhookTestResponse | null> => {
    setIsTestLoading(true);
    
    try {
      // Clear any previous test response if this is a test run
      if (isTest) {
        setTestResponse(null);
      }
      
      // Validate webhook data
      if (!webhook.url) {
        toast.error('Webhook URL is required');
        setIsTestLoading(false);
        return null;
      }
      
      const startTime = Date.now();
      
      // Prepare request URL with params
      let url = webhook.url;
      if (webhook.urlParams && webhook.urlParams.length > 0) {
        const enabledParams = webhook.urlParams.filter(param => param.enabled);
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
      
      // Prepare headers
      let headers: Record<string, string> = {};
      if (webhook.headers && webhook.headers.length > 0) {
        webhook.headers
          .filter(header => header.enabled)
          .forEach(header => {
            headers[header.key] = header.value;
          });
      }
      
      // Prepare body based on content type
      let body: string | undefined;
      let contentTypeHeader = '';
      
      if (webhook.method !== 'GET' && webhook.body) {
        body = webhook.body.content;
        
        if (webhook.body.contentType === 'json') {
          contentTypeHeader = 'application/json';
        } else if (webhook.body.contentType === 'form') {
          contentTypeHeader = 'application/x-www-form-urlencoded';
        } else {
          contentTypeHeader = 'text/plain';
        }
        
        if (contentTypeHeader && !headers['Content-Type']) {
          headers['Content-Type'] = contentTypeHeader;
        }
      }
      
      // In a real implementation, we would call the Supabase function here
      // For this demo, we'll simulate a response after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random success/failure
      const success = Math.random() > 0.2; // 80% success rate
      const statusCode = success ? 200 : (Math.random() > 0.5 ? 400 : 500);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Create simulated response
      const responseBody = success
        ? JSON.stringify({ success: true, message: "Operation completed successfully", data: { id: Math.floor(Math.random() * 1000) } }, null, 2)
        : JSON.stringify({ 
            success: false, 
            error: statusCode === 400 ? "Bad Request" : "Internal Server Error",
            message: statusCode === 400 
              ? "The request was invalid" 
              : "An error occurred while processing the request"
          }, null, 2);
      
      const responseHeaders = {
        'Content-Type': 'application/json',
        'X-Request-ID': `req-${Date.now()}`,
        'Date': new Date().toISOString()
      };
      
      // Create log entry
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: url,
        requestMethod: webhook.method,
        requestHeaders: headers,
        requestBody: body,
        responseStatus: statusCode,
        responseHeaders: responseHeaders,
        responseBody: responseBody,
        duration,
        success: success,
        error: !success ? (statusCode === 400 ? "Bad Request" : "Internal Server Error") : undefined
      };
      
      // For test mode, update the test response
      if (isTest) {
        setTestResponse(logEntry);
      } else {
        // For normal execution, add to logs and update webhook status
        setWebhookLogs(prev => [logEntry, ...prev]);
        
        // Update webhook's last execution status
        setWebhooks(prev => 
          prev.map(w => 
            w.id === webhook.id 
              ? { 
                  ...w, 
                  lastExecutedAt: new Date().toISOString(), 
                  lastExecutionStatus: success ? 'success' : 'error' 
                } 
              : w
          )
        );
        
        // Update selected webhook if it's the one being executed
        if (selectedWebhook && selectedWebhook.id === webhook.id) {
          setSelectedWebhook({
            ...selectedWebhook,
            lastExecutedAt: new Date().toISOString(),
            lastExecutionStatus: success ? 'success' : 'error'
          });
        }
        
        if (success) {
          toast.success(`Webhook executed: ${statusCode} OK`);
        } else {
          toast.error(`Webhook execution failed: ${statusCode} ${logEntry.error}`);
        }
      }
      
      setIsTestLoading(false);
      return {
        status: statusCode,
        headers: responseHeaders,
        body: responseBody,
        duration,
        error: !success ? (statusCode === 400 ? "Bad Request" : "Internal Server Error") : undefined
      };
    } catch (error) {
      console.error('Failed to execute webhook:', error);
      
      // Create error log entry
      const errorLogEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: webhook.url,
        requestMethod: webhook.method,
        requestHeaders: {},
        responseStatus: 0,
        responseHeaders: {},
        duration: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
      
      // For test mode, update the test response
      if (isTest) {
        setTestResponse(errorLogEntry);
      } else {
        // For normal execution, add to logs and update webhook status
        setWebhookLogs(prev => [errorLogEntry, ...prev]);
        
        // Update webhook's last execution status
        setWebhooks(prev => 
          prev.map(w => 
            w.id === webhook.id 
              ? { 
                  ...w, 
                  lastExecutedAt: new Date().toISOString(), 
                  lastExecutionStatus: 'error' 
                } 
              : w
          )
        );
        
        // Update selected webhook if it's the one being executed
        if (selectedWebhook && selectedWebhook.id === webhook.id) {
          setSelectedWebhook({
            ...selectedWebhook,
            lastExecutedAt: new Date().toISOString(),
            lastExecutionStatus: 'error'
          });
        }
        
        toast.error(`Failed to execute webhook: ${error instanceof Error ? error.message : 'Network error'}`);
      }
      
      setIsTestLoading(false);
      return {
        status: 0,
        headers: {},
        body: JSON.stringify({ 
          success: false, 
          error: 'Network Error',
          message: 'Failed to connect to the server'
        }, null, 2),
        duration: 0,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };
  
  const clearTestResponse = () => {
    setTestResponse(null);
  };
  
  const sendTestRequest = (webhook: Webhook) => {
    return executeWebhook(webhook, true);
  };
  
  return { executeWebhook, clearTestResponse, sendTestRequest };
};

export const ensureLogEntryFields = (logEntry: WebhookLogEntry): WebhookLogEntry => {
  return {
    ...logEntry,
    // Add any missing fields with defaults
    requestTime: logEntry.requestTime || logEntry.timestamp,
    responseTime: logEntry.responseTime || null,
    method: logEntry.requestMethod,
    url: logEntry.requestUrl,
    body: logEntry.requestBody
  };
};

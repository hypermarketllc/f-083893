
import { useState } from 'react';
import { Webhook, WebhookLogEntry } from '@/types/webhook';
import { toast } from 'sonner';

export function useExecuteWebhook(
  webhookLogs: WebhookLogEntry[],
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>,
  setTestResponse: React.Dispatch<React.SetStateAction<any>>,
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Execute a webhook and return the result
  const executeWebhook = async (webhook: Webhook, isTest: boolean = false) => {
    setIsTestLoading(true);
    
    try {
      // In a real implementation, this would make an actual HTTP request
      // For this demo, we'll simulate a response
      const startTime = Date.now();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate a random response
      const success = Math.random() > 0.2; // 80% success rate
      const statusCode = success ? 200 : (Math.random() > 0.5 ? 400 : 500);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Prepare the URL with any parameters
      let fullUrl = webhook.url;
      if (webhook.urlParams && webhook.urlParams.length > 0) {
        const queryParams = webhook.urlParams
          .filter(param => param.enabled)
          .reduce((acc, param, index) => {
            return `${acc}${index === 0 ? '?' : '&'}${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`;
          }, '');
        fullUrl += queryParams;
      }
      
      // Create a simulated response
      const responseBody = success
        ? JSON.stringify({ success: true, message: "Operation completed successfully" }, null, 2)
        : JSON.stringify({ 
            success: false, 
            error: statusCode === 400 ? "Bad Request" : "Internal Server Error",
            message: statusCode === 400 
              ? "The request was invalid" 
              : "An error occurred while processing the request"
          }, null, 2);
      
      const response = {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': `req-${Date.now()}`
        },
        body: responseBody,
        duration
      };
      
      // If this is a test, only update the test response state
      if (isTest) {
        setTestResponse(response);
        setIsTestLoading(false);
        return response;
      } else {
        // If this is a real execution, add to logs
        const log: WebhookLogEntry = {
          id: `log-${Date.now()}`,
          webhookId: webhook.id,
          webhookName: webhook.name,
          timestamp: new Date().toISOString(),
          requestUrl: fullUrl,
          requestMethod: webhook.method,
          requestHeaders: webhook.headers.reduce((acc, header) => {
            if (header.enabled) {
              acc[header.key] = header.value;
            }
            return acc;
          }, {} as Record<string, string>),
          requestBody: webhook.body?.content,
          responseStatus: statusCode,
          responseHeaders: response.headers,
          responseBody: responseBody,
          duration,
          success,
          error: !success 
            ? statusCode === 400 
              ? "Bad Request: The request was invalid" 
              : "Server Error: An error occurred while processing the request"
            : undefined,
          requestTime: new Date().toISOString(),
          responseTime: new Date(Date.now() + duration).toISOString(),
          body: responseBody // Adding this for compatibility
        };
        
        // Add to logs
        setWebhookLogs(prev => [log, ...prev]);
        
        // Show a toast
        if (success) {
          toast.success('Webhook executed successfully');
        } else {
          toast.error(`Webhook execution failed: ${statusCode} ${log.error}`);
        }
        
        setIsTestLoading(false);
        return response;
      }
    } catch (error) {
      console.error('Failed to execute webhook:', error);
      
      // Create an error response
      const errorResponse = {
        status: 0,
        headers: {},
        body: JSON.stringify({ 
          success: false, 
          error: 'Network Error',
          message: 'Failed to connect to the server'
        }, null, 2),
        duration: 0
      };
      
      if (isTest) {
        setTestResponse(errorResponse);
      } else {
        toast.error('Failed to execute webhook: Network Error');
      }
      
      setIsTestLoading(false);
      return errorResponse;
    }
  };
  
  const clearTestResponse = () => {
    setTestResponse(null);
  };
  
  const sendTestRequest = (webhook: Webhook) => {
    return executeWebhook(webhook, true);
  };
  
  return { executeWebhook, clearTestResponse, sendTestRequest };
}

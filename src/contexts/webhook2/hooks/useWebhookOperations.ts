
import { useState } from 'react';
import { Webhook, WebhookLogEntry, WebhookTestResponse } from '@/types/webhook2';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { UseWebhookOperationsParams } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookOperations = ({
  webhooks,
  setWebhooks,
  webhookLogs,
  setWebhookLogs,
  selectedWebhook,
  setSelectedWebhook,
  setTestResponse,
  setIsTestLoading
}: UseWebhookOperationsParams) => {

  const clearTestResponse = () => {
    setTestResponse(null);
  };
  
  // Execute a webhook and return the result
  const executeWebhook = async (webhook: Webhook): Promise<WebhookLogEntry | null> => {
    setIsTestLoading(true);
    
    try {
      // Clear any previous test response if this is a test run
      
      // Validate webhook data
      if (!webhook.url) {
        toast.error('Webhook URL is required');
        setIsTestLoading(false);
        return null;
      }
      
      const startTime = Date.now();
      
      // Prepare request URL with params
      let url = webhook.url;
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
      
      // In a real implementation, we would call the API here
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
      
      try {
        // Save log to Supabase
        const { error: logError } = await supabase
          .from('webhook_logs')
          .insert({
            webhook_id: webhook.id,
            timestamp: new Date().toISOString(),
            request_url: url,
            request_method: webhook.method,
            request_headers: headers,
            request_body: body,
            response_status: statusCode,
            response_headers: responseHeaders,
            response_body: responseBody,
            duration,
            success: success,
            error: !success ? (statusCode === 400 ? "Bad Request" : "Internal Server Error") : null
          });
        
        if (logError) {
          console.error('Error saving webhook log:', logError);
        }
        
        // Update webhook's last execution status in Supabase
        const { error: webhookError } = await supabase
          .from('webhooks')
          .update({
            last_executed_at: new Date().toISOString(),
            last_execution_status: success ? 'success' : 'error'
          })
          .eq('id', webhook.id);
        
        if (webhookError) {
          console.error('Error updating webhook status:', webhookError);
        }
      } catch (error) {
        console.error('Error recording webhook execution:', error);
      }
      
      // Add to UI logs and update webhook status
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
      
      setIsTestLoading(false);
      return logEntry;
      
    } catch (error) {
      console.error('Failed to execute webhook:', error);
      setIsTestLoading(false);
      return null;
    }
  };
  
  const sendTestRequest = async (webhook: Webhook): Promise<WebhookTestResponse | null> => {
    setIsTestLoading(true);
    setTestResponse(null);
    
    try {
      // Validate webhook data
      if (!webhook.url) {
        toast.error('Webhook URL is required');
        setIsTestLoading(false);
        return null;
      }
      
      const startTime = Date.now();
      
      // Prepare request URL with params
      let url = webhook.url;
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
      
      // In a real implementation, we would call the API here
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

      // Create log entry for test response UI
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
      
      // Set the test response for UI display
      setTestResponse(logEntry);
      
      // Create WebhookTestResponse 
      const testResponse: WebhookTestResponse = {
        status: statusCode,
        headers: responseHeaders,
        body: responseBody,
        duration,
        error: !success ? (statusCode === 400 ? "Bad Request" : "Internal Server Error") : undefined,
        success: success,
        responseStatus: statusCode,
        responseBody: responseBody,
        responseHeaders: responseHeaders,
        webhookId: webhook.id,
        webhookName: webhook.name
      };
      
      setIsTestLoading(false);
      return testResponse;
      
    } catch (error) {
      console.error('Failed to test webhook:', error);
      
      // Create an error response
      const errorResponse: WebhookTestResponse = {
        status: 0,
        headers: {},
        body: JSON.stringify({ 
          success: false, 
          error: 'Network Error',
          message: 'Failed to connect to the server'
        }, null, 2),
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
      
      // Create a log entry for the error
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
        responseBody: errorResponse.body,
        duration: 0,
        success: false,
        error: errorResponse.error
      };
      
      setTestResponse(errorLogEntry);
      setIsTestLoading(false);
      return errorResponse;
    }
  };
  
  return { executeWebhook, clearTestResponse, sendTestRequest };
};

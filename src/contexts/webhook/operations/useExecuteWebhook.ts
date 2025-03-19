
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Webhook, WebhookLogEntry } from '@/types/webhook';
import { parseBodyContent } from '../webhookUtils';

export const useExecuteWebhook = (
  webhookLogs: WebhookLogEntry[],
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>,
  setTestResponse: React.Dispatch<React.SetStateAction<any>>,
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Execute webhook - sending actual HTTP requests
  const executeWebhook = async (webhook: Webhook, isTest: boolean = false) => {
    setIsTestLoading(true);
    if (isTest) {
      setTestResponse(null);
    }
    
    const startTime = Date.now();
    
    try {
      // Build URL with params
      let requestUrl = webhook.url;
      if (webhook.urlParams && webhook.urlParams.length > 0) {
        const enabledParams = webhook.urlParams.filter(p => p.enabled);
        if (enabledParams.length > 0) {
          const queryString = enabledParams
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
            .join('&');
          requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
        }
      }
      
      // Build headers
      const headers: Record<string, string> = {};
      if (webhook.headers && webhook.headers.length > 0) {
        webhook.headers.filter(h => h.enabled).forEach(h => {
          headers[h.key] = h.value;
        });
      }
      
      // Parse body content
      const bodyContent = parseBodyContent(webhook.body);
      
      // Log request details for debugging
      console.log(`Sending ${webhook.method} request to ${requestUrl}`);
      console.log('Headers:', headers);
      console.log('Body:', bodyContent);
      
      // Configure request options
      const requestOptions: RequestInit = {
        method: webhook.method,
        headers,
        mode: 'cors',
        cache: 'no-cache',
      };
      
      // Add body for non-GET requests
      if (webhook.method !== 'GET' && bodyContent) {
        if (webhook.body?.contentType === 'json') {
          requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': 'application/json'
          };
          requestOptions.body = JSON.stringify(bodyContent);
        } else if (webhook.body?.contentType === 'form') {
          requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': 'application/x-www-form-urlencoded'
          };
          requestOptions.body = webhook.body.content;
        } else {
          requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': 'text/plain'
          };
          requestOptions.body = webhook.body?.content;
        }
      }
      
      // Send the actual request
      const response = await fetch(requestUrl, requestOptions);
      
      // Get response data
      const responseData = await response.text();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // Create response object
      const responseObject = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseData,
        duration
      };
      
      // Create log entry
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: requestUrl,
        requestMethod: webhook.method,
        requestHeaders: headers,
        requestBody: bodyContent ? JSON.stringify(bodyContent) : undefined,
        responseStatus: response.status,
        responseHeaders: responseHeaders,
        responseBody: responseData,
        duration,
        success: response.ok
      };
      
      // Only add to logs if it's not a test or if we want to log tests
      if (!isTest) {
        setWebhookLogs(prevLogs => [logEntry, ...prevLogs]);
      }
      
      // Set response for display if it's a test
      if (isTest) {
        setTestResponse(responseObject);
      }
      
      setIsTestLoading(false);
      if (isTest) {
        toast.success('Test request sent successfully');
      }
      
    } catch (error) {
      console.error('Error sending webhook:', error);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Create error log
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: webhook.url,
        requestMethod: webhook.method,
        requestHeaders: {},
        responseStatus: 0,
        responseHeaders: {},
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Only add to logs if it's not a test or if we want to log tests
      if (!isTest) {
        setWebhookLogs(prevLogs => [logEntry, ...prevLogs]);
      }
      
      if (isTest) {
        setTestResponse({
          status: 0,
          statusText: 'Error',
          headers: {},
          body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
          duration
        });
      }
      
      setIsTestLoading(false);
      if (isTest) {
        toast.error('Error sending test request');
      }
    }
  };

  // Send test webhook request
  const sendTestRequest = async (webhook: Webhook) => {
    await executeWebhook(webhook, true);
  };

  // Clear test response
  const clearTestResponse = () => {
    setTestResponse(null);
  };

  return {
    executeWebhook,
    clearTestResponse,
    sendTestRequest
  };
};


import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Webhook, WebhookLogEntry, IncomingWebhook } from '@/types/webhook';
import { parseBodyContent } from './webhookUtils';

export function useWebhookOperations(
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  webhookLogs: WebhookLogEntry[],
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>,
  selectedWebhook: Webhook | null,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setTestResponse: React.Dispatch<React.SetStateAction<any>>,
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Create a new webhook
  const createWebhook = (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWebhook: Webhook = {
      ...webhook,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setWebhooks(prevWebhooks => [...prevWebhooks, newWebhook]);
    setIsWebhookModalOpen(false);
    toast.success('Webhook created successfully');
  };

  // Update an existing webhook
  const updateWebhook = (webhook: Webhook) => {
    setWebhooks(prevWebhooks => 
      prevWebhooks.map(w => 
        w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
      )
    );
    
    // Also update selectedWebhook if it's the one being edited
    if (selectedWebhook?.id === webhook.id) {
      setSelectedWebhook({ ...webhook, updatedAt: new Date().toISOString() });
    }
    
    setIsWebhookModalOpen(false);
    setEditingWebhook(null);
    toast.success('Webhook updated successfully');
  };

  // Handle edit webhook (open modal with webhook data)
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  // Delete a webhook
  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prevWebhooks => prevWebhooks.filter(w => w.id !== id));
    if (selectedWebhook?.id === id) {
      setSelectedWebhook(null);
    }
    toast.success('Webhook deleted successfully');
  };

  // Clear test response
  const clearTestResponse = () => {
    setTestResponse(null);
  };

  // Execute webhook - now sending actual HTTP requests
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

  return {
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    clearTestResponse,
    sendTestRequest
  };
}

export function useIncomingWebhookOperations(
  incomingWebhooks: IncomingWebhook[],
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>,
  selectedIncomingWebhook: IncomingWebhook | null,
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>,
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>
) {
  // Create a new incoming webhook
  const createIncomingWebhook = (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWebhook: IncomingWebhook = {
      ...webhook,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setIncomingWebhooks([...incomingWebhooks, newWebhook]);
    setIsIncomingWebhookModalOpen(false);
    toast.success('Incoming webhook created successfully');
  };

  // Update an existing incoming webhook
  const updateIncomingWebhook = (webhook: IncomingWebhook) => {
    setIncomingWebhooks(incomingWebhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    ));
    setIsIncomingWebhookModalOpen(false);
    setEditingIncomingWebhook(null);
    toast.success('Incoming webhook updated successfully');
  };

  // Handle edit incoming webhook (open modal with webhook data)
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  // Delete an incoming webhook
  const handleDeleteIncomingWebhook = (id: string) => {
    setIncomingWebhooks(incomingWebhooks.filter(w => w.id !== id));
    if (selectedIncomingWebhook?.id === id) {
      setSelectedIncomingWebhook(null);
    }
    toast.success('Incoming webhook deleted successfully');
  };

  return {
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook
  };
}

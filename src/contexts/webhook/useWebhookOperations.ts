import { useState } from 'react';
import { Webhook, WebhookLogEntry, IncomingWebhook } from '@/types/webhook';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ensureLogEntryFields } from './webhookUtils';

export const useWebhookOperations = (
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
) => {
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setSelectedWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks((prevWebhooks) => prevWebhooks.filter((webhook) => webhook.id !== webhookId));
    setWebhookLogs((prevLogs) => prevLogs.filter((log) => log.webhookId !== webhookId));
    setSelectedWebhook(null);
    toast.success('Webhook deleted');
  };

  const createWebhook = (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWebhook: Webhook = {
      id: `webhook-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastExecutedAt: null,
      lastExecutionStatus: null,
      ...webhookData
    };

    setWebhooks((prevWebhooks) => [newWebhook, ...prevWebhooks]);
    setSelectedWebhook(newWebhook);
    toast.success(`Webhook "${newWebhook.name}" created`);
  };

  const updateWebhook = (updatedWebhook: Webhook) => {
    if (!selectedWebhook) {
      console.warn('No webhook selected to update.');
      return;
    }

    // Update the webhook
    setWebhooks((prevWebhooks) =>
      prevWebhooks.map((webhook) =>
        webhook.id === updatedWebhook.id
          ? {
              ...updatedWebhook,
              updatedAt: new Date().toISOString(),
              lastExecutedAt: updatedWebhook.lastExecutedAt,
              lastExecutionStatus: updatedWebhook.lastExecutionStatus as 'success' | 'error' | null
            }
          : webhook
      )
    );

    // If this is the selected webhook, update it
    if (selectedWebhook && selectedWebhook.id === updatedWebhook.id) {
      setSelectedWebhook({
        ...updatedWebhook,
        updatedAt: new Date().toISOString(),
        lastExecutedAt: updatedWebhook.lastExecutedAt,
        lastExecutionStatus: updatedWebhook.lastExecutionStatus as 'success' | 'error' | null
      });
    }

    toast.success(`Webhook "${updatedWebhook.name}" updated`);
  };

  const handleExecuteWebhook = async (webhook: Webhook) => {
    // Create a pending log entry
    const timestamp = new Date().toISOString();
    const newLogEntry: WebhookLogEntry = {
      id: `log-${uuidv4()}`,
      webhookId: webhook.id,
      webhookName: webhook.name,
      timestamp: timestamp,
      requestUrl: webhook.url,
      requestMethod: webhook.method,
      requestHeaders: webhook.headers.reduce((acc, header) => {
        if (header.enabled) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>),
      requestTime: timestamp,
      responseTime: null,
      responseStatus: 0,
      responseHeaders: {},
      duration: 0,
      success: false,
      method: webhook.method,
      url: webhook.url,
      requestBody: webhook.body?.content || '{}'
    };

    // Add the log entry to the list
    setWebhookLogs((prevLogs) => [ensureLogEntryFields(newLogEntry), ...prevLogs]);

    try {
      // Simulate API call
      const startTime = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Randomly succeed or fail
      const success = Math.random() > 0.3;
      const responseTime = new Date().toISOString();
      const duration = Date.now() - startTime;
      
      if (!success) {
        throw new Error('Request failed with status: 500');
      }
      
      // Update the log entry with success response
      const updatedLogEntry: WebhookLogEntry = {
        ...newLogEntry,
        responseTime: responseTime,
        responseStatus: 200,
        responseHeaders: {
          'Content-Type': 'application/json',
          'Server': 'nginx/1.18.0',
          'Date': new Date().toISOString()
        },
        responseBody: JSON.stringify({ 
          success: true, 
          message: 'Webhook executed successfully',
          data: { id: Math.floor(Math.random() * 1000) }
        }),
        duration: duration,
        success: true,
        body: JSON.stringify({ 
          success: true, 
          message: 'Webhook executed successfully',
          data: { id: Math.floor(Math.random() * 1000) }
        })
      };
      
      // Update the log entries
      setWebhookLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === newLogEntry.id ? ensureLogEntryFields(updatedLogEntry) : log
        )
      );
      
      // Update the webhook's last executed status
      setWebhooks((prevWebhooks) =>
        prevWebhooks.map((w) =>
          w.id === webhook.id
            ? {
                ...w,
                lastExecutedAt: timestamp,
                lastExecutionStatus: 'success' as const
              }
            : w
        )
      );
      
      // Update selected webhook if needed
      if (selectedWebhook && selectedWebhook.id === webhook.id) {
        setSelectedWebhook({
          ...selectedWebhook,
          lastExecutedAt: timestamp,
          lastExecutionStatus: 'success' as const
        });
      }
      
      // Return the response for the test panel
      return updatedLogEntry;
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const responseTime = new Date().toISOString();
      const duration = Date.now() - new Date(timestamp).getTime();
      
      // Update the log entry with error details
      const updatedLogEntry: WebhookLogEntry = {
        ...newLogEntry,
        responseTime: responseTime,
        responseStatus: 500,
        responseHeaders: {
          'Content-Type': 'application/json',
          'Server': 'nginx/1.18.0',
          'Date': new Date().toISOString()
        },
        responseBody: JSON.stringify({ 
          success: false, 
          error: errorMessage
        }),
        duration: duration,
        success: false,
        error: errorMessage,
        body: JSON.stringify({ 
          success: false, 
          error: errorMessage
        })
      };
      
      // Update the log entries
      setWebhookLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === newLogEntry.id ? ensureLogEntryFields(updatedLogEntry) : log
        )
      );
      
      // Update the webhook's last executed status
      setWebhooks((prevWebhooks) =>
        prevWebhooks.map((w) =>
          w.id === webhook.id
            ? {
                ...w,
                lastExecutedAt: timestamp,
                lastExecutionStatus: 'error' as const
              }
            : w
        )
      );
      
      // Update selected webhook if needed
      if (selectedWebhook && selectedWebhook.id === webhook.id) {
        setSelectedWebhook({
          ...selectedWebhook,
          lastExecutedAt: timestamp,
          lastExecutionStatus: 'error' as const
        });
      }
      
      // Return the error response for the test panel
      return updatedLogEntry;
    }
  };

  return {
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    handleExecuteWebhook,
  };
};

export const useIncomingWebhookOperations = (
  incomingWebhooks: IncomingWebhook[],
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>,
  selectedIncomingWebhook: IncomingWebhook | null,
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>,
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>
) => {
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setSelectedIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  const handleDeleteIncomingWebhook = (webhookId: string) => {
    setIncomingWebhooks((prevWebhooks) => prevWebhooks.filter((webhook) => webhook.id !== webhookId));
    setSelectedIncomingWebhook(null);
    toast.success('Incoming Webhook deleted');
  };

  const createIncomingWebhook = (webhookData: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWebhook: IncomingWebhook = {
      id: `incoming-webhook-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastCalledAt: null,
      ...webhookData
    };

    setIncomingWebhooks((prevWebhooks) => [newWebhook, ...prevWebhooks]);
    setSelectedIncomingWebhook(newWebhook);
    toast.success(`Incoming Webhook "${newWebhook.name}" created`);
  };

  const updateIncomingWebhook = (updatedWebhook: IncomingWebhook) => {
    setIncomingWebhooks((prevWebhooks) =>
      prevWebhooks.map((webhook) =>
        webhook.id === updatedWebhook.id
          ? { ...updatedWebhook, updatedAt: new Date().toISOString() }
          : webhook
      )
    );

    if (selectedIncomingWebhook && selectedIncomingWebhook.id === updatedWebhook.id) {
      setSelectedIncomingWebhook({ ...updatedWebhook, updatedAt: new Date().toISOString() });
    }

    toast.success(`Incoming Webhook "${updatedWebhook.name}" updated`);
  };

  return {
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook,
  };
};

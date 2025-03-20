
import { useState } from 'react';
import { Webhook, WebhookLogEntry, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for Webhook operations
 */
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
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Create a new webhook
   */
  const createWebhook = (webhookData: Partial<Webhook>) => {
    try {
      setIsCreating(true);

      // Input validation
      if (!webhookData.name) {
        toast.error('Webhook name is required');
        setIsCreating(false);
        return null;
      }

      if (!webhookData.url) {
        toast.error('Webhook URL is required');
        setIsCreating(false);
        return null;
      }

      // Create a new webhook with a unique ID
      const webhook: Webhook = {
        id: uuidv4(),
        name: webhookData.name || 'New Webhook',
        description: webhookData.description || '',
        url: webhookData.url || '',
        method: webhookData.method || 'GET',
        headers: webhookData.headers || [],
        urlParams: webhookData.urlParams || [],
        body: webhookData.body,
        schedule: webhookData.schedule,
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastExecutedAt: null,
        lastExecutionStatus: null
      };

      // Add the webhook to the list
      setWebhooks(prevWebhooks => [...prevWebhooks, webhook]);

      // Select the newly created webhook
      setSelectedWebhook(webhook);

      // Close the modal
      setIsWebhookModalOpen(false);

      // Show a success toast
      toast.success('Webhook created successfully');

      setIsCreating(false);
      return webhook;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error(`Failed to create webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCreating(false);
      return null;
    }
  };

  /**
   * Update an existing webhook
   */
  const updateWebhook = (updatedWebhook: Webhook) => {
    try {
      console.log('Updating webhook:', updatedWebhook);
      
      // Input validation
      if (!updatedWebhook.name) {
        toast.error('Webhook name is required');
        return null;
      }

      if (!updatedWebhook.url) {
        toast.error('Webhook URL is required');
        return null;
      }
      
      // Update the updatedAt timestamp
      const webhook = {
        ...updatedWebhook,
        updatedAt: new Date().toISOString()
      };
      
      // Update the webhooks list
      setWebhooks(prevWebhooks => 
        prevWebhooks.map(w => 
          w.id === webhook.id ? webhook : w
        )
      );
      
      // Update the selected webhook if it's the one being edited
      setSelectedWebhook(prevSelected => 
        prevSelected?.id === webhook.id ? webhook : prevSelected
      );
      
      // Close the modal
      setIsWebhookModalOpen(false);
      
      // Reset the editing webhook
      setEditingWebhook(null);
      
      // Show a success toast
      toast.success('Webhook updated successfully');
      
      return webhook;
    } catch (error) {
      console.error('Failed to update webhook:', error);
      toast.error(`Failed to update webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  /**
   * Set a webhook for editing
   */
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  /**
   * Delete a webhook
   */
  const handleDeleteWebhook = (webhookId: string) => {
    try {
      // Update the webhooks list by filtering out the one to delete
      setWebhooks(prevWebhooks => 
        prevWebhooks.filter(w => w.id !== webhookId)
      );
      
      // Reset the selected webhook if it's the one being deleted
      setSelectedWebhook(prevSelected => 
        prevSelected?.id === webhookId ? null : prevSelected
      );
      
      // Show a success toast
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error(`Failed to delete webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Execute a webhook and create a log entry
   */
  const executeWebhook = async (webhook: Webhook) => {
    try {
      setIsTestLoading(true);
      console.log('Executing webhook:', webhook);

      // Create a log entry
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        method: webhook.method,
        url: webhook.url,
        requestTime: new Date().toISOString(),
        responseTime: null,
        duration: 0,
        responseStatus: null,
        responseBody: null,
        error: null,
        success: false
      };

      // Set a delay to simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the log entry with a successful response
      logEntry.responseTime = new Date().toISOString();
      logEntry.duration = 1500;
      logEntry.responseStatus = 200;
      logEntry.responseBody = JSON.stringify({ message: 'Success', data: { id: uuidv4() } }, null, 2);
      logEntry.success = true;

      // Add the log entry to the list
      setWebhookLogs(prevLogs => [logEntry, ...prevLogs]);

      // Update the webhook's last execution info
      const updatedWebhook = {
        ...webhook,
        lastExecutedAt: logEntry.requestTime,
        lastExecutionStatus: 'success'
      };

      // Update the webhooks list
      setWebhooks(prevWebhooks => 
        prevWebhooks.map(w => 
          w.id === webhook.id ? updatedWebhook : w
        )
      );

      // Update the selected webhook
      setSelectedWebhook(updatedWebhook);

      // Show a success toast
      toast.success('Webhook executed successfully');

      setIsTestLoading(false);
      return logEntry;
    } catch (error) {
      console.error('Failed to execute webhook:', error);

      // Create a log entry with the error
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        method: webhook.method,
        url: webhook.url,
        requestTime: new Date().toISOString(),
        responseTime: new Date().toISOString(),
        duration: 0,
        responseStatus: 500,
        responseBody: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };

      // Add the log entry to the list
      setWebhookLogs(prevLogs => [logEntry, ...prevLogs]);

      // Update the webhook's last execution info
      const updatedWebhook = {
        ...webhook,
        lastExecutedAt: logEntry.requestTime,
        lastExecutionStatus: 'error'
      };

      // Update the webhooks list
      setWebhooks(prevWebhooks => 
        prevWebhooks.map(w => 
          w.id === webhook.id ? updatedWebhook : w
        )
      );

      // Update the selected webhook
      setSelectedWebhook(updatedWebhook);

      // Show an error toast
      toast.error(`Failed to execute webhook: ${logEntry.error}`);

      setIsTestLoading(false);
      return logEntry;
    }
  };

  /**
   * Send a test request to a webhook
   */
  const sendTestRequest = async (webhook: Webhook, testPayload?: string) => {
    try {
      setIsTestLoading(true);
      console.log('Sending test request:', webhook, testPayload);

      // Delay to simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a sample response
      const response = {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'Express'
        },
        body: {
          success: true,
          message: 'Test request received',
          timestamp: new Date().toISOString(),
          data: {
            id: uuidv4(),
            request: {
              method: webhook.method,
              url: webhook.url,
              payload: testPayload
            }
          }
        }
      };

      // Set the test response
      setTestResponse(response);

      // Show a success toast
      toast.success('Test request sent successfully');

      setIsTestLoading(false);
      return response;
    } catch (error) {
      console.error('Failed to send test request:', error);

      // Set an error response
      const errorResponse = {
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Set the test response
      setTestResponse(errorResponse);

      // Show an error toast
      toast.error(`Failed to send test request: ${errorResponse.error}`);

      setIsTestLoading(false);
      return errorResponse;
    }
  };

  /**
   * Clear the test response
   */
  const clearTestResponse = () => {
    setTestResponse(null);
  };

  return {
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    sendTestRequest,
    clearTestResponse,
    isCreating
  };
};

/**
 * Custom hook for Incoming Webhook operations
 */
export const useIncomingWebhookOperations = (
  incomingWebhooks: IncomingWebhook[],
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>,
  selectedIncomingWebhook: IncomingWebhook | null,
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>,
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>
) => {
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Create a new incoming webhook
   */
  const createIncomingWebhook = (webhookData: Partial<IncomingWebhook>) => {
    try {
      setIsCreating(true);

      // Input validation
      if (!webhookData.name) {
        toast.error('Webhook name is required');
        setIsCreating(false);
        return null;
      }

      if (!webhookData.endpointPath) {
        toast.error('Endpoint path is required');
        setIsCreating(false);
        return null;
      }

      // Create a new webhook with a unique ID
      const webhook: IncomingWebhook = {
        id: uuidv4(),
        name: webhookData.name || 'New Incoming Webhook',
        description: webhookData.description || '',
        endpointPath: webhookData.endpointPath || '',
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalledAt: null,
        secretKey: uuidv4()
      };

      // Add the webhook to the list
      setIncomingWebhooks(prevWebhooks => [...prevWebhooks, webhook]);

      // Select the newly created webhook
      setSelectedIncomingWebhook(webhook);

      // Close the modal
      setIsIncomingWebhookModalOpen(false);

      // Show a success toast
      toast.success('Incoming webhook created successfully');

      setIsCreating(false);
      return webhook;
    } catch (error) {
      console.error('Failed to create incoming webhook:', error);
      toast.error(`Failed to create incoming webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCreating(false);
      return null;
    }
  };

  /**
   * Update an existing incoming webhook
   */
  const updateIncomingWebhook = (updatedWebhook: IncomingWebhook) => {
    try {
      console.log('Updating incoming webhook:', updatedWebhook);
      
      // Input validation
      if (!updatedWebhook.name) {
        toast.error('Webhook name is required');
        return null;
      }

      if (!updatedWebhook.endpointPath) {
        toast.error('Endpoint path is required');
        return null;
      }
      
      // Update the updatedAt timestamp
      const webhook = {
        ...updatedWebhook,
        updatedAt: new Date().toISOString()
      };
      
      // Update the webhooks list
      setIncomingWebhooks(prevWebhooks => 
        prevWebhooks.map(w => 
          w.id === webhook.id ? webhook : w
        )
      );
      
      // Update the selected webhook if it's the one being edited
      setSelectedIncomingWebhook(prevSelected => 
        prevSelected?.id === webhook.id ? webhook : prevSelected
      );
      
      // Close the modal
      setIsIncomingWebhookModalOpen(false);
      
      // Reset the editing webhook
      setEditingIncomingWebhook(null);
      
      // Show a success toast
      toast.success('Incoming webhook updated successfully');
      
      return webhook;
    } catch (error) {
      console.error('Failed to update incoming webhook:', error);
      toast.error(`Failed to update incoming webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  /**
   * Set an incoming webhook for editing
   */
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  /**
   * Delete an incoming webhook
   */
  const handleDeleteIncomingWebhook = (webhookId: string) => {
    try {
      // Update the webhooks list by filtering out the one to delete
      setIncomingWebhooks(prevWebhooks => 
        prevWebhooks.filter(w => w.id !== webhookId)
      );
      
      // Reset the selected webhook if it's the one being deleted
      setSelectedIncomingWebhook(prevSelected => 
        prevSelected?.id === webhookId ? null : prevSelected
      );
      
      // Show a success toast
      toast.success('Incoming webhook deleted successfully');
    } catch (error) {
      console.error('Failed to delete incoming webhook:', error);
      toast.error(`Failed to delete incoming webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook,
    isCreating
  };
};

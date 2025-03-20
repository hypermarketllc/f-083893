import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Webhook, WebhookLogEntry, WebhookTag, HttpMethod, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface WebhookContextType {
  // Webhooks
  webhooks: Webhook[];
  webhookLogs: WebhookLogEntry[];
  incomingWebhooks: IncomingWebhook[];
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  isLoading: boolean;
  error: Error | null;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  
  // Modal controls
  isWebhookModalOpen: boolean;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  isIncomingWebhookModalOpen: boolean;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  
  // Test mode
  isTestMode: boolean;
  setIsTestMode: (isTestMode: boolean) => void;
  testResponse: WebhookLogEntry | null;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // CRUD operations
  createWebhook: (webhook: Partial<Webhook>) => Promise<void>;
  updateWebhook: (webhook: Webhook) => Promise<void>;
  deleteWebhook: (id: string) => Promise<void>;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<void>;
  
  createIncomingWebhook: (webhook: Partial<IncomingWebhook>) => Promise<void>;
  updateIncomingWebhook: (webhook: IncomingWebhook) => Promise<void>;
  deleteIncomingWebhook: (id: string) => Promise<void>;
  
  // UI Operations
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (id: string) => void;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (id: string) => void;
  clearTestResponse: () => void;
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const WebhookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>([]);
  const [incomingWebhooks, setIncomingWebhooks] = useState<IncomingWebhook[]>([]);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState<IncomingWebhookLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<WebhookLogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for development
  useEffect(() => {
    // Mock webhooks
    const mockWebhooks: Webhook[] = [
      {
        id: 'webhook-1',
        name: 'GitHub Notification',
        description: 'Send notifications to GitHub when events occur',
        url: 'https://api.github.com/repos/user/repo/dispatches',
        method: 'POST',
        headers: [
          { id: 'header-1', key: 'Authorization', value: 'Bearer ghp_123456789', enabled: true },
          { id: 'header-2', key: 'Content-Type', value: 'application/json', enabled: true }
        ],
        urlParams: [],
        body: {
          contentType: 'json',
          content: JSON.stringify({ event_type: 'build', client_payload: { status: 'success' } }, null, 2)
        },
        enabled: true,
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-15T10:30:00Z',
        lastExecutedAt: '2023-06-16T14:25:00Z',
        lastExecutionStatus: 'success',
        schedule: {
          type: 'daily',
          time: '09:00'
        }
      },
      {
        id: 'webhook-2',
        name: 'Slack Alert',
        description: 'Send alerts to Slack channel',
        url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        method: 'POST',
        headers: [
          { id: 'header-3', key: 'Content-Type', value: 'application/json', enabled: true }
        ],
        urlParams: [],
        body: {
          contentType: 'json',
          content: JSON.stringify({ text: 'Alert: System notification' }, null, 2)
        },
        enabled: false,
        createdAt: '2023-06-10T08:15:00Z',
        updatedAt: '2023-06-10T08:15:00Z',
        lastExecutedAt: '2023-06-12T11:45:00Z',
        lastExecutionStatus: 'error',
        schedule: {
          type: 'weekly',
          days: ['Monday', 'Wednesday', 'Friday']
        }
      },
      {
        id: 'webhook-3',
        name: 'API Status Check',
        description: 'Check if the API is up and running',
        url: 'https://api.example.com/status',
        method: 'GET',
        headers: [],
        urlParams: [
          { id: 'param-1', key: 'format', value: 'json', enabled: true }
        ],
        enabled: true,
        createdAt: '2023-06-05T16:20:00Z',
        updatedAt: '2023-06-05T16:20:00Z',
        lastExecutedAt: '2023-06-17T09:10:00Z',
        lastExecutionStatus: 'success',
        schedule: {
          type: 'interval',
          interval: 30
        }
      }
    ];

    // Mock webhook logs
    const mockWebhookLogs: WebhookLogEntry[] = [
      {
        id: 'log-1',
        webhookId: 'webhook-1',
        webhookName: 'GitHub Notification',
        timestamp: '2023-06-16T14:25:00Z',
        requestUrl: 'https://api.github.com/repos/user/repo/dispatches',
        requestMethod: 'POST',
        requestHeaders: {
          'Authorization': 'Bearer ghp_123456789',
          'Content-Type': 'application/json'
        },
        requestBody: JSON.stringify({ event_type: 'build', client_payload: { status: 'success' } }),
        responseStatus: 204,
        responseHeaders: {
          'Server': 'GitHub.com',
          'Date': 'Fri, 16 Jun 2023 14:25:01 GMT'
        },
        responseBody: '',
        duration: 320,
        success: true
      },
      {
        id: 'log-2',
        webhookId: 'webhook-2',
        webhookName: 'Slack Alert',
        timestamp: '2023-06-12T11:45:00Z',
        requestUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        requestMethod: 'POST',
        requestHeaders: {
          'Content-Type': 'application/json'
        },
        requestBody: JSON.stringify({ text: 'Alert: System notification' }),
        responseStatus: 403,
        responseHeaders: {
          'Date': 'Mon, 12 Jun 2023 11:45:01 GMT',
          'Server': 'Apache'
        },
        responseBody: JSON.stringify({ error: 'Invalid token' }),
        duration: 450,
        success: false,
        error: 'Authentication failed'
      },
      {
        id: 'log-3',
        webhookId: 'webhook-3',
        webhookName: 'API Status Check',
        timestamp: '2023-06-17T09:10:00Z',
        requestUrl: 'https://api.example.com/status?format=json',
        requestMethod: 'GET',
        requestHeaders: {},
        responseStatus: 200,
        responseHeaders: {
          'Content-Type': 'application/json',
          'Date': 'Sat, 17 Jun 2023 09:10:01 GMT'
        },
        responseBody: JSON.stringify({ status: 'healthy', uptime: '99.98%' }),
        duration: 180,
        success: true
      }
    ];

    // Mock incoming webhooks
    const mockIncomingWebhooks: IncomingWebhook[] = [
      {
        id: 'incoming-webhook-1',
        name: 'GitHub Webhook',
        description: 'Receive notifications from GitHub',
        endpointPath: 'github-events',
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-15T10:30:00Z',
        enabled: true,
        lastCalledAt: '2023-06-16T14:25:00Z',
        secretKey: 'secret123'
      },
      {
        id: 'incoming-webhook-2',
        name: 'Stripe Payment Webhook',
        description: 'Receive payment notifications from Stripe',
        endpointPath: 'stripe-payments',
        createdAt: '2023-06-10T08:15:00Z',
        updatedAt: '2023-06-10T08:15:00Z',
        enabled: true,
        lastCalledAt: '2023-06-12T11:45:00Z',
        secretKey: 'whsec_abc123'
      },
      {
        id: 'incoming-webhook-3',
        name: 'Monitoring Alerts',
        description: 'Receive alerts from monitoring system',
        endpointPath: 'monitoring-alerts',
        createdAt: '2023-06-05T16:20:00Z',
        updatedAt: '2023-06-05T16:20:00Z',
        enabled: false,
        lastCalledAt: null
      }
    ];

    // Mock incoming webhook logs
    const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = [
      {
        id: 'incoming-log-1',
        webhookId: 'incoming-webhook-1',
        webhookName: 'GitHub Webhook',
        timestamp: '2023-06-16T14:25:00Z',
        requestHeaders: {
          'User-Agent': 'GitHub-Hookshot/123456',
          'Content-Type': 'application/json',
          'X-GitHub-Event': 'push'
        },
        requestMethod: 'POST',
        requestBody: JSON.stringify({ 
          ref: 'refs/heads/main',
          repository: { name: 'example-repo' },
          commits: [{ id: 'abc123', message: 'Update README.md' }]
        }),
        isParsed: true,
        parsedData: JSON.stringify({ event: 'push', repo: 'example-repo' }),
        success: true,
        sourceIp: '192.30.252.1',
        contentType: 'application/json'
      },
      {
        id: 'incoming-log-2',
        webhookId: 'incoming-webhook-2',
        webhookName: 'Stripe Payment Webhook',
        timestamp: '2023-06-12T11:45:00Z',
        requestHeaders: {
          'User-Agent': 'Stripe/1.0',
          'Content-Type': 'application/json',
          'Stripe-Signature': 't=1623498301,v1=abc123'
        },
        requestMethod: 'POST',
        requestBody: JSON.stringify({
          id: 'evt_123456',
          type: 'payment_intent.succeeded',
          data: { object: { amount: 2000, currency: 'usd' } }
        }),
        isParsed: true,
        parsedData: JSON.stringify({ event: 'payment_intent.succeeded', amount: 2000 }),
        success: true,
        sourceIp: '54.187.174.169',
        contentType: 'application/json'
      },
      {
        id: 'incoming-log-3',
        webhookId: 'incoming-webhook-1',
        webhookName: 'GitHub Webhook',
        timestamp: '2023-06-15T09:30:00Z',
        requestHeaders: {
          'User-Agent': 'GitHub-Hookshot/123456',
          'Content-Type': 'application/json',
          'X-GitHub-Event': 'issue'
        },
        requestMethod: 'POST',
        requestBody: JSON.stringify({
          action: 'opened',
          issue: { number: 42, title: 'Bug report' }
        }),
        isParsed: false,
        success: false,
        sourceIp: '192.30.252.1',
        contentType: 'application/json',
        error: 'Invalid signature'
      }
    ];

    setWebhooks(mockWebhooks);
    setWebhookLogs(mockWebhookLogs);
    setIncomingWebhooks(mockIncomingWebhooks);
    setIncomingWebhookLogs(mockIncomingWebhookLogs);
    setIsLoading(false);
  }, []);

  // CRUD operations for outgoing webhooks
  const createWebhook = async (webhookData: Partial<Webhook>) => {
    try {
      const newWebhook: Webhook = {
        id: uuidv4(),
        name: webhookData.name || 'New Webhook',
        description: webhookData.description || '',
        url: webhookData.url || '',
        method: webhookData.method || 'GET',
        headers: webhookData.headers || [],
        urlParams: webhookData.urlParams || [],
        body: webhookData.body,
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastExecutedAt: null,
        lastExecutionStatus: null,
        schedule: webhookData.schedule,
        tags: webhookData.tags || []
      };
      
      setWebhooks(prev => [newWebhook, ...prev]);
      toast.success('Webhook created successfully');
    } catch (err) {
      console.error('Error creating webhook:', err);
      toast.error('Failed to create webhook');
      throw err;
    }
  };

  const updateWebhook = async (webhook: Webhook) => {
    try {
      setWebhooks(prev => 
        prev.map(w => w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w)
      );
      toast.success('Webhook updated successfully');
    } catch (err) {
      console.error('Error updating webhook:', err);
      toast.error('Failed to update webhook');
      throw err;
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      setWebhooks(prev => prev.filter(w => w.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (err) {
      console.error('Error deleting webhook:', err);
      toast.error('Failed to delete webhook');
      throw err;
    }
  };

  const executeWebhook = async (webhook: Webhook, isTest = false) => {
    try {
      // Clear any previous test response if this is a test run
      if (isTest) {
        setTestResponse(null);
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
      
      // Make HTTP request
      const response = await fetch(url, {
        method: webhook.method,
        headers,
        body,
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Get response data
      let responseText = '';
      let responseData;
      
      try {
        responseText = await response.text();
        // Try to parse as JSON if it looks like JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          try {
            responseData = JSON.parse(responseText);
            // Re-stringify with proper formatting
            responseText = JSON.stringify(responseData, null, 2);
          } catch {
            // If it's not valid JSON, keep as text
          }
        }
      } catch (err) {
        console.error('Error reading response body:', err);
      }
      
      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
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
        responseStatus: response.status,
        responseHeaders: responseHeaders,
        responseBody: responseText,
        duration,
        success: response.ok
      };
      
      // Record test response if in test mode
      if (isTest) {
        setTestResponse(logEntry);
      } else {
        // Add to logs
        setWebhookLogs(prev => [logEntry, ...prev]);
        
        // Update webhook's last execution status
        setWebhooks(prev => 
          prev.map(w => 
            w.id === webhook.id 
              ? { 
                  ...w, 
                  lastExecutedAt: new Date().toISOString(), 
                  lastExecutionStatus: response.ok ? 'success' : 'error' 
                } 
              : w
          )
        );
        
        toast.success(`Webhook executed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error executing webhook:', err);
      
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
        error: err instanceof Error ? err.message : 'Network error'
      };
      
      // Record error in test response if in test mode
      if (isTest) {
        setTestResponse(errorLogEntry);
      } else {
        // Add to logs
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
        
        toast.error(`Failed to execute webhook: ${err instanceof Error ? err.message : 'Network error'}`);
      }
    }
  };

  // CRUD operations for incoming webhooks
  const createIncomingWebhook = async (webhookData: Partial<IncomingWebhook>) => {
    try {
      const newWebhook: IncomingWebhook = {
        id: uuidv4(),
        name: webhookData.name || 'New Incoming Webhook',
        description: webhookData.description || '',
        endpointPath: webhookData.endpointPath || '',
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalledAt: null,
        secretKey: uuidv4().slice(0, 8),
        tags: webhookData.tags || []
      };
      
      setIncomingWebhooks(prev => [newWebhook, ...prev]);
      toast.success('Incoming webhook created successfully');
    } catch (err) {
      console.error('Error creating incoming webhook:', err);
      toast.error('Failed to create incoming webhook');
      throw err;
    }
  };

  const updateIncomingWebhook = async (webhook: IncomingWebhook) => {
    try {
      setIncomingWebhooks(prev => 
        prev.map(w => w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w)
      );
      toast.success('Incoming webhook updated successfully');
    } catch (err) {
      console.error('Error updating incoming webhook:', err);
      toast.error('Failed to update incoming webhook');
      throw err;
    }
  };

  const deleteIncomingWebhook = async (id: string) => {
    try {
      setIncomingWebhooks(prev => prev.filter(w => w.id !== id));
      toast.success('Incoming webhook deleted successfully');
    } catch (err) {
      console.error('Error deleting incoming webhook:', err);
      toast.error('Failed to delete incoming webhook');
      throw err;
    }
  };

  // UI Operations
  const handleEditWebhook = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  const handleDeleteWebhook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      deleteWebhook(id);
    }
  };

  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setSelectedIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  const handleDeleteIncomingWebhook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this incoming webhook?')) {
      deleteIncomingWebhook(id);
    }
  };

  const clearTestResponse = () => {
    setTestResponse(null);
  };

  return (
    <WebhookContext.Provider
      value={{
        webhooks,
        webhookLogs,
        incomingWebhooks,
        incomingWebhookLogs,
        isLoading,
        error,
        selectedWebhook,
        setSelectedWebhook,
        selectedIncomingWebhook,
        setSelectedIncomingWebhook,
        isWebhookModalOpen,
        setIsWebhookModalOpen,
        isIncomingWebhookModalOpen,
        setIsIncomingWebhookModalOpen,
        isTestMode,
        setIsTestMode,
        testResponse,
        searchQuery,
        setSearchQuery,
        createWebhook,
        updateWebhook,
        deleteWebhook,
        executeWebhook,
        createIncomingWebhook,
        updateIncomingWebhook,
        deleteIncomingWebhook,
        handleEditWebhook,
        handleDeleteWebhook,
        handleEditIncomingWebhook,
        handleDeleteIncomingWebhook,
        clearTestResponse
      }}
    >
      {children}
    </WebhookContext.Provider>
  );
};

export const useWebhookContext = () => {
  const context = useContext(WebhookContext);
  if (context === undefined) {
    throw new Error('useWebhookContext must be used within a WebhookProvider');
  }
  return context;
};

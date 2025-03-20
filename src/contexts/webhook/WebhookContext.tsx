import React, { createContext, useContext, useState, useEffect } from 'react';
import { Webhook, WebhookLogEntry, WebhookTestResponse, WebhookTag, HttpMethod, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useWebhookOperations } from './useWebhookOperations';

interface WebhookContextType {
  // Webhooks
  webhooks: Webhook[];
  webhookLogs: WebhookLogEntry[];
  incomingWebhooks: IncomingWebhook[];
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  isLoading: boolean;
  isTestLoading: boolean;
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
  createWebhook: (webhook: Partial<Webhook>) => Promise<Webhook | null>;
  updateWebhook: (webhook: Webhook) => Promise<Webhook | null>;
  deleteWebhook: (id: string) => Promise<void>;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<WebhookTestResponse | null>;
  sendTestRequest: (webhook: Webhook) => Promise<WebhookTestResponse | null>;
  
  createIncomingWebhook: (webhook: Partial<IncomingWebhook>) => Promise<IncomingWebhook | null>;
  updateIncomingWebhook: (webhook: IncomingWebhook) => Promise<IncomingWebhook | null>;
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
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<WebhookLogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const { executeWebhook, clearTestResponse, sendTestRequest } = useWebhookOperations(
    webhooks,
    setWebhooks,
    webhookLogs,
    setWebhookLogs,
    selectedWebhook,
    setSelectedWebhook,
    setTestResponse,
    setIsTestLoading
  );

  useEffect(() => {
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
        params: [],
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
        params: [],
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
        params: [],
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

  const createWebhook = async (webhookData: Partial<Webhook>): Promise<Webhook | null> => {
    try {
      if (!webhookData.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhookData.url) {
        toast.error('Webhook URL is required');
        return null;
      }
      
      const newWebhook: Webhook = {
        id: `webhook-${uuidv4()}`,
        name: webhookData.name,
        description: webhookData.description || '',
        url: webhookData.url,
        method: webhookData.method || 'GET',
        headers: webhookData.headers || [],
        params: webhookData.params || [],
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
      return newWebhook;
    } catch (err) {
      console.error('Error creating webhook:', err);
      toast.error('Failed to create webhook');
      return null;
    }
  };

  const updateWebhook = async (webhook: Webhook): Promise<Webhook | null> => {
    try {
      if (!webhook.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhook.url) {
        toast.error('Webhook URL is required');
        return null;
      }
      
      const updatedWebhook = {
        ...webhook,
        updatedAt: new Date().toISOString()
      };
      
      setWebhooks(prev => 
        prev.map(w => w.id === webhook.id ? updatedWebhook : w)
      );
      
      if (selectedWebhook && selectedWebhook.id === webhook.id) {
        setSelectedWebhook(updatedWebhook);
      }
      
      toast.success('Webhook updated successfully');
      return updatedWebhook;
    } catch (err) {
      console.error('Error updating webhook:', err);
      toast.error('Failed to update webhook');
      return null;
    }
  };

  const deleteWebhook = async (id: string): Promise<void> => {
    try {
      setWebhooks(prev => prev.filter(w => w.id !== id));
      
      if (selectedWebhook && selectedWebhook.id === id) {
        setSelectedWebhook(null);
        setIsTestMode(false);
      }
      
      toast.success('Webhook deleted successfully');
    } catch (err) {
      console.error('Error deleting webhook:', err);
      toast.error('Failed to delete webhook');
    }
  };

  const createIncomingWebhook = async (webhookData: Partial<IncomingWebhook>): Promise<IncomingWebhook | null> => {
    try {
      if (!webhookData.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhookData.endpointPath) {
        toast.error('Endpoint path is required');
        return null;
      }
      
      const newWebhook: IncomingWebhook = {
        id: `incoming-webhook-${uuidv4()}`,
        name: webhookData.name,
        description: webhookData.description || '',
        endpointPath: webhookData.endpointPath,
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalledAt: null,
        secretKey: uuidv4().slice(0, 8),
        tags: webhookData.tags || []
      };
      
      setIncomingWebhooks(prev => [newWebhook, ...prev]);
      toast.success('Incoming webhook created successfully');
      return newWebhook;
    } catch (err) {
      console.error('Error creating incoming webhook:', err);
      toast.error('Failed to create incoming webhook');
      return null;
    }
  };

  const updateIncomingWebhook = async (webhook: IncomingWebhook): Promise<IncomingWebhook | null> => {
    try {
      if (!webhook.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhook.endpointPath) {
        toast.error('Endpoint path is required');
        return null;
      }
      
      const updatedWebhook = {
        ...webhook,
        updatedAt: new Date().toISOString()
      };
      
      setIncomingWebhooks(prev => 
        prev.map(w => w.id === webhook.id ? updatedWebhook : w)
      );
      
      if (selectedIncomingWebhook && selectedIncomingWebhook.id === webhook.id) {
        setSelectedIncomingWebhook(updatedWebhook);
      }
      
      toast.success('Incoming webhook updated successfully');
      return updatedWebhook;
    } catch (err) {
      console.error('Error updating incoming webhook:', err);
      toast.error('Failed to update incoming webhook');
      return null;
    }
  };

  const deleteIncomingWebhook = async (id: string): Promise<void> => {
    try {
      setIncomingWebhooks(prev => prev.filter(w => w.id !== id));
      
      if (selectedIncomingWebhook && selectedIncomingWebhook.id === id) {
        setSelectedIncomingWebhook(null);
      }
      
      toast.success('Incoming webhook deleted successfully');
    } catch (err) {
      console.error('Error deleting incoming webhook:', err);
      toast.error('Failed to delete incoming webhook');
    }
  };

  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
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

  return (
    <WebhookContext.Provider
      value={{
        webhooks,
        webhookLogs,
        incomingWebhooks,
        incomingWebhookLogs,
        isLoading,
        isTestLoading,
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
        sendTestRequest,
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

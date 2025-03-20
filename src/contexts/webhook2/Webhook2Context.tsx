
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Webhook, WebhookLogEntry, WebhookTestResponse, WebhookFilters, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook2';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useWebhookOperations } from './hooks/useWebhookOperations';
import { Webhook2ContextType } from './types';
import { mockWebhooks, mockWebhookLogs, mockIncomingWebhooks, mockIncomingWebhookLogs } from './data';

const Webhook2Context = createContext<Webhook2ContextType | undefined>(undefined);

export const Webhook2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [filterOptions, setFilterOptions] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    tags: []
  });

  const { executeWebhook, clearTestResponse, sendTestRequest } = useWebhookOperations({
    webhooks,
    setWebhooks,
    webhookLogs,
    setWebhookLogs,
    selectedWebhook,
    setSelectedWebhook,
    setTestResponse,
    setIsTestLoading
  });

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setWebhooks(mockWebhooks);
        setWebhookLogs(mockWebhookLogs);
        setIncomingWebhooks(mockIncomingWebhooks);
        setIncomingWebhookLogs(mockIncomingWebhookLogs);
      } catch (err) {
        console.error('Error loading webhook data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load webhook data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const refreshWebhooks = () => {
    setWebhooks([...mockWebhooks]);
  };

  const refreshWebhookLogs = () => {
    setWebhookLogs([...mockWebhookLogs]);
  };

  const createWebhook = async (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Webhook | null> => {
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
        description: webhookData.description,
        url: webhookData.url,
        method: webhookData.method,
        headers: webhookData.headers,
        params: webhookData.params,
        body: webhookData.body,
        enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastExecutedAt: null,
        lastExecutionStatus: null,
        schedule: webhookData.schedule,
        tags: webhookData.tags,
        userId: user?.id
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
    <Webhook2Context.Provider
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
        filterOptions,
        setFilterOptions,
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
        clearTestResponse,
        refreshWebhooks,
        refreshWebhookLogs
      }}
    >
      {children}
    </Webhook2Context.Provider>
  );
};

export const useWebhook2Context = () => {
  const context = useContext(Webhook2Context);
  if (context === undefined) {
    throw new Error('useWebhook2Context must be used within a Webhook2Provider');
  }
  return context;
};

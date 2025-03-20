
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Webhook, WebhookLogEntry, WebhookTestResponse, WebhookFilters, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook2';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useWebhookOperations } from './hooks/useWebhookOperations';
import { Webhook2ContextType } from './types';
import { mockIncomingWebhooks, mockIncomingWebhookLogs } from './data';
import { supabase } from '@/integrations/supabase/client';
import { mapDbWebhookToWebhook, mapDbLogToWebhookLog, mapWebhookToDbWebhook } from '@/utils/mappers';

const Webhook2Context = createContext<Webhook2ContextType | undefined>(undefined);

export const Webhook2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
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

  const handleFilterOptionsChange = (filters: Partial<WebhookFilters>) => {
    setFilterOptions(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  };

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

  // Fetch webhooks from Supabase
  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      
      if (!session) {
        setWebhooks([]);
        setWebhookLogs([]);
        setIsLoading(false);
        return;
      }
      
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (webhookError) {
        throw new Error(`Error fetching webhooks: ${webhookError.message}`);
      }
      
      const { data: logData, error: logError } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (logError) {
        throw new Error(`Error fetching webhook logs: ${logError.message}`);
      }
      
      // Convert DB format to frontend models
      const mappedWebhooks = webhookData?.map(dbWebhook => mapDbWebhookToWebhook(dbWebhook)) || [];
      setWebhooks(mappedWebhooks);
      
      // Create a map of webhook IDs to names for the logs
      const webhookNames = new Map<string, string>();
      mappedWebhooks.forEach(webhook => {
        webhookNames.set(webhook.id, webhook.name);
      });
      
      // Convert DB logs to frontend models
      const mappedLogs = logData?.map(log => 
        mapDbLogToWebhookLog(log, webhookNames.get(log.webhook_id))
      ) || [];
      setWebhookLogs(mappedLogs);
      
      // Still using mock data for incoming webhooks for now
      setIncomingWebhooks(mockIncomingWebhooks);
      setIncomingWebhookLogs(mockIncomingWebhookLogs);
      
      setError(null);
    } catch (err) {
      console.error('Error loading webhook data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load webhook data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, [session]);

  const refreshWebhooks = () => {
    fetchWebhooks();
  };

  const refreshWebhookLogs = async () => {
    try {
      setIsLoading(true);
      
      if (!session) {
        setWebhookLogs([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) {
        throw new Error(`Error refreshing webhook logs: ${error.message}`);
      }
      
      // Create a map of webhook IDs to names
      const webhookNames = new Map<string, string>();
      webhooks.forEach(webhook => {
        webhookNames.set(webhook.id, webhook.name);
      });
      
      // Convert DB logs to frontend models
      const mappedLogs = data?.map(log => 
        mapDbLogToWebhookLog(log, webhookNames.get(log.webhook_id))
      ) || [];
      setWebhookLogs(mappedLogs);
    } catch (err) {
      console.error('Error refreshing webhook logs:', err);
      toast.error('Failed to refresh webhook logs');
    } finally {
      setIsLoading(false);
    }
  };

  const createWebhook = async (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Webhook | null> => {
    try {
      if (!user) {
        toast.error('You must be logged in to create webhooks');
        return null;
      }
      
      if (!webhookData.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhookData.url) {
        toast.error('Webhook URL is required');
        return null;
      }
      
      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          name: webhookData.name,
          description: webhookData.description,
          url: webhookData.url,
          method: webhookData.method,
          headers: webhookData.headers as any,
          params: webhookData.params as any,
          body: webhookData.body as any,
          enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
          tags: webhookData.tags || [],
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating webhook: ${error.message}`);
      }
      
      const newWebhook = mapDbWebhookToWebhook(data);
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
      if (!user) {
        toast.error('You must be logged in to update webhooks');
        return null;
      }
      
      if (!webhook.name) {
        toast.error('Webhook name is required');
        return null;
      }
      
      if (!webhook.url) {
        toast.error('Webhook URL is required');
        return null;
      }
      
      // Convert the webhook to DB format
      const dbWebhook = mapWebhookToDbWebhook(webhook);
      
      const { data, error } = await supabase
        .from('webhooks')
        .update(dbWebhook)
        .eq('id', webhook.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error updating webhook: ${error.message}`);
      }
      
      const updatedWebhook = mapDbWebhookToWebhook(data);
      
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
      if (!user) {
        toast.error('You must be logged in to delete webhooks');
        return;
      }
      
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting webhook: ${error.message}`);
      }
      
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
        setFilterOptions: handleFilterOptionsChange,
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

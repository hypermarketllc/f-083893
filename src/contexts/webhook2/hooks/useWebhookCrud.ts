
import { useState } from 'react';
import { Webhook, WebhookLogEntry, IncomingWebhook, WebhookTag } from '@/types/webhook2';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { mapDbWebhookToWebhook, mapWebhookToDbWebhook, toJson } from '@/utils/mappers';
import { WebhookStateHookProps } from './useWebhookState';

export interface WebhookCrudHookProps extends WebhookStateHookProps {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>;
  incomingWebhooks: IncomingWebhook[];
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>;
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTestMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useWebhookCrud = ({
  webhooks,
  setWebhooks,
  selectedWebhook,
  setSelectedWebhook,
  incomingWebhooks,
  setIncomingWebhooks,
  selectedIncomingWebhook,
  setSelectedIncomingWebhook,
  setIsWebhookModalOpen,
  setIsIncomingWebhookModalOpen,
  setIsLoading,
  setIsTestMode
}: WebhookCrudHookProps) => {
  const { user } = useAuth();

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
          headers: toJson(webhookData.headers),
          params: toJson(webhookData.params),
          body: toJson(webhookData.body),
          enabled: webhookData.enabled !== undefined ? webhookData.enabled : true,
          tags: toJson(webhookData.tags || []),
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

  // Function to fetch webhooks from Supabase
  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        setWebhooks([]);
        return;
      }
      
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (webhookError) {
        throw new Error(`Error fetching webhooks: ${webhookError.message}`);
      }
      
      // Convert DB format to frontend models
      const mappedWebhooks = webhookData?.map(dbWebhook => mapDbWebhookToWebhook(dbWebhook)) || [];
      setWebhooks(mappedWebhooks);
      
    } catch (err) {
      console.error('Error loading webhook data:', err);
      toast.error('Failed to load webhooks');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWebhook,
    updateWebhook,
    deleteWebhook,
    createIncomingWebhook,
    updateIncomingWebhook,
    deleteIncomingWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook,
    fetchWebhooks
  };
};

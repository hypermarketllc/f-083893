
import { useState } from 'react';
import { Webhook } from '@/types/webhook';
import { toast } from 'sonner';

export function useCreateWebhook(
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const createWebhook = (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Generate a new ID
      const newId = `webhook-${Date.now()}`;
      const now = new Date().toISOString();
      
      // Create the new webhook object
      const newWebhook: Webhook = {
        id: newId,
        ...webhookData,
        createdAt: now,
        updatedAt: now
      };
      
      // Add to the webhooks list
      setWebhooks(prevWebhooks => [...prevWebhooks, newWebhook]);
      
      // Close the modal
      setIsWebhookModalOpen(false);
      
      // Show a success toast
      toast.success('Webhook created successfully');
      
      return newWebhook;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook');
      return null;
    }
  };
  
  return { createWebhook };
}

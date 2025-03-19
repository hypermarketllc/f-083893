
import { useState } from 'react';
import { Webhook } from '@/types/webhook';
import { toast } from 'sonner';

export function useCreateWebhook(
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [isCreating, setIsCreating] = useState(false);

  const createWebhook = (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
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

      // Check for duplicate names
      const isDuplicate = webhooks.some(webhook => 
        webhook.name.toLowerCase() === webhookData.name.toLowerCase()
      );
      
      if (isDuplicate) {
        toast.error('A webhook with this name already exists');
        setIsCreating(false);
        return null;
      }

      // Generate a new ID and timestamps
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
      
      setIsCreating(false);
      return newWebhook;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error(`Failed to create webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsCreating(false);
      return null;
    }
  };
  
  return { createWebhook, isCreating };
}

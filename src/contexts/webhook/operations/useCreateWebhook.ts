
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Webhook } from '@/types/webhook';

export const useCreateWebhook = (
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return { createWebhook };
};

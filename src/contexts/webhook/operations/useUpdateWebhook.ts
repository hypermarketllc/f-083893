
import { useState } from 'react';
import { Webhook } from '@/types/webhook';
import { toast } from 'sonner';

export function useUpdateWebhook(
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>
) {
  const updateWebhook = (updatedWebhook: Webhook) => {
    try {
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
      toast.error('Failed to update webhook');
      return null;
    }
  };
  
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };
  
  const handleDeleteWebhook = (webhookId: string) => {
    // Show a confirmation dialog
    if (confirm('Are you sure you want to delete this webhook?')) {
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
        toast.error('Failed to delete webhook');
      }
    }
  };
  
  return { updateWebhook, handleEditWebhook, handleDeleteWebhook };
}

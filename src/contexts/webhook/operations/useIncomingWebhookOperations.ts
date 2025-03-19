
import { useState } from 'react';
import { IncomingWebhook } from '@/types/webhook';
import { toast } from 'sonner';

export function useIncomingWebhookOperations(
  incomingWebhooks: IncomingWebhook[],
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>,
  selectedIncomingWebhook: IncomingWebhook | null,
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>,
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>
) {
  const createIncomingWebhook = (webhookData: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Generate a new ID
      const newId = `incoming-webhook-${Date.now()}`;
      const now = new Date().toISOString();
      
      // Create the new webhook object
      const newWebhook: IncomingWebhook = {
        id: newId,
        ...webhookData,
        createdAt: now,
        updatedAt: now
      };
      
      // Add to the webhooks list
      setIncomingWebhooks(prevWebhooks => [...prevWebhooks, newWebhook]);
      
      // Close the modal
      setIsIncomingWebhookModalOpen(false);
      
      // Show a success toast
      toast.success('Incoming webhook created successfully');
      
      return newWebhook;
    } catch (error) {
      console.error('Failed to create incoming webhook:', error);
      toast.error('Failed to create incoming webhook');
      return null;
    }
  };
  
  const updateIncomingWebhook = (updatedWebhook: IncomingWebhook) => {
    try {
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
      toast.error('Failed to update incoming webhook');
      return null;
    }
  };
  
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };
  
  const handleDeleteIncomingWebhook = (webhookId: string) => {
    // Show a confirmation dialog
    if (confirm('Are you sure you want to delete this incoming webhook?')) {
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
        toast.error('Failed to delete incoming webhook');
      }
    }
  };
  
  return { 
    createIncomingWebhook, 
    updateIncomingWebhook, 
    handleEditIncomingWebhook, 
    handleDeleteIncomingWebhook 
  };
}

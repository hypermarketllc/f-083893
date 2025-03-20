
import { useState } from 'react';
import { Webhook } from '@/types/webhook';
import { toast } from 'sonner';

export function useUpdateWebhook(
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const updateWebhook = (updatedWebhook: Webhook) => {
    try {
      setIsUpdating(true);
      
      // Input validation
      if (!updatedWebhook.name) {
        toast.error('Webhook name is required');
        setIsUpdating(false);
        return null;
      }

      if (!updatedWebhook.url) {
        toast.error('Webhook URL is required');
        setIsUpdating(false);
        return null;
      }
      
      // Validate URL format
      try {
        // Use URL constructor to validate the URL format
        new URL(updatedWebhook.url);
      } catch (e) {
        // If URL is invalid, try to fix it by adding https:// prefix
        if (!updatedWebhook.url.startsWith('http://') && !updatedWebhook.url.startsWith('https://')) {
          updatedWebhook.url = 'https://' + updatedWebhook.url;
          try {
            new URL(updatedWebhook.url);
          } catch (e) {
            toast.error('Invalid URL format. Please include a valid protocol (http:// or https://)');
            setIsUpdating(false);
            return null;
          }
        } else {
          toast.error('Invalid URL format');
          setIsUpdating(false);
          return null;
        }
      }
      
      // Update the updatedAt timestamp
      const webhook = {
        ...updatedWebhook,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updating webhook with URL:', webhook.url);
      
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
      
      setIsUpdating(false);
      return webhook;
    } catch (error) {
      console.error('Failed to update webhook:', error);
      toast.error(`Failed to update webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUpdating(false);
      return null;
    }
  };
  
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook({...webhook});
    setIsWebhookModalOpen(true);
  };
  
  const handleDeleteWebhook = (webhookId: string) => {
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
      toast.error(`Failed to delete webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return { updateWebhook, handleEditWebhook, handleDeleteWebhook, isUpdating };
}


import { toast } from 'sonner';
import { Webhook } from '@/types/webhook';

export const useUpdateWebhook = (
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>
) => {
  // Update an existing webhook
  const updateWebhook = (webhook: Webhook) => {
    setWebhooks(prevWebhooks => 
      prevWebhooks.map(w => 
        w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
      )
    );
    
    // Also update selectedWebhook if it's the one being edited
    if (setSelectedWebhook) {
      setSelectedWebhook({ ...webhook, updatedAt: new Date().toISOString() });
    }
    
    setIsWebhookModalOpen(false);
    setEditingWebhook(null);
    toast.success('Webhook updated successfully');
  };

  // Handle edit webhook (open modal with webhook data)
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  // Delete a webhook
  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prevWebhooks => prevWebhooks.filter(w => w.id !== id));
    if (setSelectedWebhook) {
      setSelectedWebhook(null);
    }
    toast.success('Webhook deleted successfully');
  };

  return {
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook
  };
};

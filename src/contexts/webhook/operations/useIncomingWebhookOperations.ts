
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { IncomingWebhook } from '@/types/webhook';

export function useIncomingWebhookOperations(
  incomingWebhooks: IncomingWebhook[],
  setIncomingWebhooks: React.Dispatch<React.SetStateAction<IncomingWebhook[]>>,
  selectedIncomingWebhook: IncomingWebhook | null,
  setSelectedIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>,
  setIsIncomingWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingIncomingWebhook: React.Dispatch<React.SetStateAction<IncomingWebhook | null>>
) {
  // Create a new incoming webhook
  const createIncomingWebhook = (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWebhook: IncomingWebhook = {
      ...webhook,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setIncomingWebhooks([...incomingWebhooks, newWebhook]);
    setIsIncomingWebhookModalOpen(false);
    toast.success('Incoming webhook created successfully');
  };

  // Update an existing incoming webhook
  const updateIncomingWebhook = (webhook: IncomingWebhook) => {
    setIncomingWebhooks(incomingWebhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    ));
    setIsIncomingWebhookModalOpen(false);
    setEditingIncomingWebhook(null);
    toast.success('Incoming webhook updated successfully');
  };

  // Handle edit incoming webhook (open modal with webhook data)
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  // Delete an incoming webhook
  const handleDeleteIncomingWebhook = (id: string) => {
    setIncomingWebhooks(incomingWebhooks.filter(w => w.id !== id));
    if (selectedIncomingWebhook?.id === id) {
      setSelectedIncomingWebhook(null);
    }
    toast.success('Incoming webhook deleted successfully');
  };

  return {
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook
  };
}

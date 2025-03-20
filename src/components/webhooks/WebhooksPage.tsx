
import React from 'react';
import { WebhookTable } from './WebhookTable';
import { Button } from '@/components/ui/button';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Plus } from 'lucide-react';
import WebhookEmptyState from './WebhookEmptyState';

const WebhooksPage: React.FC = () => {
  const { 
    webhooks, 
    isLoading, 
    setIsWebhookModalOpen 
  } = useWebhookContext();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 w-full max-w-sm bg-muted rounded animate-pulse"></div>
        <div className="h-64 w-full bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Webhooks</h2>
        <Button 
          onClick={() => setIsWebhookModalOpen(true)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Webhook
        </Button>
      </div>

      {webhooks.length === 0 ? (
        <WebhookEmptyState 
          type="outgoing" 
          message="No webhooks found" 
          showCreateButton={true} 
        />
      ) : (
        <WebhookTable />
      )}
    </div>
  );
};

export default WebhooksPage;

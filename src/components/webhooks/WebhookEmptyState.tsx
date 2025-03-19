
import React from 'react';
import { Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';

interface WebhookEmptyStateProps {
  type?: 'outgoing' | 'incoming' | 'logs';
  message?: string;
  showCreateButton?: boolean;
}

const WebhookEmptyState: React.FC<WebhookEmptyStateProps> = ({ 
  type = 'outgoing',
  message,
  showCreateButton = true
}) => {
  const { setIsWebhookModalOpen, setIsIncomingWebhookModalOpen } = useWebhookContext();

  const handleCreate = () => {
    if (type === 'incoming') {
      setIsIncomingWebhookModalOpen(true);
    } else {
      setIsWebhookModalOpen(true);
    }
  };

  // Set default messages based on type
  const defaultMessage = type === 'logs' 
    ? 'No webhook logs found' 
    : type === 'incoming' 
      ? 'No incoming webhooks found' 
      : 'No outgoing webhooks found';

  const actionText = type === 'logs' 
    ? 'Execute a webhook to see logs here' 
    : type === 'incoming' 
      ? 'Create a new incoming webhook to receive data' 
      : 'Create a new webhook to send data to external services';

  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
        <Webhook className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-lg font-medium">{message || defaultMessage}</h3>
      <p className="text-muted-foreground mt-1 text-center max-w-md">
        {actionText}
      </p>
      
      {showCreateButton && type !== 'logs' && (
        <Button 
          variant="default" 
          className="mt-4"
          onClick={handleCreate}
        >
          Create {type === 'incoming' ? 'Incoming' : ''} Webhook
        </Button>
      )}
    </div>
  );
};

export default WebhookEmptyState;

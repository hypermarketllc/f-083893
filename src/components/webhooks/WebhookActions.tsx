
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Edit, Trash2, Play } from 'lucide-react';

interface WebhookActionsProps {
  webhook: Webhook;
  isTestMode: boolean;
}

const WebhookActions: React.FC<WebhookActionsProps> = ({ webhook, isTestMode }) => {
  const {
    handleEditWebhook,
    handleDeleteWebhook,
    setIsTestMode,
    sendTestRequest
  } = useWebhookContext();

  return (
    <div className="flex justify-between items-center mt-4">
      <ToggleGroup type="single" value={isTestMode ? "test" : "live"}>
        <ToggleGroupItem value="live" aria-label="Live Mode" onClick={() => setIsTestMode(false)}>
          Live
        </ToggleGroupItem>
        <ToggleGroupItem value="test" aria-label="Test Mode" onClick={() => setIsTestMode(true)}>
          Test
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            handleEditWebhook(webhook);
          }}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteWebhook(webhook.id);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        {isTestMode && (
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              sendTestRequest(webhook);
            }}
          >
            <Play className="h-4 w-4 mr-1" />
            Test
          </Button>
        )}
      </div>
    </div>
  );
};

export default WebhookActions;

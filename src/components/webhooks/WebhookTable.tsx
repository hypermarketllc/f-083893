
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook } from '@/types/webhook';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Check, 
  Clock, 
  Edit, 
  ExternalLink,
  Eye, 
  Play,
  Trash2, 
  X,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import WebhookScheduleInfo from './WebhookScheduleInfo';
import WebhookMethodBadge from './WebhookMethodBadge';
import WebhookEmptyState from './WebhookEmptyState';
import WebhookActions from './WebhookActions';

interface WebhookTableProps {
  compact?: boolean;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({ compact = false }) => {
  const { 
    webhooks, 
    selectedWebhook, 
    setSelectedWebhook,
    isTestMode,
  } = useWebhookContext();

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <WebhookCard 
          key={webhook.id}
          webhook={webhook}
          selectedWebhook={selectedWebhook}
          setSelectedWebhook={setSelectedWebhook}
          isTestMode={isTestMode}
          compact={compact}
        />
      ))}
      
      {webhooks.length === 0 && <WebhookEmptyState />}
    </div>
  );
};

interface WebhookCardProps {
  webhook: Webhook;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook) => void;
  isTestMode: boolean;
  compact?: boolean;
}

const WebhookCard: React.FC<WebhookCardProps> = ({ 
  webhook, 
  selectedWebhook, 
  setSelectedWebhook, 
  isTestMode,
  compact = false 
}) => {
  const isSelected = selectedWebhook?.id === webhook.id;
  
  return (
    <Card 
      className={`${isSelected ? 'border-primary' : ''} transition-all hover:border-primary cursor-pointer`}
      onClick={() => setSelectedWebhook(webhook)}
    >
      <CardHeader className={`${compact ? 'py-3' : ''}`}>
        <div className="flex justify-between">
          <div className="flex items-start space-x-2">
            <WebhookMethodBadge method={webhook.method} />
            <div>
              <CardTitle className={`${compact ? 'text-base' : ''}`}>{webhook.name}</CardTitle>
              <CardDescription className={`${compact ? 'text-xs' : ''} truncate max-w-xs md:max-w-md`}>
                {webhook.url}
              </CardDescription>
            </div>
          </div>
          <StatusBadge enabled={webhook.enabled} />
        </div>
      </CardHeader>
      
      {(!compact || isSelected) && (
        <CardContent>
          {webhook.description && (
            <p className="text-sm text-muted-foreground mb-2">{webhook.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
            <WebhookScheduleInfo schedule={webhook.schedule} />
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 
              Updated {format(new Date(webhook.updatedAt), 'MMM d, yyyy')}
            </span>
          </div>
          
          {isSelected && <WebhookActions webhook={webhook} isTestMode={isTestMode} />}
        </CardContent>
      )}
    </Card>
  );
};

interface StatusBadgeProps {
  enabled: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ enabled }) => (
  <Badge variant={enabled ? "default" : "outline"}>
    {enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
  </Badge>
);

export default WebhookTable;


import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, WebhookTag } from '@/types/webhook';
import { WebhookFilterBar, WebhookFilters } from './filters/WebhookFilterBar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WebhookScheduleInfo from './WebhookScheduleInfo';
import WebhookMethodBadge from './WebhookMethodBadge';
import WebhookEmptyState from './WebhookEmptyState';
import WebhookActions from './WebhookActions';
import WebhookToggle from './WebhookToggle';
import ActivityIndicator from './ActivityIndicator';
import TagsManager from './tags/TagsManager';
import { Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface WebhookTableProps {
  compact?: boolean;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({ compact = false }) => {
  const { 
    webhooks, 
    selectedWebhook, 
    setSelectedWebhook,
    isTestMode,
    updateWebhook
  } = useWebhookContext();

  const [filteredWebhooks, setFilteredWebhooks] = useState<Webhook[]>(webhooks);
  const [filters, setFilters] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    tags: []
  });

  // Mock tags for demo - in a real app these would come from the API
  const mockTags: WebhookTag[] = [
    { id: 'tag-1', name: 'Production', color: '#69db7c' },
    { id: 'tag-2', name: 'Development', color: '#4dabf7' },
    { id: 'tag-3', name: 'Testing', color: '#ff922b' },
    { id: 'tag-4', name: 'Important', color: '#ff6b6b' },
  ];

  // Apply filters to webhooks
  useEffect(() => {
    let result = [...webhooks];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(webhook => 
        webhook.name.toLowerCase().includes(searchLower) || 
        webhook.description.toLowerCase().includes(searchLower) ||
        webhook.url.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.method) {
      result = result.filter(webhook => webhook.method === filters.method);
    }
    
    if (filters.status) {
      result = result.filter(webhook => webhook.lastExecutionStatus === filters.status);
    }
    
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter(webhook => {
        if (!webhook.lastExecutedAt) return false;
        
        const executionDate = new Date(webhook.lastExecutedAt);
        if (filters.dateFrom && executionDate < filters.dateFrom) return false;
        if (filters.dateTo) {
          // Add 1 day to include the end date in the range
          const endDate = new Date(filters.dateTo);
          endDate.setDate(endDate.getDate() + 1);
          if (executionDate > endDate) return false;
        }
        
        return true;
      });
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // In a real app, this would filter by actual webhook tags
      // For now, we'll just simulate it with our mock tags
      result = result.filter(webhook => {
        // Simulate that webhooks have tags
        const webhookTags = webhook.tags || []; 
        return filters.tags!.some(tagId => webhookTags.some(tag => tag.id === tagId));
      });
    }
    
    setFilteredWebhooks(result);
  }, [webhooks, filters]);

  const handleToggleWebhook = (webhook: Webhook, enabled: boolean) => {
    updateWebhook({
      ...webhook,
      enabled
    });
  };

  return (
    <div className="space-y-4">
      <WebhookFilterBar 
        onFilterChange={setFilters}
        tags={mockTags}
      />
      
      {filteredWebhooks.map((webhook) => (
        <WebhookCard 
          key={webhook.id}
          webhook={webhook}
          selectedWebhook={selectedWebhook}
          setSelectedWebhook={setSelectedWebhook}
          isTestMode={isTestMode}
          compact={compact}
          onToggle={(enabled) => handleToggleWebhook(webhook, enabled)}
          tags={mockTags}
        />
      ))}
      
      {filteredWebhooks.length === 0 && webhooks.length > 0 && (
        <Card className="p-8 bg-muted/30 border-dashed">
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No webhooks match your filters</h3>
            <p>Try adjusting your search criteria or clear filters</p>
          </div>
        </Card>
      )}
      
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
  onToggle: (enabled: boolean) => void;
  tags: WebhookTag[];
}

const WebhookCard: React.FC<WebhookCardProps> = ({ 
  webhook, 
  selectedWebhook, 
  setSelectedWebhook, 
  isTestMode,
  compact = false,
  onToggle,
  tags
}) => {
  const isSelected = selectedWebhook?.id === webhook.id;

  // Simulate webhook tags for display purposes
  const getRandomTags = () => {
    if (webhook.tags) return webhook.tags;
    
    // Simulate that this webhook has some tags
    const mockWebhookTags = [];
    if (webhook.id === 'webhook-1') {
      mockWebhookTags.push(tags[0], tags[3]);
    } else if (webhook.id === 'webhook-2') {
      mockWebhookTags.push(tags[2]);
    } else if (webhook.id === 'webhook-3') {
      mockWebhookTags.push(tags[1]);
    }
    
    return mockWebhookTags;
  };
  
  const webhookTags = getRandomTags();
  
  return (
    <Card 
      className={`${isSelected ? 'border-primary' : ''} transition-all hover:border-primary cursor-pointer group animate-in fade-in-50 duration-300`}
      onClick={() => setSelectedWebhook(webhook)}
    >
      <CardHeader className={`${compact ? 'py-3' : ''} flex flex-row items-start justify-between`}>
        <div className="flex items-start space-x-2">
          <WebhookMethodBadge method={webhook.method} />
          <div>
            <CardTitle className={`${compact ? 'text-base' : ''} flex items-center gap-2`}>
              {webhook.name}
              <ActivityIndicator 
                timestamp={webhook.lastExecutedAt} 
                status={webhook.lastExecutionStatus}
                showLabel={false}
                className="hidden group-hover:flex"
              />
            </CardTitle>
            <CardDescription className={`${compact ? 'text-xs' : ''} truncate max-w-xs md:max-w-md flex items-center gap-1`}>
              <span>{webhook.url}</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </CardDescription>
          </div>
        </div>
        <WebhookToggle 
          enabled={webhook.enabled} 
          onChange={onToggle}
          small={compact}
          showLabel={!compact}
        />
      </CardHeader>
      
      {(!compact || isSelected) && (
        <CardContent>
          {webhook.description && (
            <p className="text-sm text-muted-foreground mb-3">{webhook.description}</p>
          )}
          
          {webhookTags.length > 0 && (
            <div className="mb-3">
              <TagsManager 
                tags={tags}
                selectedTags={webhookTags.map(tag => tag.id)} 
                onTagsChange={() => {}}
                readOnly
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            <WebhookScheduleInfo schedule={webhook.schedule} />
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 
              Updated {format(new Date(webhook.updatedAt), 'MMM d, yyyy')}
            </span>
            <ActivityIndicator 
              timestamp={webhook.lastExecutedAt} 
              status={webhook.lastExecutionStatus}
            />
          </div>
          
          {isSelected && <WebhookActions webhook={webhook} isTestMode={isTestMode} />}
        </CardContent>
      )}
    </Card>
  );
};

export default WebhookTable;

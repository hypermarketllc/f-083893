import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, WebhookTag } from '@/types/webhook';
import { WebhookFilterBar } from './filters/WebhookFilterBar';
import { WebhookMethodBadge } from './WebhookMethodBadge';
import { WebhookScheduleInfo } from './WebhookScheduleInfo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Play, CheckCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { EmptyLogs } from './EmptyLogs';
import WebhookToggle from './WebhookToggle';
import ActivityIndicator from './ActivityIndicator';

interface WebhookTableProps {
  compact?: boolean;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({ compact }) => {
  const { 
    webhooks, 
    handleEditWebhook, 
    handleDeleteWebhook, 
    setSelectedWebhook,
    selectedWebhook,
    executeWebhook,
    setIsTestMode,
    updateWebhook
  } = useWebhookContext();
  
  const [filteredWebhooks, setFilteredWebhooks] = useState(webhooks);
  const [filters, setFilters] = useState({
    search: '',
    method: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    tags: []
  });

  // Mock tags for demo
  const mockTags: WebhookTag[] = [
    { id: 'tag-1', name: 'Production', color: '#69db7c' },
    { id: 'tag-2', name: 'Development', color: '#4dabf7' },
    { id: 'tag-3', name: 'Testing', color: '#ff922b' },
    { id: 'tag-4', name: 'Important', color: '#ff6b6b' },
  ];

  // Apply filters to webhooks
  React.useEffect(() => {
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
    
    if (filters.tags && filters.tags.length > 0) {
      // Simulate tag filtering
      result = result.filter(webhook => {
        // Get mock tags for this webhook
        const webhookTags = getWebhookTags(webhook);
        return filters.tags!.some(tagId => webhookTags.map(t => t.id).includes(tagId));
      });
    }
    
    setFilteredWebhooks(result);
  }, [webhooks, filters]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const handleRowClick = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsTestMode(true);
  };

  const handleToggleWebhook = (webhook: Webhook, enabled: boolean) => {
    updateWebhook({
      ...webhook,
      enabled
    });
  };

  const handleExecute = (e: React.SyntheticEvent, webhook: Webhook) => {
    e.stopPropagation();
    executeWebhook(webhook);
  };

  // Simulate webhook tags
  const getWebhookTags = (webhook: Webhook): WebhookTag[] => {
    if (webhook.tags) return webhook.tags;
    
    const mockWebhookTags = [];
    if (webhook.id === 'webhook-1') {
      mockWebhookTags.push(mockTags[0], mockTags[3]);
    } else if (webhook.id === 'webhook-2') {
      mockWebhookTags.push(mockTags[2]);
    } else if (webhook.id === 'webhook-3') {
      mockWebhookTags.push(mockTags[1]);
    }
    
    return mockWebhookTags;
  };

  if (webhooks.length === 0) {
    return (
      <EmptyLogs message="No webhooks found" />
    );
  }

  return (
    <div className="space-y-4">
      <WebhookFilterBar 
        onFilterChange={setFilters}
        tags={mockTags}
      />
      
      <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead className="hidden lg:table-cell">Schedule</TableHead>
              {!compact && <TableHead className="hidden lg:table-cell">Last Executed</TableHead>}
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWebhooks.map((webhook) => {
              const webhookTags = getWebhookTags(webhook);
              
              return (
                <TableRow 
                  key={webhook.id}
                  onClick={() => handleRowClick(webhook)}
                  className={`cursor-pointer transition-all duration-200 hover:bg-muted ${selectedWebhook?.id === webhook.id ? 'bg-muted/50' : ''}`}
                >
                  <TableCell className="font-medium">
                    {webhook.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <WebhookMethodBadge method={webhook.method} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <WebhookScheduleInfo webhook={webhook} />
                  </TableCell>
                  {!compact && (
                    <TableCell className="hidden lg:table-cell">
                      <ActivityIndicator 
                        timestamp={webhook.lastExecutedAt} 
                        status={webhook.lastExecutionStatus}
                      />
                    </TableCell>
                  )}
                  <TableCell className="hidden md:table-cell">
                    {webhookTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {webhookTags.slice(0, 2).map(tag => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs py-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full mr-1" 
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </Badge>
                        ))}
                        {webhookTags.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs py-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            +{webhookTags.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <WebhookToggle
                      enabled={webhook.enabled}
                      onChange={(enabled) => {
                        handleToggleWebhook(webhook, enabled);
                      }}
                      small
                      showLabel={false}
                      className="ml-2"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecute(e, webhook);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWebhook(webhook);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWebhook(webhook.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhook, WebhookTag, WebhookFilters } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Copy, CheckCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import WebhookEmptyState from './WebhookEmptyState';
import WebhookToggle from './WebhookToggle';
import ActivityIndicator from './ActivityIndicator';
import { WebhookFilterBar } from './filters/WebhookFilterBar';

interface IncomingWebhookTableProps {
  compact?: boolean;
}

export const IncomingWebhookTable: React.FC<IncomingWebhookTableProps> = ({ compact }) => {
  const { 
    incomingWebhooks, 
    handleEditIncomingWebhook, 
    handleDeleteIncomingWebhook,
    setSelectedIncomingWebhook,
    selectedIncomingWebhook,
    updateIncomingWebhook
  } = useWebhookContext();
  
  const [copied, setCopied] = React.useState<string | null>(null);
  const [filteredWebhooks, setFilteredWebhooks] = useState(incomingWebhooks);
  const [filters, setFilters] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    tags: []
  });

  const mockTags: WebhookTag[] = [
    { id: 'tag-1', name: 'Production', color: '#69db7c' },
    { id: 'tag-2', name: 'Development', color: '#4dabf7' },
    { id: 'tag-3', name: 'Testing', color: '#ff922b' },
    { id: 'tag-4', name: 'Important', color: '#ff6b6b' },
  ];

  React.useEffect(() => {
    let result = [...incomingWebhooks];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(webhook => 
        webhook.name.toLowerCase().includes(searchLower) || 
        webhook.description.toLowerCase().includes(searchLower) ||
        webhook.endpointPath.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(webhook => {
        const webhookTags = getWebhookTags(webhook);
        return filters.tags.some(tagId => webhookTags.map(t => t.id).includes(tagId));
      });
    }
    
    setFilteredWebhooks(result);
  }, [incomingWebhooks, filters]);

  const handleFilterChange = (newFilters: Partial<WebhookFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const baseUrl = window.location.origin;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const handleRowClick = (webhook: IncomingWebhook) => {
    setSelectedIncomingWebhook(webhook);
  };

  const copyToClipboard = (id: string, path: string) => {
    const fullUrl = `${baseUrl}/api/webhooks/${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(id);
    toast.success('Webhook URL copied to clipboard');
    
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  const handleToggleWebhook = (webhook: IncomingWebhook, enabled: boolean) => {
    updateIncomingWebhook({
      ...webhook,
      enabled
    });
  };

  const getWebhookTags = (webhook: IncomingWebhook): WebhookTag[] => {
    if (webhook.tags) return webhook.tags;
    
    const mockWebhookTags = [];
    if (webhook.id === 'incoming-webhook-1') {
      mockWebhookTags.push(mockTags[0], mockTags[3]);
    } else if (webhook.id === 'incoming-webhook-2') {
      mockWebhookTags.push(mockTags[2]);
    } else if (webhook.id === 'incoming-webhook-3') {
      mockWebhookTags.push(mockTags[1]);
    }
    
    return mockWebhookTags;
  };

  if (incomingWebhooks.length === 0) {
    return (
      <WebhookEmptyState message="No incoming webhooks found" />
    );
  }

  return (
    <div className="space-y-4">
      <WebhookFilterBar 
        onFilterChange={handleFilterChange}
        tags={mockTags}
        showMethodFilter={false}
        showStatusFilter={false}
        showDateFilter={false}
      />
    
      <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Endpoint URL</TableHead>
              {!compact && <TableHead className="hidden lg:table-cell">Last Called</TableHead>}
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
                  className={`cursor-pointer transition-all duration-200 hover:bg-muted ${selectedIncomingWebhook?.id === webhook.id ? 'bg-muted/50' : ''}`}
                >
                  <TableCell className="font-medium">
                    {webhook.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                        {baseUrl}/api/webhooks/{webhook.endpointPath}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 transition-all hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(webhook.id, webhook.endpointPath);
                        }}
                      >
                        {copied === webhook.id ? (
                          <CheckCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  {!compact && (
                    <TableCell className="hidden lg:table-cell">
                      <ActivityIndicator 
                        timestamp={webhook.lastCalledAt} 
                        status="success"
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
                          handleEditIncomingWebhook(webhook);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteIncomingWebhook(webhook.id);
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

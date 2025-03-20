
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, WebhookTag, WebhookFilters } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Play, Search, FilterX } from 'lucide-react';
import WebhookMethodBadge from './WebhookMethodBadge';
import WebhookToggle from './WebhookToggle';
import { EmptyLogs } from './EmptyLogs';

export const WebhookList: React.FC = () => {
  const { 
    webhooks, 
    handleEditWebhook, 
    handleDeleteWebhook, 
    setSelectedWebhook,
    selectedWebhook,
    executeWebhook,
    updateWebhook,
    isLoading
  } = useWebhookContext();
  
  const [filteredWebhooks, setFilteredWebhooks] = useState(webhooks);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = webhooks.filter(webhook => 
        webhook.name.toLowerCase().includes(lowerSearchTerm) || 
        webhook.description.toLowerCase().includes(lowerSearchTerm) ||
        webhook.url.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredWebhooks(filtered);
    } else {
      setFilteredWebhooks(webhooks);
    }
  }, [webhooks, searchTerm]);

  const handleRowClick = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <EmptyLogs message="No webhooks found" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSearchTerm('')}
          >
            <FilterX className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead className="hidden lg:table-cell">URL</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWebhooks.map((webhook) => (
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
                <TableCell className="hidden lg:table-cell truncate max-w-xs">
                  <span className="text-xs text-muted-foreground">
                    {webhook.url}
                  </span>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

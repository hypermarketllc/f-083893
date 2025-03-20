
import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { Webhook, WebhookTag } from '@/types/webhook2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WebhookMethodBadge } from './WebhookMethodBadge';
import { ActivityIndicator } from './ActivityIndicator';
import { WebhookToggle } from './WebhookToggle';
import { EmptyState } from './EmptyState';

interface Webhook2TableProps {
  compact?: boolean;
}

export const Webhook2Table: React.FC<Webhook2TableProps> = ({ compact }) => {
  const { 
    webhooks, 
    searchQuery, 
    setSearchQuery,
    handleEditWebhook,
    handleDeleteWebhook,
    updateWebhook,
    setSelectedWebhook,
    setIsWebhookModalOpen
  } = useWebhook2Context();

  const [filteredWebhooks, setFilteredWebhooks] = useState<Webhook[]>(webhooks);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWebhooks(webhooks);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = webhooks.filter(webhook => 
      webhook.name.toLowerCase().includes(query) ||
      webhook.description.toLowerCase().includes(query) ||
      webhook.url.toLowerCase().includes(query) ||
      webhook.method.toLowerCase().includes(query)
    );
    
    setFilteredWebhooks(filtered);
  }, [webhooks, searchQuery]);

  const handleRowClick = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
  };

  const handleToggleWebhook = (webhook: Webhook, enabled: boolean) => {
    updateWebhook({
      ...webhook,
      enabled
    });
  };

  const handleCreateWebhook = () => {
    setSelectedWebhook(null);
    setIsWebhookModalOpen(true);
  };

  if (webhooks.length === 0) {
    return (
      <EmptyState
        title="No webhooks found"
        message="Get started by creating your first webhook to integrate with external services."
        actionLabel="Create Webhook"
        onAction={handleCreateWebhook}
        showRefresh
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search webhooks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {filteredWebhooks.length === 0 ? (
        <EmptyState
          title="No matching webhooks"
          message="Try adjusting your search query to find what you're looking for."
          showRefresh
        />
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden md:table-cell">Last Executed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebhooks.map((webhook) => (
                <TableRow 
                  key={webhook.id} 
                  className="cursor-pointer"
                  onClick={() => handleRowClick(webhook)}
                >
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <WebhookMethodBadge method={webhook.method} size="sm" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                      {webhook.url}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ActivityIndicator 
                      timestamp={webhook.lastExecutedAt} 
                      status={webhook.lastExecutionStatus} 
                    />
                  </TableCell>
                  <TableCell>
                    <WebhookToggle
                      enabled={webhook.enabled}
                      onChange={(enabled) => {
                        // Stop the row click propagation
                        event?.stopPropagation();
                        handleToggleWebhook(webhook, enabled);
                      }}
                      showLabel={false}
                      small
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWebhook(webhook);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWebhook(webhook.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

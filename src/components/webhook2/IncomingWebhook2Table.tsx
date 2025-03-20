
import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { IncomingWebhook, WebhookTag } from '@/types/webhook2';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Copy, CheckCheck, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { WebhookToggle } from './WebhookToggle';
import { ActivityIndicator } from './ActivityIndicator';
import { EmptyState } from './EmptyState';

interface IncomingWebhook2TableProps {
  compact?: boolean;
}

export const IncomingWebhook2Table: React.FC<IncomingWebhook2TableProps> = ({ compact }) => {
  const { 
    incomingWebhooks, 
    handleEditIncomingWebhook, 
    handleDeleteIncomingWebhook,
    setSelectedIncomingWebhook,
    selectedIncomingWebhook,
    updateIncomingWebhook,
    searchQuery,
    setSearchQuery,
    setIsIncomingWebhookModalOpen
  } = useWebhook2Context();
  
  const [copied, setCopied] = useState<string | null>(null);
  const [filteredWebhooks, setFilteredWebhooks] = useState(incomingWebhooks);

  // Filter webhooks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWebhooks(incomingWebhooks);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = incomingWebhooks.filter(webhook => 
      webhook.name.toLowerCase().includes(query) ||
      webhook.description.toLowerCase().includes(query) ||
      webhook.endpointPath.toLowerCase().includes(query)
    );
    
    setFilteredWebhooks(filtered);
  }, [incomingWebhooks, searchQuery]);

  const baseUrl = window.location.origin;

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

  const handleCreateWebhook = () => {
    setSelectedIncomingWebhook(null);
    setIsIncomingWebhookModalOpen(true);
  };

  if (incomingWebhooks.length === 0) {
    return (
      <EmptyState
        title="No incoming webhooks found"
        message="Create your first incoming webhook to receive data from external services."
        actionLabel="Create Incoming Webhook"
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
        <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Endpoint URL</TableHead>
                {!compact && <TableHead className="hidden lg:table-cell">Last Called</TableHead>}
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebhooks.map((webhook) => (
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
                          handleDeleteIncomingWebhook(webhook);
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
      )}
    </div>
  );
};

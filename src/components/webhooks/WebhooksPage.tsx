
import React, { useState } from 'react';
import { WebhookList } from './WebhookList';
import { WebhookLogsTable } from './WebhookLogsTable';
import { WebhookModal } from './WebhookModal';
import { WebhookTestPanel } from './WebhookTestPanel';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, FilterX, Plus, Webhook, History } from 'lucide-react';

const WebhooksTabs: React.FC = () => {
  const { 
    searchQuery,
    setSearchQuery,
    selectedWebhook,
    setIsWebhookModalOpen,
    isTestMode
  } = useWebhookContext();
  
  const [activeTab, setActiveTab] = useState('webhooks');

  const handleCreateWebhook = () => {
    setIsWebhookModalOpen(true);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>

        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateWebhook} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="webhooks" className="flex-1">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex-1">
            <History className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-0 space-y-6">
          <WebhookList />
          
          {selectedWebhook && isTestMode && (
            <WebhookTestPanel webhook={selectedWebhook} />
          )}
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <WebhookLogsTable />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WebhookModal />
    </div>
  );
};

const WebhooksPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <WebhooksTabs />
    </div>
  );
};

export default WebhooksPage;

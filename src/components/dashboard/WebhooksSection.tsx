
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebhookProvider, useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookTable } from '@/components/webhooks/WebhookTable';
import { WebhookLogsTable } from '@/components/webhooks/WebhookLogsTable';
import { WebhookModal } from '@/components/webhooks/WebhookModal';
import { WebhookTestPanel } from '@/components/webhooks/WebhookTestPanel';
import { IncomingWebhookTable } from '@/components/webhooks/IncomingWebhookTable';
import { IncomingWebhookLogsTable } from '@/components/webhooks/IncomingWebhookLogsTable';
import { IncomingWebhookModal } from '@/components/webhooks/IncomingWebhookModal';
import { 
  Plus, 
  Search, 
  FilterX,
  Webhook,
  History,
  ExternalLink,
  Download
} from 'lucide-react';

const WebhooksTabs: React.FC = () => {
  const { 
    searchQuery,
    setSearchQuery,
    selectedWebhook,
    setIsWebhookModalOpen,
    isTestMode,
    setIsIncomingWebhookModalOpen
  } = useWebhookContext();
  
  const [activeTab, setActiveTab] = useState('webhooks');
  const [activeSubTab, setActiveSubTab] = useState('outgoing');

  const handleCreateWebhook = () => {
    setIsWebhookModalOpen(true);
  };
  
  const handleCreateIncomingWebhook = () => {
    setIsIncomingWebhookModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'outgoing' ? (
            <Button onClick={handleCreateWebhook}>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          ) : (
            <Button onClick={handleCreateIncomingWebhook}>
              <Plus className="h-4 w-4 mr-2" />
              Create Incoming Webhook
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="logs">
            <History className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="outgoing">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Outgoing
                </TabsTrigger>
                <TabsTrigger value="incoming">
                  <Download className="h-4 w-4 mr-2" />
                  Incoming
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="outgoing" className="space-y-4">
              <WebhookTable />
              
              {selectedWebhook && isTestMode && (
                <WebhookTestPanel webhook={selectedWebhook} />
              )}
            </TabsContent>

            <TabsContent value="incoming" className="space-y-4">
              <IncomingWebhookTable />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="logs">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="outgoing">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Outgoing
                </TabsTrigger>
                <TabsTrigger value="incoming">
                  <Download className="h-4 w-4 mr-2" />
                  Incoming
                </TabsTrigger>
              </TabsList>

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

            <TabsContent value="outgoing" className="space-y-4">
              <WebhookLogsTable />
            </TabsContent>

            <TabsContent value="incoming" className="space-y-4">
              <IncomingWebhookLogsTable />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WebhookModal />
      <IncomingWebhookModal />
    </div>
  );
};

const WebhooksSection: React.FC = () => {
  return (
    <WebhookProvider>
      <WebhooksTabs />
    </WebhookProvider>
  );
};

export default WebhooksSection;

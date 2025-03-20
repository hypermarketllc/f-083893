
import React, { useState } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCcw } from 'lucide-react';
import { Webhook, IncomingWebhook } from '@/types/webhook2';
import { Webhook2Modal } from './Webhook2Modal';
import { IncomingWebhook2Modal } from './IncomingWebhook2Modal';
import { Webhook2Table } from './Webhook2Table';
import { IncomingWebhook2Table } from './IncomingWebhook2Table';
import { Webhook2LogsTable } from './Webhook2LogsTable';
import { IncomingWebhook2LogsTable } from './IncomingWebhook2LogsTable';
import { Webhook2DetailView } from './Webhook2DetailView';

export const Webhook2Page: React.FC = () => {
  const {
    isLoading,
    setIsWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    selectedWebhook,
    setSelectedWebhook,
    refreshWebhooks,
    refreshWebhookLogs
  } = useWebhook2Context();

  const [activeTab, setActiveTab] = useState('outgoing');
  const [activeView, setActiveView] = useState<'webhooks' | 'logs'>('webhooks');

  const handleCreateWebhook = () => {
    setSelectedWebhook(null);
    setIsWebhookModalOpen(true);
  };

  const handleCreateIncomingWebhook = () => {
    setIsIncomingWebhookModalOpen(true);
  };

  const handleRefresh = () => {
    refreshWebhooks();
    refreshWebhookLogs();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin">
          <RefreshCcw className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Webhook2</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="hidden sm:flex"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {activeTab === 'outgoing' ? (
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

      {selectedWebhook ? (
        <div className="space-y-4">
          <Button
            variant="link"
            onClick={() => setSelectedWebhook(null)}
            className="p-0"
          >
            ← Back to webhooks
          </Button>
          <Webhook2DetailView
            webhook={selectedWebhook}
            onBack={() => setSelectedWebhook(null)}
          />
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="outgoing">Outgoing Webhooks</TabsTrigger>
              <TabsTrigger value="incoming">Incoming Webhooks</TabsTrigger>
            </TabsList>
            
            {activeTab === 'outgoing' && (
              <Tabs 
                value={activeView} 
                onValueChange={(value) => setActiveView(value as 'webhooks' | 'logs')}
                className="hidden sm:block"
              >
                <TabsList>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <TabsContent value="outgoing" className="space-y-4">
            {activeView === 'webhooks' ? (
              <Webhook2Table />
            ) : (
              <Webhook2LogsTable />
            )}
          </TabsContent>

          <TabsContent value="incoming" className="space-y-4">
            <Tabs defaultValue="webhooks" className="sm:hidden">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="webhooks">
                <IncomingWebhook2Table />
              </TabsContent>
              <TabsContent value="logs">
                <IncomingWebhook2LogsTable />
              </TabsContent>
            </Tabs>

            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Incoming Webhooks</h3>
                <IncomingWebhook2Table compact />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Incoming Webhook Logs</h3>
                <IncomingWebhook2LogsTable compact />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Webhook2Modal />
      <IncomingWebhook2Modal />
    </div>
  );
};

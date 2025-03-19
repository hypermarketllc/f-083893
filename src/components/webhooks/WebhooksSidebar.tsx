
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
  Download,
  X
} from 'lucide-react';

interface WebhooksSidebarProps {
  onClose: () => void;
  visible: boolean;
}

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
    <div className="h-full flex flex-col">
      <div className="border-b py-3 px-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Webhooks</h2>
        <div className="flex items-center space-x-2">
          {activeSubTab === 'outgoing' ? (
            <Button size="sm" onClick={handleCreateWebhook}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          ) : (
            <Button size="sm" onClick={handleCreateIncomingWebhook}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="webhooks">
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="logs">
              <History className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="space-y-4">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="outgoing">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Outgoing
                </TabsTrigger>
                <TabsTrigger value="incoming">
                  <Download className="h-4 w-4 mr-2" />
                  Incoming
                </TabsTrigger>
              </TabsList>

              <TabsContent value="outgoing" className="space-y-4 mt-4">
                <WebhookTable compact />
                
                {selectedWebhook && isTestMode && (
                  <WebhookTestPanel webhook={selectedWebhook} />
                )}
              </TabsContent>

              <TabsContent value="incoming" className="space-y-4 mt-4">
                <IncomingWebhookTable compact />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="logs">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
              <div className="flex flex-col space-y-3 mb-4">
                <TabsList className="w-full grid grid-cols-2">
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
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-8 w-full"
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
                      <FilterX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="outgoing" className="space-y-4">
                <WebhookLogsTable compact />
              </TabsContent>

              <TabsContent value="incoming" className="space-y-4">
                <IncomingWebhookLogsTable compact />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <WebhookModal />
      <IncomingWebhookModal />
    </div>
  );
};

const WebhooksSidebar: React.FC<WebhooksSidebarProps> = ({ onClose, visible }) => {
  return (
    <WebhookProvider>
      <div className="h-full flex flex-col">
        <div className="md:hidden absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <WebhooksTabs />
      </div>
    </WebhookProvider>
  );
};

export default WebhooksSidebar;

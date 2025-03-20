
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookList } from './WebhookList';
import { IncomingWebhookTable } from './IncomingWebhookTable';
import { WebhookLogsTable } from './WebhookLogsTable';
import { IncomingWebhookLogsTable } from './IncomingWebhookLogsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search, X } from 'lucide-react';

interface WebhooksSidebarProps {
  className?: string;
}

const WebhooksSidebar: React.FC<WebhooksSidebarProps> = ({ className }) => {
  const {
    setIsWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    searchQuery,
    setSearchQuery
  } = useWebhookContext();
  
  const [activeTab, setActiveTab] = useState('outgoing');
  const [activeSection, setActiveSection] = useState<'webhooks' | 'logs'>('webhooks');
  
  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'outgoing') {
                setIsWebhookModalOpen(true);
              } else {
                setIsIncomingWebhookModalOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            {activeTab === 'outgoing' ? 'New Webhook' : 'New Endpoint'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search webhooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {activeTab === 'outgoing' && (
            <>
              <div className="flex space-x-2">
                <Button
                  variant={activeSection === 'webhooks' ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveSection('webhooks')}
                >
                  Webhooks
                </Button>
                <Button
                  variant={activeSection === 'logs' ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveSection('logs')}
                >
                  Logs
                </Button>
              </div>
              
              {activeSection === 'webhooks' ? (
                <WebhookList />
              ) : (
                <WebhookLogsTable />
              )}
            </>
          )}
          
          <TabsContent value="incoming" className="space-y-4 mt-0">
            <div className="flex space-x-2">
              <Button
                variant={activeSection === 'webhooks' ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setActiveSection('webhooks')}
              >
                Endpoints
              </Button>
              <Button
                variant={activeSection === 'logs' ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setActiveSection('logs')}
              >
                Logs
              </Button>
            </div>
            
            {activeSection === 'webhooks' ? (
              <IncomingWebhookTable />
            ) : (
              <IncomingWebhookLogsTable />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WebhooksSidebar;

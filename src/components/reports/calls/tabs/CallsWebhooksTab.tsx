
import React, { useState } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookTable } from '@/components/webhooks/WebhookTable';
import { WebhookLogsTable } from '@/components/webhooks/WebhookLogsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter } from 'lucide-react';

interface CallsWebhooksTabProps {
  dateRange: { from: Date; to: Date };
  searchQuery?: string;
}

const CallsWebhooksTab: React.FC<CallsWebhooksTabProps> = ({ dateRange, searchQuery }) => {
  const { setIsWebhookModalOpen } = useWebhookContext();
  const [activeTab, setActiveTab] = useState('webhooks');

  const handleCreateWebhook = () => {
    setIsWebhookModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Call Webhooks</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button 
                size="sm" 
                onClick={handleCreateWebhook}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                New Webhook
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="webhooks">
              <WebhookTable />
            </TabsContent>

            <TabsContent value="logs">
              <WebhookLogsTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsWebhooksTab;

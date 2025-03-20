
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, HttpMethod, WebhookHeader, WebhookUrlParam, WebhookBody } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookGeneralTab } from './modal/WebhookGeneralTab';
import { WebhookHeadersTab } from './modal/WebhookHeadersTab';
import { WebhookParamsTab } from './modal/WebhookParamsTab';
import { WebhookBodyTab } from './modal/WebhookBodyTab';
import { v4 as uuidv4 } from 'uuid';

export const WebhookModal: React.FC = () => {
  const {
    selectedWebhook,
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    createWebhook,
    updateWebhook,
    setSelectedWebhook
  } = useWebhookContext();

  // State for form values
  const [webhookName, setWebhookName] = useState('');
  const [webhookDescription, setWebhookDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMethod, setWebhookMethod] = useState<HttpMethod>('GET');
  const [webhookHeaders, setWebhookHeaders] = useState<WebhookHeader[]>([]);
  const [webhookParams, setWebhookParams] = useState<WebhookUrlParam[]>([]);
  const [webhookBody, setWebhookBody] = useState<WebhookBody>({
    contentType: 'json',
    content: '{}'
  });
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookTags, setWebhookTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('general');

  // Update form values when the selected webhook changes
  useEffect(() => {
    if (selectedWebhook) {
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers);
      setWebhookParams(selectedWebhook.urlParams);
      setWebhookBody(selectedWebhook.body || { contentType: 'json', content: '{}' });
      setWebhookEnabled(selectedWebhook.enabled);
      setWebhookTags(selectedWebhook.tags?.map(tag => tag.id) || []);
    } else {
      resetForm();
    }
  }, [selectedWebhook]);

  const resetForm = () => {
    setWebhookName('');
    setWebhookDescription('');
    setWebhookUrl('https://');
    setWebhookMethod('GET');
    setWebhookHeaders([
      { id: uuidv4(), key: 'Content-Type', value: 'application/json', enabled: true }
    ]);
    setWebhookParams([]);
    setWebhookBody({ contentType: 'json', content: '{}' });
    setWebhookEnabled(false);
    setWebhookTags([]);
    setActiveTab('general');
  };

  const handleClose = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  const handleSubmit = () => {
    // Create the webhook data object
    const webhookData = {
      name: webhookName,
      description: webhookDescription,
      url: webhookUrl,
      method: webhookMethod,
      headers: webhookHeaders,
      urlParams: webhookParams,
      body: webhookBody,
      enabled: webhookEnabled,
      lastExecutedAt: null,
      lastExecutionStatus: null as 'success' | 'error' | null
    };

    // Update or create the webhook
    if (selectedWebhook) {
      updateWebhook({
        ...selectedWebhook,
        ...webhookData
      });
    } else {
      createWebhook(webhookData);
    }

    // Close the modal
    handleClose();
  };

  return (
    <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            Configure your webhook settings in the tabs below.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>
          <div className="py-4">
            <TabsContent value="general" className="mt-0">
              <WebhookGeneralTab
                webhookName={webhookName}
                setWebhookName={setWebhookName}
                webhookDescription={webhookDescription}
                setWebhookDescription={setWebhookDescription}
                webhookUrl={webhookUrl}
                setWebhookUrl={setWebhookUrl}
                webhookMethod={webhookMethod}
                setWebhookMethod={setWebhookMethod}
                webhookEnabled={webhookEnabled}
                setWebhookEnabled={setWebhookEnabled}
                webhookTags={webhookTags}
                setWebhookTags={setWebhookTags}
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-0">
              <WebhookHeadersTab
                webhookHeaders={webhookHeaders}
                setWebhookHeaders={setWebhookHeaders}
              />
            </TabsContent>
            <TabsContent value="params" className="mt-0">
              <WebhookParamsTab
                webhookParams={webhookParams}
                setWebhookParams={setWebhookParams}
              />
            </TabsContent>
            <TabsContent value="body" className="mt-0">
              <WebhookBodyTab
                webhookBody={webhookBody}
                setWebhookBody={setWebhookBody}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {selectedWebhook ? 'Update Webhook' : 'Create Webhook'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { WebhookBody, WebhookHeader, WebhookParam, HttpMethod } from '@/types/webhook2';
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
import { WebhookGeneralTab } from '@/components/webhooks/modal/WebhookGeneralTab';
import { Webhook2HeadersTab } from './modal/Webhook2HeadersTab';
import { Webhook2ParamsTab } from './modal/Webhook2ParamsTab';
import { Webhook2BodyTab } from './modal/Webhook2BodyTab';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Webhook2Modal: React.FC = () => {
  const {
    selectedWebhook,
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    createWebhook,
    updateWebhook,
    setSelectedWebhook,
    isCreating
  } = useWebhook2Context();

  const [activeTab, setActiveTab] = useState('general');
  const [webhookName, setWebhookName] = useState('');
  const [webhookDescription, setWebhookDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMethod, setWebhookMethod] = useState<HttpMethod>('GET');
  const [webhookHeaders, setWebhookHeaders] = useState<WebhookHeader[]>([]);
  const [webhookParams, setWebhookParams] = useState<WebhookParam[]>([]);
  const [webhookBody, setWebhookBody] = useState<WebhookBody>({
    contentType: 'json',
    content: ''
  });
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookTags, setWebhookTags] = useState<string[]>([]);

  useEffect(() => {
    if (selectedWebhook) {
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers || []);
      setWebhookParams(selectedWebhook.params || []);
      setWebhookBody(selectedWebhook.body || { contentType: 'json', content: '' });
      setWebhookEnabled(selectedWebhook.enabled);
      setWebhookTags(selectedWebhook.tags?.map(tag => tag.name) || []);
    } else {
      resetForm();
    }
  }, [selectedWebhook]);

  const resetForm = () => {
    setWebhookName('');
    setWebhookDescription('');
    setWebhookUrl('');
    setWebhookMethod('GET');
    setWebhookHeaders([]);
    setWebhookParams([]);
    setWebhookBody({
      contentType: 'json',
      content: ''
    });
    setWebhookEnabled(true);
    setWebhookTags([]);
    setActiveTab('general');
  };

  const handleClose = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  const handleSubmit = async () => {
    // Create webhook data object
    const webhookData = {
      name: webhookName,
      description: webhookDescription,
      url: webhookUrl,
      method: webhookMethod,
      headers: webhookHeaders,
      params: webhookParams,
      body: webhookBody,
      enabled: webhookEnabled,
      lastExecutedAt: null,
      lastExecutionStatus: null,
      tags: webhookTags.map(tagName => ({ 
        id: uuidv4(),
        name: tagName,
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Generate random color
      }))
    };

    if (selectedWebhook) {
      await updateWebhook({
        ...selectedWebhook,
        ...webhookData,
        tags: webhookData.tags
      });
    } else {
      await createWebhook(webhookData);
    }

    handleClose();
  };

  return (
    <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            {selectedWebhook 
              ? 'Update your webhook configuration' 
              : 'Configure a new webhook to send data to external services'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
            <TabsTrigger value="params" className="flex-1">Query Parameters</TabsTrigger>
            <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
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

          <TabsContent value="headers">
            <Webhook2HeadersTab
              headers={webhookHeaders}
              setHeaders={setWebhookHeaders}
            />
          </TabsContent>

          <TabsContent value="params">
            <Webhook2ParamsTab
              params={webhookParams}
              setParams={setWebhookParams}
            />
          </TabsContent>

          <TabsContent value="body">
            <Webhook2BodyTab
              body={webhookBody}
              setBody={setWebhookBody}
              method={webhookMethod}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {selectedWebhook ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              selectedWebhook ? 'Update Webhook' : 'Create Webhook'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

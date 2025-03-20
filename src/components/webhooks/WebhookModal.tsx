
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, WebhookBody, WebhookHeader, WebhookUrlParam, HttpMethod } from '@/types/webhook';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookGeneralTab } from './modal/WebhookGeneralTab';
import { WebhookHeadersTab } from './modal/WebhookHeadersTab';
import { WebhookParamsTab } from './modal/WebhookParamsTab';
import { WebhookBodyTab } from './modal/WebhookBodyTab';
import { v4 as uuidv4 } from 'uuid';

// Update the component interfaces to match the actual implementation
interface WebhookHeadersTabProps {
  headers: WebhookHeader[];
  onChange: (headers: WebhookHeader[]) => void;
}

interface WebhookParamsTabProps {
  params: WebhookUrlParam[];
  onChange: (params: WebhookUrlParam[]) => void;
}

interface WebhookBodyTabProps {
  body: WebhookBody;
  onChange: (body: WebhookBody) => void;
}

export const WebhookModal: React.FC = () => {
  const { 
    isWebhookModalOpen, 
    setIsWebhookModalOpen, 
    selectedWebhook, 
    setSelectedWebhook,
    createWebhook,
    updateWebhook
  } = useWebhookContext();

  const [activeTab, setActiveTab] = useState('general');
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
    setWebhookBody({ contentType: 'json', content: '{}' });
    setWebhookEnabled(true);
    setActiveTab('general');
  };

  const handleClose = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  const handleSubmit = () => {
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
      lastExecutionStatus: null
    };

    if (selectedWebhook) {
      updateWebhook({
        ...selectedWebhook,
        ...webhookData
      });
    } else {
      createWebhook(webhookData);
    }

    handleClose();
  };

  return (
    <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            Configure your webhook to send data to external APIs
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <WebhookGeneralTab
              name={webhookName}
              description={webhookDescription}
              url={webhookUrl}
              method={webhookMethod}
              enabled={webhookEnabled}
              onNameChange={setWebhookName}
              onDescriptionChange={setWebhookDescription}
              onUrlChange={setWebhookUrl}
              onMethodChange={setWebhookMethod}
              onEnabledChange={setWebhookEnabled}
            />
          </TabsContent>

          <TabsContent value="headers">
            <WebhookHeadersTab
              headers={webhookHeaders}
              onChange={setWebhookHeaders}
            />
          </TabsContent>

          <TabsContent value="params">
            <WebhookParamsTab
              params={webhookParams}
              onChange={setWebhookParams}
            />
          </TabsContent>

          <TabsContent value="body">
            <WebhookBodyTab
              body={webhookBody}
              onChange={setWebhookBody}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button">
            {selectedWebhook ? 'Update' : 'Create'} Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

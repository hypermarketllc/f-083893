
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { HttpMethod, WebhookHeader, WebhookUrlParam } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { WebhookGeneralTab } from './modal/WebhookGeneralTab';
import { WebhookHeadersTab } from './modal/WebhookHeadersTab';
import { WebhookParamsTab } from './modal/WebhookParamsTab';
import { WebhookBodyTab } from './modal/WebhookBodyTab';

export const WebhookModal: React.FC = () => {
  const {
    selectedWebhook,
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    createWebhook,
    updateWebhook,
    setSelectedWebhook
  } = useWebhookContext();

  const [webhookName, setWebhookName] = useState('');
  const [webhookDescription, setWebhookDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMethod, setWebhookMethod] = useState<HttpMethod>('GET');
  const [webhookHeaders, setWebhookHeaders] = useState<WebhookHeader[]>([]);
  const [webhookUrlParams, setWebhookUrlParams] = useState<WebhookUrlParam[]>([]);
  const [webhookBody, setWebhookBody] = useState<string>('');
  const [webhookContentType, setWebhookContentType] = useState<'json' | 'form' | 'text'>('json');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (selectedWebhook) {
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers);
      setWebhookUrlParams(selectedWebhook.urlParams);
      setWebhookContentType(selectedWebhook.body?.contentType || 'json');
      setWebhookBody(selectedWebhook.body?.content || '');
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
    setWebhookUrlParams([]);
    setWebhookContentType('json');
    setWebhookBody('');
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
      urlParams: webhookUrlParams,
      body: webhookBody ? {
        contentType: webhookContentType,
        content: webhookBody
      } : undefined,
      enabled: webhookEnabled
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

  const addHeader = () => {
    setWebhookHeaders([
      ...webhookHeaders,
      { id: crypto.randomUUID(), key: '', value: '', enabled: true }
    ]);
  };

  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookHeaders(webhookHeaders.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeHeader = (id: string) => {
    setWebhookHeaders(webhookHeaders.filter(header => header.id !== id));
  };

  const addUrlParam = () => {
    setWebhookUrlParams([
      ...webhookUrlParams,
      { id: crypto.randomUUID(), key: '', value: '', enabled: true }
    ]);
  };

  const updateUrlParam = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookUrlParams(webhookUrlParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeUrlParam = (id: string) => {
    setWebhookUrlParams(webhookUrlParams.filter(param => param.id !== id));
  };

  return (
    <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            Configure your webhook to interact with external APIs
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="params">Parameters</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
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
              />
            </TabsContent>

            <TabsContent value="headers">
              <WebhookHeadersTab 
                webhookHeaders={webhookHeaders}
                addHeader={addHeader}
                updateHeader={updateHeader}
                removeHeader={removeHeader}
              />
            </TabsContent>

            <TabsContent value="params">
              <WebhookParamsTab 
                webhookUrlParams={webhookUrlParams}
                addUrlParam={addUrlParam}
                updateUrlParam={updateUrlParam}
                removeUrlParam={removeUrlParam}
              />
            </TabsContent>

            <TabsContent value="body">
              <WebhookBodyTab 
                webhookBody={webhookBody}
                setWebhookBody={setWebhookBody}
                webhookContentType={webhookContentType}
                setWebhookContentType={setWebhookContentType}
              />
            </TabsContent>
          </Tabs>
        </div>

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

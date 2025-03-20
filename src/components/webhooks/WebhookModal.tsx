
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
  const [webhookBodyContent, setWebhookBodyContent] = useState('{}');
  const [webhookContentType, setWebhookContentType] = useState<'json' | 'form' | 'text'>('json');

  useEffect(() => {
    if (selectedWebhook) {
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers);
      setWebhookParams(selectedWebhook.urlParams);
      if (selectedWebhook.body) {
        setWebhookContentType(selectedWebhook.body.contentType);
        setWebhookBodyContent(selectedWebhook.body.content);
      }
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
    setWebhookBodyContent('{}');
    setWebhookContentType('json');
    setWebhookEnabled(true);
    setActiveTab('general');
  };

  const handleClose = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  // Functions for header management
  const addHeader = () => {
    const newHeader = {
      id: uuidv4(),
      key: '',
      value: '',
      enabled: true
    };
    setWebhookHeaders([...webhookHeaders, newHeader]);
  };

  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookHeaders(webhookHeaders.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeHeader = (id: string) => {
    setWebhookHeaders(webhookHeaders.filter(header => header.id !== id));
  };

  // Functions for URL parameter management
  const addUrlParam = () => {
    const newParam = {
      id: uuidv4(),
      key: '',
      value: '',
      enabled: true
    };
    setWebhookParams([...webhookParams, newParam]);
  };

  const updateUrlParam = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookParams(webhookParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeUrlParam = (id: string) => {
    setWebhookParams(webhookParams.filter(param => param.id !== id));
  };

  const handleSubmit = () => {
    const webhookData = {
      name: webhookName,
      description: webhookDescription,
      url: webhookUrl,
      method: webhookMethod,
      headers: webhookHeaders,
      urlParams: webhookParams,
      body: {
        contentType: webhookContentType,
        content: webhookBodyContent
      },
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
              webhookUrlParams={webhookParams}
              addUrlParam={addUrlParam}
              updateUrlParam={updateUrlParam}
              removeUrlParam={removeUrlParam}
            />
          </TabsContent>

          <TabsContent value="body">
            <WebhookBodyTab
              webhookBody={webhookBodyContent}
              setWebhookBody={setWebhookBodyContent}
              webhookContentType={webhookContentType}
              setWebhookContentType={setWebhookContentType}
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

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WebhookGeneralTab } from './modal/WebhookGeneralTab';
import { WebhookHeadersTab } from './modal/WebhookHeadersTab';
import { WebhookParamsTab } from './modal/WebhookParamsTab';
import { WebhookBodyTab } from './modal/WebhookBodyTab';
import { toast } from 'sonner';

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
      setHasChanges(false);
    } else {
      resetForm();
    }
  }, [selectedWebhook]);

  useEffect(() => {
    if (!selectedWebhook) {
      setHasChanges(
        webhookName !== '' || 
        webhookDescription !== '' || 
        webhookUrl !== '' || 
        webhookBody !== '' ||
        webhookHeaders.length > 0 ||
        webhookUrlParams.length > 0
      );
      return;
    }
    
    setHasChanges(
      webhookName !== selectedWebhook.name ||
      webhookDescription !== selectedWebhook.description ||
      webhookUrl !== selectedWebhook.url ||
      webhookMethod !== selectedWebhook.method ||
      webhookEnabled !== selectedWebhook.enabled ||
      JSON.stringify(webhookHeaders) !== JSON.stringify(selectedWebhook.headers) ||
      JSON.stringify(webhookUrlParams) !== JSON.stringify(selectedWebhook.urlParams) ||
      webhookContentType !== (selectedWebhook.body?.contentType || 'json') ||
      webhookBody !== (selectedWebhook.body?.content || '')
    );
  }, [
    webhookName, 
    webhookDescription, 
    webhookUrl, 
    webhookMethod, 
    webhookHeaders, 
    webhookUrlParams, 
    webhookBody, 
    webhookContentType, 
    webhookEnabled,
    selectedWebhook
  ]);

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
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      setConfirmClose(true);
    } else {
      closeModal();
    }
  };
  
  const closeModal = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  const handleSubmit = () => {
    try {
      setIsSubmitting(true);
      
      if (!webhookName.trim()) {
        toast.error('Webhook name is required');
        setActiveTab('general');
        setIsSubmitting(false);
        return;
      }
      
      if (!webhookUrl.trim()) {
        toast.error('Webhook URL is required');
        setActiveTab('general');
        setIsSubmitting(false);
        return;
      }
      
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

      setIsSubmitting(false);
      closeModal();
    } catch (error) {
      console.error('Error submitting webhook:', error);
      toast.error(`Failed to save webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
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
    <>
      <Dialog open={isWebhookModalOpen} onOpenChange={(open) => !open && handleClose()}>
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
            <Button onClick={handleSubmit} type="button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (selectedWebhook ? 'Update' : 'Create')} Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={closeModal}>Discard changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

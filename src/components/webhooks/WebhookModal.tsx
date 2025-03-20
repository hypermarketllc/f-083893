
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, WebhookBody, WebhookHeader, WebhookParam, HttpMethod } from '@/types/webhook';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WebhookToggle from './WebhookToggle';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

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
  const [webhookParams, setWebhookParams] = useState<WebhookParam[]>([]);
  const [webhookBodyContent, setWebhookBodyContent] = useState('{}');
  const [webhookContentType, setWebhookContentType] = useState<'json' | 'form' | 'text'>('json');
  const [webhookEnabled, setWebhookEnabled] = useState(true);

  useEffect(() => {
    if (selectedWebhook) {
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers);
      setWebhookParams(selectedWebhook.params);
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

  const updateHeader = (id: string, field: keyof WebhookHeader, value: string | boolean) => {
    setWebhookHeaders(webhookHeaders.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeHeader = (id: string) => {
    setWebhookHeaders(webhookHeaders.filter(header => header.id !== id));
  };

  // Functions for URL parameter management
  const addParam = () => {
    const newParam = {
      id: uuidv4(),
      key: '',
      value: '',
      enabled: true
    };
    setWebhookParams([...webhookParams, newParam]);
  };

  const updateParam = (id: string, field: keyof WebhookParam, value: string | boolean) => {
    setWebhookParams(webhookParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParam = (id: string) => {
    setWebhookParams(webhookParams.filter(param => param.id !== id));
  };

  const handleSubmit = () => {
    const webhookData = {
      name: webhookName,
      description: webhookDescription,
      url: webhookUrl,
      method: webhookMethod,
      headers: webhookHeaders,
      params: webhookParams,
      body: {
        contentType: webhookContentType,
        content: webhookBodyContent
      },
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="params">Params</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  value={webhookName}
                  onChange={(e) => setWebhookName(e.target.value)}
                  placeholder="Enter webhook name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-description">Description</Label>
                <Textarea
                  id="webhook-description"
                  value={webhookDescription}
                  onChange={(e) => setWebhookDescription(e.target.value)}
                  placeholder="Enter webhook description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="webhook-method">Method</Label>
                  <Select
                    value={webhookMethod}
                    onValueChange={(value) => setWebhookMethod(value as HttpMethod)}
                  >
                    <SelectTrigger id="webhook-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="webhook-url">URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/api/endpoint"
                  />
                </div>
              </div>

              {webhookMethod !== 'GET' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="webhook-body">Request Body</Label>
                    <Select
                      value={webhookContentType}
                      onValueChange={(value) => setWebhookContentType(value as 'json' | 'form' | 'text')}
                    >
                      <SelectTrigger id="content-type" className="w-[180px]">
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">application/json</SelectItem>
                        <SelectItem value="form">x-www-form-urlencoded</SelectItem>
                        <SelectItem value="text">text/plain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    id="webhook-body"
                    value={webhookBodyContent}
                    onChange={(e) => setWebhookBodyContent(e.target.value)}
                    placeholder={webhookContentType === 'json' ? '{\n  "key": "value"\n}' : 'key=value&foo=bar'}
                    className="font-mono text-sm"
                    rows={5}
                  />
                </div>
              )}

              <div className="pt-2 flex items-center space-x-2">
                <WebhookToggle 
                  enabled={webhookEnabled}
                  onChange={setWebhookEnabled}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Request Headers</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addHeader}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Header
                </Button>
              </div>

              {webhookHeaders.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No headers added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {webhookHeaders.map((header) => (
                    <div key={header.id} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Header name"
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Header value"
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={header.enabled}
                          onCheckedChange={(checked) => updateHeader(header.id, 'enabled', checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeader(header.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="params">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">URL Parameters</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addParam}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>

              {webhookParams.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No parameters added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {webhookParams.map((param) => (
                    <div key={param.id} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Parameter name"
                          value={param.key}
                          onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Parameter value"
                          value={param.value}
                          onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={param.enabled}
                          onCheckedChange={(checked) => updateParam(param.id, 'enabled', checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParam(param.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

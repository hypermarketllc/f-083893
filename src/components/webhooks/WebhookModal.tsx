
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook, HttpMethod, WebhookHeader, WebhookUrlParam } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Code, Calendar } from 'lucide-react';

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

            <TabsContent value="general" className="space-y-4 mt-4">
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

              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="Enter webhook URL"
                />
              </div>

              <div className="space-y-2">
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

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="webhook-enabled"
                  checked={webhookEnabled}
                  onCheckedChange={setWebhookEnabled}
                />
                <Label htmlFor="webhook-enabled">Enabled</Label>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Headers</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addHeader}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Header
                  </Button>
                </div>

                {webhookHeaders.length > 0 ? (
                  <div className="space-y-2">
                    {webhookHeaders.map((header) => (
                      <div key={header.id} className="flex items-center space-x-2">
                        <Switch
                          id={`header-enabled-${header.id}`}
                          checked={header.enabled}
                          onCheckedChange={(checked) => updateHeader(header.id, 'enabled', checked)}
                        />
                        <Input
                          placeholder="Key"
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                          className="w-1/3"
                        />
                        <Input
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeHeader(header.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No headers defined yet. Click the button above to add one.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="params" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">URL Parameters</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addUrlParam}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>

                {webhookUrlParams.length > 0 ? (
                  <div className="space-y-2">
                    {webhookUrlParams.map((param) => (
                      <div key={param.id} className="flex items-center space-x-2">
                        <Switch
                          id={`param-enabled-${param.id}`}
                          checked={param.enabled}
                          onCheckedChange={(checked) => updateUrlParam(param.id, 'enabled', checked)}
                        />
                        <Input
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) => updateUrlParam(param.id, 'key', e.target.value)}
                          className="w-1/3"
                        />
                        <Input
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) => updateUrlParam(param.id, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeUrlParam(param.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No parameters defined yet. Click the button above to add one.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="body" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-content-type">Content Type</Label>
                  <Select
                    value={webhookContentType}
                    onValueChange={(value) => setWebhookContentType(value as 'json' | 'form' | 'text')}
                  >
                    <SelectTrigger id="webhook-content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">application/json</SelectItem>
                      <SelectItem value="form">application/x-www-form-urlencoded</SelectItem>
                      <SelectItem value="text">text/plain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="webhook-body">Body</Label>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Textarea
                    id="webhook-body"
                    value={webhookBody}
                    onChange={(e) => setWebhookBody(e.target.value)}
                    placeholder={
                      webhookContentType === 'json'
                        ? '{\n  "key": "value"\n}'
                        : webhookContentType === 'form'
                        ? 'key1=value1&key2=value2'
                        : 'Enter plain text body'
                    }
                    className="font-mono text-sm min-h-[200px]"
                  />
                </div>
              </div>
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

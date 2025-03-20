
import React, { useState, useEffect } from 'react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';
import { Webhook, WebhookBody, WebhookHeader, WebhookParam, HttpMethod } from '@/types/webhook2';
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
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebhookToggle } from './WebhookToggle';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

export const Webhook2Modal: React.FC = () => {
  const {
    selectedWebhook,
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    createWebhook,
    updateWebhook,
    setSelectedWebhook
  } = useWebhook2Context();

  // Form state
  const [webhookName, setWebhookName] = useState('');
  const [webhookDescription, setWebhookDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookMethod, setWebhookMethod] = useState<HttpMethod>('GET');
  const [webhookHeaders, setWebhookHeaders] = useState<WebhookHeader[]>([]);
  const [webhookParams, setWebhookParams] = useState<WebhookParam[]>([]);
  const [webhookContentType, setWebhookContentType] = useState<'json' | 'form' | 'text'>('json');
  const [webhookBodyContent, setWebhookBodyContent] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (selectedWebhook) {
      // Populate form with selected webhook data
      setWebhookName(selectedWebhook.name);
      setWebhookDescription(selectedWebhook.description);
      setWebhookUrl(selectedWebhook.url);
      setWebhookMethod(selectedWebhook.method);
      setWebhookHeaders(selectedWebhook.headers);
      setWebhookParams(selectedWebhook.params);
      setWebhookEnabled(selectedWebhook.enabled);
      
      if (selectedWebhook.body) {
        setWebhookContentType(selectedWebhook.body.contentType);
        setWebhookBodyContent(selectedWebhook.body.content);
      } else {
        setWebhookContentType('json');
        setWebhookBodyContent('');
      }
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
    setWebhookContentType('json');
    setWebhookBodyContent('');
    setWebhookEnabled(true);
    setActiveTab('general');
  };

  const handleAddHeader = () => {
    setWebhookHeaders(prev => [
      ...prev,
      { id: uuidv4(), key: '', value: '', enabled: true }
    ]);
  };

  const handleUpdateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookHeaders(prev => 
      prev.map(header => 
        header.id === id 
          ? { ...header, [field]: value } 
          : header
      )
    );
  };

  const handleRemoveHeader = (id: string) => {
    setWebhookHeaders(prev => prev.filter(header => header.id !== id));
  };

  const handleAddParam = () => {
    setWebhookParams(prev => [
      ...prev,
      { id: uuidv4(), key: '', value: '', enabled: true }
    ]);
  };

  const handleUpdateParam = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setWebhookParams(prev => 
      prev.map(param => 
        param.id === id 
          ? { ...param, [field]: value } 
          : param
      )
    );
  };

  const handleRemoveParam = (id: string) => {
    setWebhookParams(prev => prev.filter(param => param.id !== id));
  };

  const handleClose = () => {
    setIsWebhookModalOpen(false);
    setSelectedWebhook(null);
    resetForm();
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!webhookName.trim()) {
      alert('Webhook name is required');
      return;
    }
    
    if (!webhookUrl.trim()) {
      alert('Webhook URL is required');
      return;
    }
    
    // Prepare body data if needed
    let body: WebhookBody | undefined;
    if (webhookMethod !== 'GET' && webhookBodyContent.trim()) {
      body = {
        contentType: webhookContentType,
        content: webhookBodyContent
      };
    }
    
    const webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'> = {
      name: webhookName,
      description: webhookDescription,
      url: webhookUrl,
      method: webhookMethod,
      headers: webhookHeaders,
      params: webhookParams,
      body,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </DialogTitle>
          <DialogDescription>
            {selectedWebhook 
              ? 'Update your webhook settings' 
              : 'Configure a new webhook to send data to external services'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="params">Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Webhook Name *</Label>
              <Input
                id="name"
                value={webhookName}
                onChange={(e) => setWebhookName(e.target.value)}
                placeholder="Enter webhook name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={webhookDescription}
                onChange={(e) => setWebhookDescription(e.target.value)}
                placeholder="Enter webhook description"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://example.com/api/webhook"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select
                value={webhookMethod}
                onValueChange={(value) => setWebhookMethod(value as HttpMethod)}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {webhookMethod !== 'GET' && (
              <div className="space-y-2">
                <Label>Body</Label>
                <Select
                  value={webhookContentType}
                  onValueChange={(value) => setWebhookContentType(value as 'json' | 'form' | 'text')}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form">Form-URL-Encoded</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
                
                <Textarea
                  value={webhookBodyContent}
                  onChange={(e) => setWebhookBodyContent(e.target.value)}
                  placeholder={webhookContentType === 'json' ? '{"key": "value"}' : webhookContentType === 'form' ? 'key=value&key2=value2' : 'Plain text body'}
                  className="font-mono text-sm"
                  rows={5}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2">
              <WebhookToggle
                enabled={webhookEnabled}
                onChange={setWebhookEnabled}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="headers" className="py-4">
            <div className="space-y-4">
              {webhookHeaders.map((header, index) => (
                <div key={header.id} className="flex items-start space-x-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={header.key}
                      onChange={(e) => handleUpdateHeader(header.id, 'key', e.target.value)}
                      placeholder="Header Name"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={header.value}
                      onChange={(e) => handleUpdateHeader(header.id, 'value', e.target.value)}
                      placeholder="Header Value"
                    />
                  </div>
                  <div className="pt-2">
                    <WebhookToggle
                      enabled={header.enabled}
                      onChange={(enabled) => handleUpdateHeader(header.id, 'enabled', enabled)}
                      showLabel={false}
                      small
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveHeader(header.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddHeader}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Header
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="params" className="py-4">
            <div className="space-y-4">
              {webhookParams.map((param, index) => (
                <div key={param.id} className="flex items-start space-x-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={param.key}
                      onChange={(e) => handleUpdateParam(param.id, 'key', e.target.value)}
                      placeholder="Parameter Name"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={param.value}
                      onChange={(e) => handleUpdateParam(param.id, 'value', e.target.value)}
                      placeholder="Parameter Value"
                    />
                  </div>
                  <div className="pt-2">
                    <WebhookToggle
                      enabled={param.enabled}
                      onChange={(enabled) => handleUpdateParam(param.id, 'enabled', enabled)}
                      showLabel={false}
                      small
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveParam(param.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddParam}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
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


import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhook } from '@/types/webhook';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const IncomingWebhookModal: React.FC = () => {
  const {
    selectedIncomingWebhook,
    isIncomingWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    createIncomingWebhook,
    updateIncomingWebhook,
    setSelectedIncomingWebhook
  } = useWebhookContext();

  const [webhookName, setWebhookName] = useState('');
  const [webhookDescription, setWebhookDescription] = useState('');
  const [webhookEndpoint, setWebhookEndpoint] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);

  useEffect(() => {
    if (selectedIncomingWebhook) {
      setWebhookName(selectedIncomingWebhook.name);
      setWebhookDescription(selectedIncomingWebhook.description);
      setWebhookEndpoint(selectedIncomingWebhook.endpointPath);
      setWebhookEnabled(selectedIncomingWebhook.enabled);
    } else {
      resetForm();
    }
  }, [selectedIncomingWebhook]);

  const resetForm = () => {
    setWebhookName('');
    setWebhookDescription('');
    setWebhookEndpoint('');
    setWebhookEnabled(true);
  };

  const handleClose = () => {
    setIsIncomingWebhookModalOpen(false);
    setSelectedIncomingWebhook(null);
    resetForm();
  };

  const handleSubmit = () => {
    const webhookData = {
      name: webhookName,
      description: webhookDescription,
      endpointPath: webhookEndpoint.startsWith('/') ? webhookEndpoint : `/${webhookEndpoint}`,
      enabled: webhookEnabled
    };

    if (selectedIncomingWebhook) {
      updateIncomingWebhook({
        ...selectedIncomingWebhook,
        ...webhookData
      });
    } else {
      createIncomingWebhook(webhookData);
    }

    handleClose();
  };

  return (
    <Dialog open={isIncomingWebhookModalOpen} onOpenChange={setIsIncomingWebhookModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedIncomingWebhook ? 'Edit Incoming Webhook' : 'Create Incoming Webhook'}
          </DialogTitle>
          <DialogDescription>
            Configure a webhook endpoint to receive data from external services
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
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
            <Label htmlFor="webhook-endpoint">Endpoint Path</Label>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-1">/api</span>
              <Input
                id="webhook-endpoint"
                value={webhookEndpoint}
                onChange={(e) => setWebhookEndpoint(e.target.value)}
                placeholder="/webhook/my-service"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This path will be appended to your app's base URL to create the full webhook URL
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="webhook-enabled"
              checked={webhookEnabled}
              onCheckedChange={setWebhookEnabled}
            />
            <Label htmlFor="webhook-enabled">Enabled</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button">
            {selectedIncomingWebhook ? 'Update' : 'Create'} Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

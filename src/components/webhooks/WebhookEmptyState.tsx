
import React from 'react';
import { AlertCircle } from 'lucide-react';

const WebhookEmptyState: React.FC = () => (
  <div className="text-center p-8 border rounded-lg">
    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
    <h3 className="text-lg font-medium">No webhooks found</h3>
    <p className="text-muted-foreground mt-1">Create a new webhook to get started</p>
  </div>
);

export default WebhookEmptyState;


import React from 'react';
import { WebhookProvider } from '@/contexts/webhook/WebhookContext';
import WebhooksPage from '../webhooks/WebhooksPage';

const WebhooksSection: React.FC = () => {
  return (
    <WebhookProvider>
      <div className="animate-in fade-in duration-300">
        <WebhooksPage />
      </div>
    </WebhookProvider>
  );
};

export default WebhooksSection;

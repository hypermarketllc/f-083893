
import { useState } from 'react';
import { Webhook, IncomingWebhook } from '@/types/webhook';

export const useWebhookUIState = () => {
  // State for modals
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  
  // Selected webhooks
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  
  // Editing webhooks
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [editingIncomingWebhook, setEditingIncomingWebhook] = useState<IncomingWebhook | null>(null);
  
  // Test mode
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  return {
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    isIncomingWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    selectedWebhook,
    setSelectedWebhook,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    editingWebhook,
    setEditingWebhook,
    editingIncomingWebhook,
    setEditingIncomingWebhook,
    isTestMode,
    setIsTestMode,
    testResponse,
    setTestResponse,
    isTestLoading,
    setIsTestLoading,
    searchQuery,
    setSearchQuery
  };
};


import { useState, useEffect } from 'react';
import { Webhook, IncomingWebhook } from '@/types/webhook';

export const useWebhookUIState = () => {
  // Modal states
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  
  // Selection states
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  
  // Editing states
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [editingIncomingWebhook, setEditingIncomingWebhook] = useState<IncomingWebhook | null>(null);
  
  // Test mode states
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get selected webhook from localStorage on initial load
  useEffect(() => {
    try {
      const savedWebhook = localStorage.getItem('selectedWebhook');
      const savedIncomingWebhook = localStorage.getItem('selectedIncomingWebhook');
      
      if (savedWebhook) {
        setSelectedWebhook(JSON.parse(savedWebhook));
      }
      
      if (savedIncomingWebhook) {
        setSelectedIncomingWebhook(JSON.parse(savedIncomingWebhook));
      }
    } catch (error) {
      console.error('Error loading saved webhooks:', error);
    }
  }, []);
  
  // Save selected webhook to localStorage when it changes
  useEffect(() => {
    try {
      if (selectedWebhook) {
        localStorage.setItem('selectedWebhook', JSON.stringify(selectedWebhook));
      } else {
        localStorage.removeItem('selectedWebhook');
      }
    } catch (error) {
      console.error('Error saving selected webhook:', error);
    }
  }, [selectedWebhook]);
  
  // Save selected incoming webhook to localStorage when it changes
  useEffect(() => {
    try {
      if (selectedIncomingWebhook) {
        localStorage.setItem('selectedIncomingWebhook', JSON.stringify(selectedIncomingWebhook));
      } else {
        localStorage.removeItem('selectedIncomingWebhook');
      }
    } catch (error) {
      console.error('Error saving selected incoming webhook:', error);
    }
  }, [selectedIncomingWebhook]);

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

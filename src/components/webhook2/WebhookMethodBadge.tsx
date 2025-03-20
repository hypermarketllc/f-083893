
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HttpMethod } from '@/types/webhook2';

interface WebhookMethodBadgeProps {
  method: HttpMethod;
  size?: 'sm' | 'md' | 'lg';
}

export const WebhookMethodBadge: React.FC<WebhookMethodBadgeProps> = ({ 
  method, 
  size = 'md' 
}) => {
  const getVariant = (): "default" | "destructive" | "outline" | "secondary" => {
    switch (method) {
      case 'GET':
        return 'secondary';
      case 'POST':
        return 'default';
      case 'PUT':
        return 'outline';
      case 'DELETE':
        return 'destructive';
      case 'PATCH':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTextColor = (): string => {
    switch (method) {
      case 'GET':
        return 'text-blue-700 dark:text-blue-400';
      case 'POST':
        return '';
      case 'PUT':
        return 'text-orange-700 dark:text-orange-400';
      case 'DELETE':
        return '';
      case 'PATCH':
        return 'text-purple-700 dark:text-purple-400';
      default:
        return '';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0 px-1.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant={getVariant()}
      className={`${getSizeClasses()} ${getTextColor()} font-mono`}
    >
      {method}
    </Badge>
  );
};

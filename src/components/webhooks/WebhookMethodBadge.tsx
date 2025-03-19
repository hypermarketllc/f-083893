
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WebhookMethodBadgeProps {
  method: string;
}

const WebhookMethodBadge: React.FC<WebhookMethodBadgeProps> = ({ method }) => {
  const methodStyles = {
    GET: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    POST: "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    PUT: "bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    DELETE: "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    PATCH: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  };

  const upperMethod = method.toUpperCase();
  const className = methodStyles[upperMethod as keyof typeof methodStyles] || "";

  return (
    <Badge variant="outline" className={`font-mono text-xs py-0.5 ${className}`}>
      {upperMethod}
    </Badge>
  );
};

export default WebhookMethodBadge;

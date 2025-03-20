
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WebhookToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  showLabel?: boolean;
  className?: string;
  small?: boolean;
}

export const WebhookToggle: React.FC<WebhookToggleProps> = ({
  enabled,
  onChange,
  showLabel = true,
  className = '',
  small = false
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="webhook-enabled"
        checked={enabled}
        onCheckedChange={onChange}
        size={small ? 'sm' : undefined}
      />
      {showLabel && (
        <Label htmlFor="webhook-enabled" className={small ? 'text-sm' : ''}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Label>
      )}
    </div>
  );
};

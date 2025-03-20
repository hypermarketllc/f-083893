
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WebhookToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  showLabel?: boolean;
  small?: boolean;
  className?: string;
}

const WebhookToggle: React.FC<WebhookToggleProps> = ({ 
  enabled, 
  onChange, 
  showLabel = true,
  small = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        checked={enabled}
        onCheckedChange={onChange}
        className={small ? 'scale-75 origin-left' : ''}
      />
      {showLabel && (
        <Label className={small ? 'text-sm' : ''}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Label>
      )}
    </div>
  );
};

export default WebhookToggle;

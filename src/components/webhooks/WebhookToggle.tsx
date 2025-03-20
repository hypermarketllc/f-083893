
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Power, PowerOff } from 'lucide-react';

interface WebhookToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  loading?: boolean;
  small?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const WebhookToggle: React.FC<WebhookToggleProps> = ({
  enabled,
  onChange,
  loading = false,
  small = false,
  showLabel = true,
  className = ''
}) => {
  const handleToggle = () => {
    if (!loading) {
      onChange(!enabled);
    }
  };

  const content = (
    <div className={`flex items-center gap-2 animate-in fade-in ${className}`}>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={loading}
        className={`${enabled ? 'data-[state=checked]:bg-green-500' : 'data-[state=unchecked]:bg-muted-foreground/30'} transition-all ${loading ? 'opacity-70' : ''} ${small ? 'scale-75' : ''}`}
      />
      {showLabel && (
        <Label 
          htmlFor="webhook-enabled" 
          className={`${enabled ? 'text-green-500' : 'text-muted-foreground'} flex items-center gap-1 cursor-pointer ${small ? 'text-xs' : ''}`}
        >
          {enabled ? (
            <>
              <Power className={`${small ? 'h-3 w-3' : 'h-4 w-4'}`} />
              Active
            </>
          ) : (
            <>
              <PowerOff className={`${small ? 'h-3 w-3' : 'h-4 w-4'}`} />
              Disabled
            </>
          )}
        </Label>
      )}
    </div>
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <p>{enabled ? 'Webhook is active' : 'Webhook is disabled'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export default WebhookToggle;

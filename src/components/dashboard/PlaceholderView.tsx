
import React from 'react';
import { Calendar, GanttChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PlaceholderViewProps {
  type: 'calendar' | 'gantt';
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ type }) => {
  const Icon = type === 'calendar' ? Calendar : GanttChart;
  const title = type === 'calendar' ? 'Calendar View' : 'Gantt View';
  const { toast } = useToast();
  
  const handleRequestFeature = () => {
    toast({
      title: "Feature Requested",
      description: `We've noted your interest in the ${title}. It will be available soon!`,
    });
  };
  
  return (
    <div className="flex items-center justify-center h-96 border rounded-md">
      <div className="text-center">
        <Icon className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-2 font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {title} is coming soon
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRequestFeature}
          className="flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Request this feature
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderView;

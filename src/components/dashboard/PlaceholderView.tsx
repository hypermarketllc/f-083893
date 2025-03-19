
import React, { useState } from 'react';
import { Calendar, GanttChart, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';

interface PlaceholderViewProps {
  type: 'calendar' | 'gantt' | 'default';
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ type }) => {
  // Default to calendar if type is default
  const displayType = type === 'default' ? 'calendar' : type;
  const Icon = displayType === 'calendar' ? Calendar : GanttChart;
  const title = displayType === 'calendar' ? 'Calendar View' : 'Gantt View';
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleRequestFeature = () => {
    setRequested(true);
    let progressValue = 0;
    
    // Simulate progress
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        toast({
          title: "Feature Requested",
          description: `We've noted your interest in the ${title}. It will be available soon!`,
        });
      }
    }, 100);
  };
  
  return (
    <Card className="w-full h-full border rounded-lg shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto p-3 bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Visualize your tasks in a {displayType === 'calendar' ? 'calendar format' : 'timeline format'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center pb-4">
        <div className="space-y-4">
          <div className="relative h-40 bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
            {displayType === 'calendar' ? (
              <div className="grid grid-cols-7 gap-1 p-4 w-full opacity-30">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="aspect-square border rounded-sm flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full px-4 opacity-30">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <div className="w-20 text-xs text-left">Task {i + 1}</div>
                    <div className="flex-1 h-4 bg-primary/20 rounded-sm relative">
                      <div 
                        className="absolute h-4 bg-primary/60 rounded-sm" 
                        style={{ width: `${Math.random() * 80 + 20}%`, left: `${Math.random() * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The {title.toLowerCase()} will help you:
            </p>
            <ul className="text-sm text-left space-y-1 mx-auto max-w-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{displayType === 'calendar' ? 'Schedule tasks with specific dates and times' : 'Visualize dependencies between tasks'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{displayType === 'calendar' ? 'See events and deadlines at a glance' : 'Track project timeline and progress'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{displayType === 'calendar' ? 'Manage your weekly and monthly schedules' : 'Identify critical paths and bottlenecks'}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pb-6">
        {requested ? (
          <div className="w-full max-w-xs space-y-2">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground">
              {progress < 100 ? 'Processing request...' : 'Request received! We\'ll notify you when it\'s ready.'}
            </p>
          </div>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleRequestFeature}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Request this feature
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlaceholderView;

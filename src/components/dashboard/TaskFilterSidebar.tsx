
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';

const TaskFilterSidebar: React.FC = () => {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    areFiltersActive,
    setIsFiltersOpen
  } = useTaskContext();

  const activeFilterCount = Object.values(filters).reduce((count, category) => {
    return count + Object.values(category).filter(isActive => isActive).length;
  }, 0);

  return (
    <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
      <SheetHeader className="py-2">
        <div className="flex items-center justify-between">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Tasks
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsFiltersOpen(false)}
            className="rounded-full h-7 w-7"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </SheetHeader>
      
      <div className="space-y-6 py-4">
        {/* Status Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="todo" 
                checked={filters.status.todo}
                onCheckedChange={(checked) => 
                  updateFilter('status', 'todo', checked === true)
                }
              />
              <label htmlFor="todo" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                To Do
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in_progress" 
                checked={filters.status.in_progress}
                onCheckedChange={(checked) => 
                  updateFilter('status', 'in_progress', checked === true)
                }
              />
              <label htmlFor="in_progress" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                In Progress
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="review" 
                checked={filters.status.review}
                onCheckedChange={(checked) => 
                  updateFilter('status', 'review', checked === true)
                }
              />
              <label htmlFor="review" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Review
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="done" 
                checked={filters.status.done}
                onCheckedChange={(checked) => 
                  updateFilter('status', 'done', checked === true)
                }
              />
              <label htmlFor="done" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Done
              </label>
            </div>
          </div>
        </div>
        
        {/* Priority Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="urgent" 
                checked={filters.priority.urgent}
                onCheckedChange={(checked) => 
                  updateFilter('priority', 'urgent', checked === true)
                }
              />
              <label htmlFor="urgent" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Urgent
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="high" 
                checked={filters.priority.high}
                onCheckedChange={(checked) => 
                  updateFilter('priority', 'high', checked === true)
                }
              />
              <label htmlFor="high" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                High
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medium" 
                checked={filters.priority.medium}
                onCheckedChange={(checked) => 
                  updateFilter('priority', 'medium', checked === true)
                }
              />
              <label htmlFor="medium" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Medium
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="low" 
                checked={filters.priority.low}
                onCheckedChange={(checked) => 
                  updateFilter('priority', 'low', checked === true)
                }
              />
              <label htmlFor="low" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Low
              </label>
            </div>
          </div>
        </div>
        
        {/* Assignee Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assignee</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="me" 
                checked={filters.assignee.me}
                onCheckedChange={(checked) => 
                  updateFilter('assignee', 'me', checked === true)
                }
              />
              <label htmlFor="me" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Assigned to me
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unassigned" 
                checked={filters.assignee.unassigned}
                onCheckedChange={(checked) => 
                  updateFilter('assignee', 'unassigned', checked === true)
                }
              />
              <label htmlFor="unassigned" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Unassigned
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <SheetFooter>
        <div className="flex w-full justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={!areFiltersActive}
          >
            Reset Filters
          </Button>
          <Button
            size="sm"
            onClick={() => setIsFiltersOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default TaskFilterSidebar;

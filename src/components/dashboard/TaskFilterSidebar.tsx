
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SheetContent } from '@/components/ui/sheet';

const TaskFilterSidebar: React.FC = () => {
  return (
    <SheetContent>
      <div className="space-y-4 py-4">
        <h3 className="text-lg font-medium">Filter Tasks</h3>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="todo" className="rounded" />
              <label htmlFor="todo">To Do</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="in_progress" className="rounded" />
              <label htmlFor="in_progress">In Progress</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="review" className="rounded" />
              <label htmlFor="review">Review</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="done" className="rounded" />
              <label htmlFor="done">Done</label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="urgent" className="rounded" />
              <label htmlFor="urgent">Urgent</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="high" className="rounded" />
              <label htmlFor="high">High</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="medium" className="rounded" />
              <label htmlFor="medium">Medium</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="low" className="rounded" />
              <label htmlFor="low">Low</label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="me" className="rounded" />
              <label htmlFor="me">Assigned to me</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="unassigned" className="rounded" />
              <label htmlFor="unassigned">Unassigned</label>
            </div>
          </div>
        </div>
        <Button className="w-full">Apply Filters</Button>
      </div>
    </SheetContent>
  );
};

export default TaskFilterSidebar;

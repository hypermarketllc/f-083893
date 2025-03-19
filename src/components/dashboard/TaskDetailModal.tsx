
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardBadge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Link2,
  MessageSquare,
  Paperclip,
  Users,
  X,
  AlignLeft,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { Task } from '@/types/task';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [activeTab, setActiveTab] = useState('details');

  // Update local state when the task prop changes
  React.useEffect(() => {
    setEditedTask(task);
    setEditMode(false);
  }, [task]);

  if (!task) return null;

  const handleInputChange = (field: keyof Task, value: any) => {
    if (!editedTask) return;
    setEditedTask({ ...editedTask, [field]: value });
  };

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setEditMode(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'clickup-red';
      case 'high': return 'clickup-orange';
      case 'medium': return 'clickup-yellow';
      case 'low': return 'clickup-green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'clickup-red';
      case 'in_progress': return 'clickup-blue';
      case 'review': return 'clickup-yellow';
      case 'done': return 'clickup-green';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background p-6 pb-2 border-b">
          <DialogHeader className="mb-2">
            {editMode ? (
              <Input
                value={editedTask?.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
            )}
          </DialogHeader>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <CardBadge color={getStatusColor(task.status)}>
                {getStatusLabel(task.status)}
              </CardBadge>
              <CardBadge color={getPriorityColor(task.priority)}>
                {task.priority}
              </CardBadge>
            </div>
            <div className="flex items-center gap-2">
              {!editMode && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
              {editMode && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList variant="clickup" className="w-full justify-start">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="attachments">
                <Paperclip className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="relations">
                <Link2 className="h-4 w-4" />
                Relations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-6 pt-4">
          <TabsContent value="details" className="m-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <AlignLeft className="h-4 w-4" />
                    Description
                  </div>
                  {editMode ? (
                    <Textarea
                      placeholder="Add a description..."
                      className="min-h-[150px]"
                      value={editedTask?.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  ) : (
                    <div className="text-sm">
                      {task.description || (
                        <span className="text-muted-foreground italic">
                          No description provided
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </div>
                  <Card className="p-3">
                    <Textarea
                      placeholder="Add a comment..."
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Assignee
                  </Label>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>
                        {task.assignee ? task.assignee[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {task.assignee ? task.assignee.split('@')[0] : 'Unassigned'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {editMode ? (
                      <Input
                        type="date"
                        className="h-8"
                        value={editedTask?.dueDate || ''}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'No due date'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Time Estimate
                  </Label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {editMode ? (
                      <Input
                        className="h-8"
                        value={editedTask?.timeEstimate || ''}
                        onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                        placeholder="e.g. 2h"
                      />
                    ) : (
                      <span className="text-sm">{task.timeEstimate || 'Not set'}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Priority
                  </Label>
                  <div className="flex items-center mt-1">
                    <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                    {editMode ? (
                      <select
                        className="h-8 w-full rounded-md border border-input bg-background px-3"
                        value={editedTask?.priority || 'medium'}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                      >
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : (
                      <CardBadge color={getPriorityColor(task.priority)}>
                        {task.priority}
                      </CardBadge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="flex items-center mt-1">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    {editMode ? (
                      <select
                        className="h-8 w-full rounded-md border border-input bg-background px-3"
                        value={editedTask?.status || 'todo'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    ) : (
                      <CardBadge color={getStatusColor(task.status)}>
                        {getStatusLabel(task.status)}
                      </CardBadge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags && task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {editMode && (
                      <Button variant="ghost" size="sm" className="h-5 px-2">
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="m-0">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-6">
                No comments yet
              </div>
              <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
              <div className="flex justify-end">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attachments" className="m-0">
            <div className="text-center py-10">
              <Paperclip className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">No files attached</h3>
              <p className="text-muted-foreground mb-4">
                Drop files here or click to upload
              </p>
              <Button>
                <Paperclip className="h-4 w-4 mr-1" />
                Attach Files
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="relations" className="m-0">
            <div className="text-center py-10">
              <Link2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">No relations</h3>
              <p className="text-muted-foreground mb-4">
                Connect this task to others
              </p>
              <Button>
                <Link2 className="h-4 w-4 mr-1" />
                Add Relation
              </Button>
            </div>
          </TabsContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;

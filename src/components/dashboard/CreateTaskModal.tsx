
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardBadge } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Flag, 
  Tags, 
  User,
  CheckCircle2,
  X
} from 'lucide-react';
import { Task } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  defaultStatus?: Task['status'];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultStatus = 'todo'
}) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: defaultStatus as Task['status'],
    priority: 'medium',
    dueDate: '',
    assignee: '',
    timeEstimate: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field: keyof Task, value: any) => {
    setNewTask({ ...newTask, [field]: value });
  };

  const handleSave = () => {
    // Generate a random ID for the task
    const taskWithId = {
      ...newTask,
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    } as Task;
    
    onSave(taskWithId);
    resetForm();
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      status: defaultStatus as Task['status'],
      priority: 'medium',
      dueDate: '',
      assignee: '',
      timeEstimate: '',
      tags: []
    });
    setTagInput('');
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && newTask.tags) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    if (newTask.tags) {
      const updatedTags = [...newTask.tags];
      updatedTags.splice(index, 1);
      setNewTask({ ...newTask, tags: updatedTags });
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Status
              </Label>
              <select
                id="status"
                className="w-full h-10 rounded-md border border-input bg-background px-3"
                value={newTask.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <Flag className="h-4 w-4" /> Priority
              </Label>
              <select
                id="priority"
                className="w-full h-10 rounded-md border border-input bg-background px-3"
                value={newTask.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeEstimate" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Time Estimate
              </Label>
              <Input
                id="timeEstimate"
                value={newTask.timeEstimate}
                onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                placeholder="e.g. 2h, 30m"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Assignee
              </Label>
              <Input
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tags className="h-4 w-4" /> Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {newTask.tags && newTask.tags.length > 0 && (
            <div>
              <Label>Current Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {newTask.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 rounded-full"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!newTask.title}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;

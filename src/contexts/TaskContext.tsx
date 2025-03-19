
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Initial task data
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Update contractor agreement',
    description: 'Review and update the terms of our standard contractor agreement template based on legal feedback.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-10',
    assignee: 'john@example.com',
    timeEstimate: '2h',
    tags: ['legal', 'contract']
  },
  {
    id: '2',
    title: 'Create project roadmap',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-12-05',
    assignee: 'user@example.com',
    timeEstimate: '4h',
    tags: ['planning', 'strategy']
  },
  {
    id: '3',
    title: 'Finalize project scope',
    status: 'review',
    priority: 'urgent',
    dueDate: '2023-12-03',
    assignee: 'jane@example.com',
    timeEstimate: '3h',
    tags: ['planning']
  },
  {
    id: '4',
    title: 'Design system implementation',
    status: 'done',
    priority: 'high',
    dueDate: '2023-12-01',
    assignee: 'user@example.com',
    timeEstimate: '8h',
    tags: ['design', 'development']
  },
  {
    id: '5',
    title: 'Quarterly report preparation',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-15',
    assignee: 'john@example.com',
    timeEstimate: '6h',
    tags: ['reporting', 'finance']
  }
];

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (isOpen: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  createModalDefaultStatus: Task['status'];
  setCreateModalDefaultStatus: (status: Task['status']) => void;
  handleTaskClick: (task: Task) => void;
  handleCreateTask: (status?: Task['status']) => void;
  saveTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<Task['status']>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  
  // Effect to filter tasks when search query or tasks change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.status.includes(query) ||
        task.priority.includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCreateTask = (status?: Task['status']) => {
    if (status) {
      setCreateModalDefaultStatus(status);
    }
    setIsCreateModalOpen(true);
  };

  const saveTask = (task: Task) => {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    
    if (taskIndex >= 0) {
      // Update existing task
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = task;
      setTasks(updatedTasks);
      toast.success("Task updated successfully");
    } else {
      // Create new task with unique ID
      const newId = crypto.randomUUID();
      const newTask = { ...task, id: newId };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
    
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsDetailModalOpen(false);
    toast.success("Task deleted successfully");
  };

  const value = {
    tasks,
    filteredTasks,
    searchQuery,
    setSearchQuery,
    selectedTask,
    setSelectedTask,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultStatus,
    setCreateModalDefaultStatus,
    handleTaskClick,
    handleCreateTask,
    saveTask,
    deleteTask
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

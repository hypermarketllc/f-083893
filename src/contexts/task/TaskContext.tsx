
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';
import { INITIAL_TASKS } from './data';
import { TaskContextType, TaskFilters, INITIAL_FILTERS } from './types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<Task['status']>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Check if any filters are active
  const areFiltersActive = Object.values(filters).some(
    categoryFilters => Object.values(categoryFilters).some(value => value === true)
  );
  
  // Effect to filter tasks when search query, filters, or tasks change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.status.includes(query) ||
        task.priority.includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply status filters if any are selected
    const activeStatusFilters = Object.entries(filters.status).filter(([_, isActive]) => isActive);
    if (activeStatusFilters.length > 0) {
      result = result.filter(task => 
        activeStatusFilters.some(([status]) => task.status === status)
      );
    }
    
    // Apply priority filters if any are selected
    const activePriorityFilters = Object.entries(filters.priority).filter(([_, isActive]) => isActive);
    if (activePriorityFilters.length > 0) {
      result = result.filter(task => 
        activePriorityFilters.some(([priority]) => task.priority === priority)
      );
    }
    
    // Apply assignee filters if any are selected
    if (filters.assignee.me || filters.assignee.unassigned) {
      result = result.filter(task => {
        // Current user email - in a real app this would come from auth context
        const currentUserEmail = 'user@example.com';
        
        if (filters.assignee.me && !filters.assignee.unassigned) {
          return task.assignee === currentUserEmail;
        } else if (!filters.assignee.me && filters.assignee.unassigned) {
          return !task.assignee || task.assignee.trim() === '';
        } else if (filters.assignee.me && filters.assignee.unassigned) {
          return task.assignee === currentUserEmail || !task.assignee || task.assignee.trim() === '';
        }
        return true;
      });
    }
    
    setFilteredTasks(result);
  }, [searchQuery, filters, tasks]);

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
  
  // Update a specific filter
  const updateFilter = (
    category: keyof TaskFilters, 
    name: string, 
    value: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value
      }
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    toast.success("Filters reset");
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
    deleteTask,
    filters,
    updateFilter,
    resetFilters,
    isFiltersOpen,
    setIsFiltersOpen,
    areFiltersActive
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

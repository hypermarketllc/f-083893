
import { Task } from '@/types/task';

// Task filters type
export interface TaskFilters {
  status: {
    todo: boolean;
    in_progress: boolean;
    review: boolean;
    done: boolean;
  };
  priority: {
    urgent: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  assignee: {
    me: boolean;
    unassigned: boolean;
  };
}

// Initial filters state
export const INITIAL_FILTERS: TaskFilters = {
  status: {
    todo: false,
    in_progress: false,
    review: false,
    done: false
  },
  priority: {
    urgent: false,
    high: false,
    medium: false,
    low: false
  },
  assignee: {
    me: false,
    unassigned: false
  }
};

// Task context type
export interface TaskContextType {
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
  filters: TaskFilters;
  updateFilter: (category: keyof TaskFilters, name: string, value: boolean) => void;
  resetFilters: () => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  areFiltersActive: boolean;
}

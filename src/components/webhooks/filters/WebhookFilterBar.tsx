
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  X,
  Calendar as CalendarIcon,
  Tag,
  CheckCircle,
  XCircle,
  ChevronsUpDown,
  Clock,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { HttpMethod, WebhookTag } from '@/types/webhook';

interface WebhookFilterBarProps {
  onFilterChange: (filters: WebhookFilters) => void;
  tags?: WebhookTag[];
  showMethodFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
  showTagFilter?: boolean;
}

export interface WebhookFilters {
  search: string;
  method?: HttpMethod | null;
  status?: 'success' | 'error' | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  tags?: string[];
}

export const WebhookFilterBar: React.FC<WebhookFilterBarProps> = ({
  onFilterChange,
  tags = [],
  showMethodFilter = true,
  showStatusFilter = true,
  showDateFilter = true,
  showTagFilter = true
}) => {
  const [filters, setFilters] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    tags: []
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMethodChange = (value: HttpMethod | null) => {
    const newFilters = { ...filters, method: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (value: 'success' | 'error' | null) => {
    const newFilters = { ...filters, status: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
    const newFilters = { ...filters, dateFrom: range.from, dateTo: range.to };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tags?.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...(filters.tags || []), tagId];
    
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      method: null,
      status: null,
      dateFrom: null,
      dateTo: null,
      tags: []
    };
    setFilters(newFilters);
    setDateRange({ from: null, to: null });
    onFilterChange(newFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.method !== null ||
      filters.status !== null ||
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      (filters.tags && filters.tags.length > 0)
    );
  };

  return (
    <div className="flex flex-col space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            className="pl-8 w-full transition-all"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center space-x-1">
          {showMethodFilter && (
            <Select
              value={filters.method || ''}
              onValueChange={(value) => handleMethodChange(value as HttpMethod || null)}
            >
              <SelectTrigger className="w-[120px] h-10 text-xs">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showStatusFilter && (
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleStatusChange(value as 'success' | 'error' || null)}
            >
              <SelectTrigger className="w-[120px] h-10 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="success" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>Success</span>
                </SelectItem>
                <SelectItem value="error" className="flex items-center">
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  <span>Error</span>
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          {showDateFilter && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`h-10 text-xs px-3 ${dateRange.from ? 'text-primary border-primary/50' : ''}`}
                >
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => handleDateChange(range || { from: null, to: null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          {showTagFilter && tags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`h-10 text-xs px-3 ${filters.tags?.length ? 'text-primary border-primary/50' : ''}`}
                >
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  Tags {filters.tags?.length ? `(${filters.tags.length})` : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2" align="end">
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div 
                      key={tag.id} 
                      className={`flex items-center p-1.5 rounded cursor-pointer transition-colors ${
                        filters.tags?.includes(tag.id) ? 'bg-muted/70' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-sm text-muted-foreground p-1">No tags available</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {hasActiveFilters() && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {filters.method && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 h-6">
              <span className="text-xs">Method: {filters.method}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleMethodChange(null)} 
              />
            </Badge>
          )}
          
          {filters.status && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 h-6">
              <span className="text-xs">Status: {filters.status}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusChange(null)} 
              />
            </Badge>
          )}
          
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 h-6">
              <span className="text-xs">
                Date: {filters.dateFrom ? format(filters.dateFrom, "MMM d") : 'Any'} 
                {filters.dateTo ? ` - ${format(filters.dateTo, "MMM d")}` : ''}
              </span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateChange({ from: null, to: null })} 
              />
            </Badge>
          )}
          
          {filters.tags?.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="flex items-center gap-1 px-2 py-1 h-6"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-xs">{tag.name}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleTagToggle(tag.id)} 
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WebhookFilterBar;

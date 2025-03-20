
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { WebhookTag, WebhookFilters as FiltersType } from '@/types/webhook';
import { CalendarIcon, FilterX, Search, X } from 'lucide-react';
import { format } from 'date-fns';

// Export the WebhookFilters type
export type WebhookFilters = FiltersType;

interface WebhookFilterBarProps {
  onFilterChange: (filters: WebhookFilters) => void;
  tags?: WebhookTag[];
  showMethodFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
  showTagFilter?: boolean;
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

  const handleFilterChange = (filterName: keyof WebhookFilters, value: any) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      method: null,
      status: null,
      dateFrom: null,
      dateTo: null,
      tags: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = (
    (filters.method ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    filters.tags.length
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {showMethodFilter && (
          <Select
            value={filters.method || ''}
            onValueChange={(value) => handleFilterChange('method', value || null)}
          >
            <SelectTrigger className="w-[130px]">
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
            onValueChange={(value) => handleFilterChange('status', value || null)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        )}

        {showDateFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? (
                  <span>{format(filters.dateFrom, 'MMM dd, yyyy')}</span>
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateFrom || undefined}
                onSelect={(date) => handleFilterChange('dateFrom', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {showTagFilter && tags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[100px]">
                Tags
                {filters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="space-y-2">
                <Label>Select Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={filters.tags.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const updatedTags = filters.tags.includes(tag.id)
                          ? filters.tags.filter(id => id !== tag.id)
                          : [...filters.tags, tag.id];
                        handleFilterChange('tags', updatedTags);
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-1"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <FilterX className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.tags.map((tagId) => {
            const tag = tags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge key={tag.id} variant="secondary" className="gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const updatedTags = filters.tags.filter(id => id !== tagId);
                    handleFilterChange('tags', updatedTags);
                  }}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

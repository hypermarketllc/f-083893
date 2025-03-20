import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  FilterX,
  GripVertical,
  GripVerticalLine
} from 'lucide-react';

interface WebhookFilterBarProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: 'success' | 'error' | undefined) => void;
  onDateFilter: (dateRange: { from: Date; to: Date } | undefined) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortOptions?: { label: string; value: string }[];
}

export const WebhookFilterBar: React.FC<WebhookFilterBarProps> = ({ 
  onSearch,
  onStatusFilter,
  onDateFilter,
  onSort,
  sortOptions = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'success' | 'error' | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sortBy, setSortBy] = useState(sortOptions.length > 0 ? sortOptions[0].value : '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusFilterChange = (status: 'success' | 'error' | undefined) => {
    setStatusFilter(status);
    onStatusFilter(status);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
  if (range && range.from) {
    setStartDate(range.from);
    // Ensure to is defined
    setEndDate(range.to || range.from);
    
    // Apply the filter
    if (range.from && range.to) {
      onDateFilter({ from: range.from, to: range.to });
    } else if (range.from) {
      // If no end date, use the same date as end date
      onDateFilter({ from: range.from, to: range.from });
    }
  } else {
    // Clear the filter
    setStartDate(undefined);
    setEndDate(undefined);
    onDateFilter(undefined);
  }
};

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSort(value, sortOrder);
  };

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    onSort(sortBy, newSortOrder);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    onSearch('');
    onStatusFilter(undefined);
    onDateFilter(undefined);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 p-4 bg-secondary rounded-md">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="shadow-sm"
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center space-x-2">
        {/* Status Filter */}
        <Select value={statusFilter || ''} onValueChange={(value) => handleStatusFilterChange(value === '' ? undefined : value as 'success' | 'error')}>
          <SelectTrigger className="w-[180px] shadow-sm">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={
                'justify-start text-left font-normal shadow-sm' +
                (startDate ? ' text-foreground' : ' text-muted-foreground')
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                endDate ? (
                  `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`
                ) : (
                  startDate?.toLocaleDateString()
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="range"
              defaultMonth={startDate}
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Sort By */}
        {sortOptions.length > 0 && (
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSortOrderChange}
              className="shadow-sm"
            >
              {sortOrder === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Clear Filters Button */}
        {(searchQuery || statusFilter || startDate || endDate) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="shadow-sm"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

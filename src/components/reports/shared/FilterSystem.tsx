
import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterSystemProps {
  filters: FilterConfig[];
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

const FilterSystem: React.FC<FilterSystemProps> = ({
  filters,
  activeFilters,
  onFilterChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleFilterToggle = (filterId: string, value: string) => {
    const currentValues = activeFilters[filterId] || [];
    
    let newValues;
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v: string) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    const newFilters = {
      ...activeFilters,
      [filterId]: newValues
    };
    
    // Remove empty arrays
    if (newValues.length === 0) {
      delete newFilters[filterId];
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const clearFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    onFilterChange(newFilters);
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (count, values) => count + (values as any[]).length, 
    0
  );

  const getFilterLabel = (filterId: string, value: string) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return value;
    
    const option = filter.options.find(o => o.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {activeFilterCount > 0 && (
            <>
              <DropdownMenuLabel>Active Filters</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                }}
                className="text-destructive focus:text-destructive justify-center font-medium"
              >
                Clear All Filters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {filters.map((filter) => (
            <React.Fragment key={filter.id}>
              <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {filter.options.map((option) => {
                  const isSelected = (activeFilters[filter.id] || []).includes(option.value);
                  
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleFilterToggle(filter.id, option.value);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Checkbox 
                        id={`filter-${filter.id}-${option.value}`}
                        checked={isSelected}
                        className="data-[state=checked]:bg-primary"
                        onCheckedChange={() => {
                          handleFilterToggle(filter.id, option.value);
                        }}
                      />
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display active filters as badges */}
      {Object.entries(activeFilters).map(([filterId, values]) => {
        const filter = filters.find(f => f.id === filterId);
        if (!filter || !(values as any[]).length) return null;
        
        return (values as string[]).map((value, i) => (
          <Badge key={`${filterId}-${value}-${i}`} variant="outline" className="flex items-center gap-1">
            <span>{filter.label}: {getFilterLabel(filterId, value)}</span>
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterToggle(filterId, value)}
            />
          </Badge>
        ));
      })}
    </div>
  );
};

export default FilterSystem;

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  X,
  ChevronDown,
  Settings2
} from 'lucide-react';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  showPremiumOnly: boolean;
  onShowPremiumOnlyChange: (show: boolean) => void;
  onExport: () => void;
}

const categories = ['DeFi', 'Trading', 'Artists', 'Memes', 'Founders', 'NFTs', 'Gaming'];
const statuses = ['All', 'Pending', 'Snoozed', 'Flagged'];
const dateRanges = ['Last 7d', 'Last 30d', 'Last 90d', 'Custom...'];

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategories,
  onCategoriesChange,
  dateRange,
  onDateRangeChange,
  showPremiumOnly,
  onShowPremiumOnlyChange,
  onExport
}: FiltersBarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const clearCategory = (category: string) => {
    onCategoriesChange(selectedCategories.filter(c => c !== category));
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('All');
    onCategoriesChange([]);
    onDateRangeChange('Last 7d');
    onShowPremiumOnlyChange(false);
  };

  const hasActiveFilters = searchQuery || selectedStatus !== 'All' || selectedCategories.length > 0 || showPremiumOnly;

  const DesktopFilters = () => (
    <div className="hidden md:flex items-center gap-4 flex-wrap">
      {/* Search */}
      <div className="relative min-w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by handle or question text..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Status: {selectedStatus}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => onStatusChange(status)}
              className={selectedStatus === status ? 'bg-accent' : ''}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Range */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {dateRange}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Date Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dateRanges.map((range) => (
            <DropdownMenuItem
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={dateRange === range ? 'bg-accent' : ''}
            >
              {range}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Categories */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Categories
            {selectedCategories.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedCategories.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => toggleCategory(category)}
              className="justify-between"
            >
              {category}
              {selectedCategories.includes(category) && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Premium Toggle */}
      <Button
        variant={showPremiumOnly ? "default" : "outline"}
        onClick={() => onShowPremiumOnlyChange(!showPremiumOnly)}
        className={showPremiumOnly ? "bg-emerald-600 hover:bg-emerald-700" : ""}
      >
        Premium Only
      </Button>

      {/* Export */}
      <Button variant="outline" onClick={onExport} className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
          Clear all
        </Button>
      )}
    </div>
  );

  const MobileFilters = () => (
    <div className="md:hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Settings2 className="h-4 w-4" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Customize your question view
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => onStatusChange(status)}
                      className={selectedStatus === status ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {dateRanges.map((range) => (
                    <Button
                      key={range}
                      variant={dateRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDateRangeChange(range)}
                      className={dateRange === range ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className={selectedCategories.includes(category) ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Premium Toggle */}
              <div>
                <Button
                  variant={showPremiumOnly ? "default" : "outline"}
                  onClick={() => onShowPremiumOnlyChange(!showPremiumOnly)}
                  className={`w-full ${showPremiumOnly ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  Show Premium Only
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={onExport} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearAllFilters} className="flex-1">
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <DesktopFilters />
      <MobileFilters />
      
      {/* Active Category Chips */}
      <AnimatePresence>
        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedCategories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="secondary" className="gap-1">
                  {category}
                  <button
                    onClick={() => clearCategory(category)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

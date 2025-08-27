'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  X,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedCount, onClearSelection }: BulkActionsBarProps) {
  const { toast } = useToast();

  const handleBulkSnooze = () => {
    // TODO: Implement bulk snooze API call
    toast({
      title: "Questions snoozed",
      description: `${selectedCount} questions have been snoozed for 12 hours.`,
    });
    onClearSelection();
  };

  const handleMarkAnswered = () => {
    // TODO: Implement bulk mark as answered API call
    toast({
      title: "Questions marked as answered",
      description: `${selectedCount} questions have been marked as answered.`,
    });
    onClearSelection();
  };

  const handleBulkExport = () => {
    // TODO: Implement bulk export functionality
    toast({
      title: "Export started",
      description: `Exporting ${selectedCount} selected questions to CSV.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 md:relative md:top-0 md:left-0 md:transform-none"
    >
      <div className="bg-card border rounded-lg shadow-lg p-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            {selectedCount} selected
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleBulkSnooze}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Snooze</span>
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleMarkAnswered}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Mark Answered</span>
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleBulkExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>

        <div className="h-4 w-px bg-border" />

        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onClearSelection}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
    </motion.div>
  );
}

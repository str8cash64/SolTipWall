'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Inbox, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Wallet, 
  Settings,
  MessageSquare
} from 'lucide-react';
import { stats } from '@/lib/dashboardMocks';

interface TabsShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabsShell({ children, activeTab, onTabChange }: TabsShellProps) {
  const tabs = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <Inbox className="h-4 w-4" />,
      badge: stats.pendingCount,
      badgeVariant: 'default' as const
    },
    {
      id: 'answered',
      label: 'Answered',
      icon: <CheckCircle className="h-4 w-4" />,
      badge: null,
      badgeVariant: 'secondary' as const
    },
    {
      id: 'disputes',
      label: 'Disputes',
      icon: <AlertTriangle className="h-4 w-4" />,
      badge: 2, // From mock data
      badgeVariant: 'destructive' as const
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      badge: null,
      badgeVariant: 'secondary' as const
    },
    {
      id: 'payouts',
      label: 'Payouts',
      icon: <Wallet className="h-4 w-4" />,
      badge: null,
      badgeVariant: 'secondary' as const
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      badge: null,
      badgeVariant: 'secondary' as const
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
            {tab.badge !== null && tab.badge > 0 && (
              <Badge variant={tab.badgeVariant} className="ml-1 h-5 px-1.5 text-xs">
                {tab.badge}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, MessageSquare, DollarSign, Target } from 'lucide-react';
import { stats } from '@/lib/dashboardMocks';
import { formatSol } from '@/lib/fees';

interface KpiCardProps {
  title: string;
  value: string;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  index: number;
}

function KpiCard({ title, value, delta, icon, index }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 hover:ring-1 hover:ring-emerald-400/20 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-emerald-500">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              {value}
            </motion.div>
            {delta && (
              <Badge 
                variant={delta.isPositive ? "default" : "destructive"}
                className={`text-xs ${
                  delta.isPositive 
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : ''
                }`}
              >
                {delta.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {delta.value > 0 ? '+' : ''}{delta.value}%
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Kpis() {
  const kpis = [
    {
      title: 'Response Rate',
      value: `${stats.responseRatePct}%`,
      delta: { value: 2.4, isPositive: true },
      icon: <Target className="h-4 w-4" />
    },
    {
      title: 'Avg Reply Time',
      value: `${stats.avgReplyHrs}h`,
      delta: { value: -12.5, isPositive: false },
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: 'Pending Questions',
      value: stats.pendingCount.toString(),
      delta: { value: 8.2, isPositive: true },
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      title: 'Earnings (7d)',
      value: formatSol(stats.earnings7dSol, 2),
      delta: { value: 15.3, isPositive: true },
      icon: <DollarSign className="h-4 w-4" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.title} {...kpi} index={index} />
      ))}
    </div>
  );
}

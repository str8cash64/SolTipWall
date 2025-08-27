'use client';

import { useState } from 'react';
import { ClientWalletProvider } from '@/components/client-wallet-provider';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import OnboardingForm from './sections/OnboardingForm';
import SettingsForm from './sections/SettingsForm';

// Dashboard Components
import { Kpis } from '@/components/dashboard/Kpis';
import { FiltersBar } from '@/components/dashboard/FiltersBar';
import { InboxTable } from '@/components/dashboard/InboxTable';
import { AnswerDrawer } from '@/components/dashboard/AnswerDrawer';
import { TabsShell } from '@/components/dashboard/TabsShell';
import { AnalyticsPanel } from '@/components/dashboard/AnalyticsPanel';
import { PayoutsPanel } from '@/components/dashboard/PayoutsPanel';
import { DisputesPanel } from '@/components/dashboard/DisputesPanel';

// Data
import { type Question, answered } from '@/lib/dashboardMocks';

interface DashboardClientProps {
  profile: any;
  needsOnboarding: boolean;
}

export default function DashboardClient({ profile, needsOnboarding }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isAnswerDrawerOpen, setIsAnswerDrawerOpen] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('Last 7d');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Show onboarding for new users
  if (needsOnboarding) {
    return (
      <ClientWalletProvider>
        <div className="container py-8 md:py-12">
          <OnboardingForm initial={profile} />
        </div>
      </ClientWalletProvider>
    );
  }

  const handleAnswerClick = (question: Question) => {
    setSelectedQuestion(question);
    setIsAnswerDrawerOpen(true);
  };

  const handleAnswerDrawerClose = () => {
    setIsAnswerDrawerOpen(false);
    setSelectedQuestion(null);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <InboxTable
            onAnswerClick={handleAnswerClick}
            searchQuery={searchQuery}
            selectedStatus={selectedStatus}
            selectedCategories={selectedCategories}
            showPremiumOnly={showPremiumOnly}
          />
        );
      case 'answered':
        return (
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Answered Questions</h3>
                <p className="text-muted-foreground mb-4">
                  View your answered questions and their ratings
                </p>
                <div className="text-sm text-muted-foreground">
                  {answered.length} answered questions • Average rating: 4.7/5
                </div>
              </div>
            </div>
          </div>
        );
      case 'disputes':
        return <DisputesPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'payouts':
        return <PayoutsPanel />;
      case 'settings':
        return <SettingsForm initial={profile} />;
      default:
        return null;
    }
  };

  return (
    <ClientWalletProvider>
      <div className="min-h-screen bg-background">
        <div className="container py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Creator Dashboard</h1>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Production Ready
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Manage your questions, track earnings, and optimize your creator experience.
              </p>
            </motion.div>

            {/* KPIs */}
            <Kpis />

            {/* Main Content */}
            <TabsShell activeTab={activeTab} onTabChange={setActiveTab}>
              <div className="space-y-6">
                {/* Filters (only show on inbox tab) */}
                {activeTab === 'inbox' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FiltersBar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      selectedCategories={selectedCategories}
                      onCategoriesChange={setSelectedCategories}
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                      showPremiumOnly={showPremiumOnly}
                      onShowPremiumOnlyChange={setShowPremiumOnly}
                      onExport={handleExport}
                    />
                  </motion.div>
                )}

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </TabsShell>
          </div>
        </div>

        {/* Answer Drawer */}
        <AnswerDrawer
          question={selectedQuestion}
          isOpen={isAnswerDrawerOpen}
          onClose={handleAnswerDrawerClose}
          isPremium={false}
        />
      </div>
    </ClientWalletProvider>
  );
}

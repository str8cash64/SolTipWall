'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  DollarSign, 
  Crown, 
  Bell, 
  Shield, 
  Download,
  Upload,
  X,
  Plus,
  Ban,
  AlertTriangle
} from 'lucide-react';
import { PremiumUpsell } from './PremiumUpsell';
import { useToast } from '@/components/ui/use-toast';

interface SettingsData {
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string;
    categories: string[];
  };
  pricing: {
    minTip: number;
    quickAmounts: number[];
    avgResponseTime: number;
  };
  notifications: {
    telegramHandle: string;
    emailOnTip: boolean;
    emailOnAnswer: boolean;
    emailWeeklySummary: boolean;
  };
  safety: {
    blockedUsers: string[];
    autoBlockUnder: number;
    autoBlockEnabled: boolean;
  };
  isPremium: boolean;
}

const categories = ['DeFi', 'Trading', 'Artists', 'Memes', 'Founders', 'NFTs', 'Gaming', 'Tech', 'Crypto'];

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      displayName: 'Solana Expert',
      bio: 'Helping builders navigate the Solana ecosystem. DeFi protocols, trading strategies, and technical insights.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
      categories: ['DeFi', 'Trading', 'Tech']
    },
    pricing: {
      minTip: 0.05,
      quickAmounts: [0.1, 0.25, 0.5, 1.0],
      avgResponseTime: 4
    },
    notifications: {
      telegramHandle: '@solana_expert',
      emailOnTip: true,
      emailOnAnswer: false,
      emailWeeklySummary: true
    },
    safety: {
      blockedUsers: ['@spammer1', '@troll_account'],
      autoBlockUnder: 0.01,
      autoBlockEnabled: true
    },
    isPremium: false
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { toast } = useToast();

  const updateSettings = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // TODO: Implement save settings API call
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    // Reset to original values (would come from API in real app)
    setHasChanges(false);
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to the last saved version.",
    });
  };

  const toggleCategory = (category: string) => {
    const current = settings.profile.categories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateSettings(['profile', 'categories'], updated);
  };

  const addQuickAmount = () => {
    const newAmount = 0.1; // Default amount
    updateSettings(['pricing', 'quickAmounts'], [...settings.pricing.quickAmounts, newAmount]);
  };

  const removeQuickAmount = (index: number) => {
    const updated = settings.pricing.quickAmounts.filter((_, i) => i !== index);
    updateSettings(['pricing', 'quickAmounts'], updated);
  };

  const removeBlockedUser = (user: string) => {
    const updated = settings.safety.blockedUsers.filter(u => u !== user);
    updateSettings(['safety', 'blockedUsers'], updated);
  };

  const handleExportData = (format: 'csv' | 'json') => {
    // TODO: Implement data export
    toast({
      title: `Export started`,
      description: `Your data export in ${format.toUpperCase()} format has been started.`,
    });
    setIsExportDialogOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Profile Settings */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-500" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.profile.avatarUrl} />
                  <AvatarFallback>SE</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New Avatar
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.profile.displayName}
                  onChange={(e) => updateSettings(['profile', 'displayName'], e.target.value)}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (140 characters)</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) => updateSettings(['profile', 'bio'], e.target.value)}
                  maxLength={140}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {settings.profile.bio.length}/140
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Categories (select up to 5)</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={settings.profile.categories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        settings.profile.categories.includes(category)
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Settings */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Pricing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Minimum Tip */}
              <div className="space-y-3">
                <Label>Minimum Tip: {settings.pricing.minTip} SOL</Label>
                <Slider
                  value={[settings.pricing.minTip]}
                  onValueChange={(value) => updateSettings(['pricing', 'minTip'], value[0])}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.01 SOL</span>
                  <span>0.5 SOL</span>
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="space-y-3">
                <Label>Quick Amount Buttons</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.pricing.quickAmounts.map((amount, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {amount} SOL
                      <button
                        onClick={() => removeQuickAmount(index)}
                        className="hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addQuickAmount}
                    className="h-6 gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Response Time */}
              <div className="space-y-3">
                <Label>Average Response Time: {settings.pricing.avgResponseTime} hours</Label>
                <Select
                  value={settings.pricing.avgResponseTime.toString()}
                  onValueChange={(value) => updateSettings(['pricing', 'avgResponseTime'], parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium */}
        {!settings.isPremium && (
          <motion.div variants={item}>
            <PremiumUpsell />
          </motion.div>
        )}

        {/* Notifications */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Telegram */}
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Handle</Label>
                <div className="flex gap-2">
                  <Input
                    id="telegram"
                    value={settings.notifications.telegramHandle}
                    onChange={(e) => updateSettings(['notifications', 'telegramHandle'], e.target.value)}
                    placeholder="@username"
                  />
                  <Button variant="outline" size="sm">
                    Link Bot
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Get instant notifications for new tips and questions
                </div>
              </div>

              {/* Email Notifications */}
              <div className="space-y-4">
                <Label>Email Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">New tips</div>
                      <div className="text-xs text-muted-foreground">
                        Get notified when someone sends you a tip
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailOnTip}
                      onCheckedChange={(checked) => updateSettings(['notifications', 'emailOnTip'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Answer confirmations</div>
                      <div className="text-xs text-muted-foreground">
                        Confirm when your answers are sent
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailOnAnswer}
                      onCheckedChange={(checked) => updateSettings(['notifications', 'emailOnAnswer'], checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Weekly summary</div>
                      <div className="text-xs text-muted-foreground">
                        Weekly stats and earnings report
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.emailWeeklySummary}
                      onCheckedChange={(checked) => updateSettings(['notifications', 'emailWeeklySummary'], checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety & Privacy */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Safety & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Auto-block low tips</div>
                    <div className="text-xs text-muted-foreground">
                      Automatically block tips under a certain amount
                    </div>
                  </div>
                  <Switch
                    checked={settings.safety.autoBlockEnabled}
                    onCheckedChange={(checked) => updateSettings(['safety', 'autoBlockEnabled'], checked)}
                  />
                </div>
                {settings.safety.autoBlockEnabled && (
                  <div className="space-y-2">
                    <Label>Block tips under: {settings.safety.autoBlockUnder} SOL</Label>
                    <Slider
                      value={[settings.safety.autoBlockUnder]}
                      onValueChange={(value) => updateSettings(['safety', 'autoBlockUnder'], value[0])}
                      min={0.001}
                      max={0.1}
                      step={0.001}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Blocked Users */}
              <div className="space-y-3">
                <Label>Blocked Users</Label>
                {settings.safety.blockedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {settings.safety.blockedUsers.map((user) => (
                      <div key={user} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{user}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBlockedUser(user)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No blocked users
                  </div>
                )}
              </div>

              {/* Data Export */}
              <div className="space-y-3">
                <Label>Data Export</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(true)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export My Data
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Download all your questions, answers, and earnings data
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save/Reset Actions */}
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  disabled={!hasChanges}
                >
                  Reset Changes
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={!hasChanges}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Choose the format for your data export. This will include all your questions, answers, earnings, and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleExportData('csv')}
                className="h-20 flex-col gap-2"
              >
                <Download className="h-6 w-6" />
                CSV Format
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('json')}
                className="h-20 flex-col gap-2"
              >
                <Download className="h-6 w-6" />
                JSON Format
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Your export will be ready for download within a few minutes and sent to your email.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

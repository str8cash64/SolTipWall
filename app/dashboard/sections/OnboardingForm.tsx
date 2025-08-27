'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

type Profile = {
  display_name?: string | null;
  bio?: string | null;
  categories?: string[] | null;
  min_tip_sol?: number | null;
  quick_amounts?: number[] | null;
  avg_reply_hours?: number | null;
  telegram_handle?: string | null;
  email_new_tips?: boolean | null;
  email_answer_conf?: boolean | null;
  email_weekly?: boolean | null;
  autoblock_min_tip_sol?: number | null;
};

const CATEGORIES = ['DeFi', 'Trading', 'Artists', 'Memes', 'Founders', 'NFTs', 'Gaming', 'Tech', 'Crypto'];
const QUICK_AMOUNT_OPTIONS = [0.05, 0.1, 0.25, 0.5, 1, 2, 5];

export default function OnboardingForm({ initial }: { initial: Profile | null }) {
  const [form, setForm] = useState<Profile>({
    display_name: initial?.display_name ?? '',
    bio: initial?.bio ?? '',
    categories: initial?.categories ?? [],
    min_tip_sol: initial?.min_tip_sol ?? 0.05,
    quick_amounts: initial?.quick_amounts ?? [0.1, 0.25, 0.5, 1],
    avg_reply_hours: initial?.avg_reply_hours ?? 4,
    telegram_handle: initial?.telegram_handle ?? '',
    email_new_tips: initial?.email_new_tips ?? true,
    email_answer_conf: initial?.email_answer_conf ?? false,
    email_weekly: initial?.email_weekly ?? true,
    autoblock_min_tip_sol: initial?.autoblock_min_tip_sol ?? 0.01,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function toggleCategory(category: string) {
    setForm(f => ({ 
      ...f, 
      categories: f.categories?.includes(category) 
        ? f.categories!.filter(x => x !== category) 
        : [...(f.categories ?? []), category].slice(0, 5) // Limit to 5 categories
    }));
  }

  function toggleQuickAmount(amount: number) {
    setForm(f => ({
      ...f,
      quick_amounts: f.quick_amounts?.includes(amount)
        ? f.quick_amounts!.filter(x => x !== amount)
        : [...(f.quick_amounts ?? []), amount].slice(0, 6) // Limit to 6 amounts
    }));
  }

  async function save() {
    if (!form.display_name || !form.bio) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in your display name and bio."
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/profile/save', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast({
        title: "Profile saved!",
        description: "Your creator profile has been set up successfully."
      });
      
      // Reload to show the full dashboard
      location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save profile"
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Complete Your Creator Profile</h1>
        <p className="text-muted-foreground">Set up your profile to start receiving tips and questions</p>
      </div>

      <div className="grid gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell your audience who you are</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="display_name" className="text-sm font-medium">Display Name *</label>
              <Input
                id="display_name"
                value={form.display_name ?? ''}
                onChange={(e) => setForm(f => ({ ...f, display_name: e.target.value }))}
                placeholder="Your display name"
                maxLength={80}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">Bio * ({(form.bio?.length ?? 0)}/140)</label>
              <Textarea
                id="bio"
                value={form.bio ?? ''}
                onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell your audience about yourself..."
                maxLength={140}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Categories (select up to 5)</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <Badge
                    key={category}
                    variant={form.categories?.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Tips</CardTitle>
            <CardDescription>Configure how much you charge for questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Minimum Tip Amount: {form.min_tip_sol?.toFixed(3)} SOL
              </label>
              <Slider
                value={[form.min_tip_sol ?? 0.05]}
                onValueChange={([value]) => setForm(f => ({ ...f, min_tip_sol: value }))}
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

            <div className="space-y-3">
              <label className="text-sm font-medium">Quick Amount Buttons (select up to 6)</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNT_OPTIONS.map(amount => (
                  <Badge
                    key={amount}
                    variant={form.quick_amounts?.includes(amount) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleQuickAmount(amount)}
                  >
                    {amount} SOL
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                Auto-block tips under: {form.autoblock_min_tip_sol?.toFixed(3)} SOL
              </label>
              <Slider
                value={[form.autoblock_min_tip_sol ?? 0.01]}
                onValueChange={([value]) => setForm(f => ({ ...f, autoblock_min_tip_sol: value }))}
                min={0.01}
                max={0.5}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Questions with tips below this amount will be automatically declined
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Communication</CardTitle>
            <CardDescription>How you'll interact with your audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="avg_reply_hours" className="text-sm font-medium">Average Response Time</label>
              <select
                id="avg_reply_hours"
                value={form.avg_reply_hours ?? 4}
                onChange={(e) => setForm(f => ({ ...f, avg_reply_hours: Number(e.target.value) }))}
                className="w-full p-3 border border-input bg-background rounded-md"
              >
                {[1, 2, 4, 6, 8, 12, 24, 48].map(hours => (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="telegram_handle" className="text-sm font-medium">Telegram Handle</label>
              <Input
                id="telegram_handle"
                value={form.telegram_handle ?? ''}
                onChange={(e) => setForm(f => ({ ...f, telegram_handle: e.target.value }))}
                placeholder="@yourusername"
                maxLength={64}
              />
              <p className="text-xs text-muted-foreground">
                Optional: For private communication with premium supporters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">New Tips</label>
                <p className="text-xs text-muted-foreground">Get notified when someone sends you a tip</p>
              </div>
              <Switch
                checked={!!form.email_new_tips}
                onCheckedChange={(checked) => setForm(f => ({ ...f, email_new_tips: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Answer Confirmations</label>
                <p className="text-xs text-muted-foreground">Confirm when your answers are delivered</p>
              </div>
              <Switch
                checked={!!form.email_answer_conf}
                onCheckedChange={(checked) => setForm(f => ({ ...f, email_answer_conf: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Weekly Summary</label>
                <p className="text-xs text-muted-foreground">Weekly report of your earnings and activity</p>
              </div>
              <Switch
                checked={!!form.email_weekly}
                onCheckedChange={(checked) => setForm(f => ({ ...f, email_weekly: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} size="lg" className="min-w-[160px]">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { settingsFormSchema } from '@/lib/validations'
import { SettingsFormData } from '@/lib/types'
import { PriceHelper, SolAmountDisplay } from '@/components/price-helper'
import { Copyable } from './copyable'
import { WalletConnect } from './wallet-connect'
import { SupportersLeaderboard } from './supporters-leaderboard'
import { Loader2, Copy, ExternalLink, Users, Bell, Eye, Gift, TrendingUp, Zap } from 'lucide-react'

interface EnhancedSettingsData extends SettingsFormData {
  emailNotifications: boolean
  telegramNotifications: boolean
}

export function EnhancedSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const { toast } = useToast()

  // Mock current settings - in real app this would come from API/auth context
  const currentSettings = {
    walletAddress: 'FvyAGeYrfChRp4XGX2FhHoax8J4TqBr4WB8ZmMhDDnGP',
    priceSol: 0.1,
    telegramHandle: '@IvySolana',
    emailNotifications: true,
    telegramNotifications: true
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<EnhancedSettingsData>({
    resolver: zodResolver(settingsFormSchema.extend({
      emailNotifications: z.boolean(),
      telegramNotifications: z.boolean()
    })),
    defaultValues: currentSettings
  })

  const onSubmit = async (data: EnhancedSettingsData) => {
    setIsSubmitting(true)
    
    try {
      // Mock API call - in real app this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved!",
        description: "Your profile has been updated successfully."
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWalletConnected = (address: string) => {
    setValue('walletAddress', address)
    setShowWalletConnect(false)
    toast({
      title: "Wallet connected!",
      description: "Your wallet address has been updated."
    })
  }

  const publicLink = `https://tipwall.app/c/${currentSettings.telegramHandle}`
  const actionLink = `https://dial.to/action/tipwall/${currentSettings.telegramHandle}`
  const referralLink = `https://tipwall.app/invite/${currentSettings.telegramHandle}`

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your wallet, pricing, and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="walletAddress" className="text-sm font-medium">
                  Solana Wallet Address
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWalletConnect(!showWalletConnect)}
                >
                  Connect Wallet
                </Button>
              </div>
              
              {showWalletConnect && (
                <div className="mb-4">
                  <WalletConnect 
                    onWalletConnected={handleWalletConnected}
                    currentAddress={watch('walletAddress')}
                  />
                </div>
              )}
              
              <Input
                id="walletAddress"
                placeholder="Your Solana wallet address"
                {...register('walletAddress')}
                className={errors.walletAddress ? 'border-destructive' : ''}
              />
              {errors.walletAddress && (
                <p className="text-sm text-destructive">{errors.walletAddress.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="priceSol" className="text-sm font-medium">
                Price per Question (SOL)
              </label>
              <Input
                id="priceSol"
                type="number"
                step="0.001"
                min="0.001"
                max="10"
                placeholder="0.100"
                {...register('priceSol', { valueAsNumber: true })}
                className={errors.priceSol ? 'border-destructive' : ''}
              />
              <div className="flex justify-between items-center">
                {errors.priceSol && (
                  <p className="text-sm text-destructive">{errors.priceSol.message}</p>
                )}
                {watch('priceSol') && (
                  <PriceHelper solAmount={watch('priceSol')} className="ml-auto" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: 0.001 SOL • Maximum: 10 SOL
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="telegramHandle" className="text-sm font-medium">
                Your Telegram Handle
              </label>
              <Input
                id="telegramHandle"
                placeholder="@yourusername"
                {...register('telegramHandle')}
                className={errors.telegramHandle ? 'border-destructive' : ''}
              />
              {errors.telegramHandle && (
                <p className="text-sm text-destructive">{errors.telegramHandle.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                We'll deliver answers via Telegram
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about new questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="telegramNotifications"
              checked={watch('telegramNotifications')}
              onCheckedChange={(checked) => setValue('telegramNotifications', !!checked)}
            />
            <label htmlFor="telegramNotifications" className="text-sm font-medium">
              Telegram notifications for new questions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={watch('emailNotifications')}
              onCheckedChange={(checked) => setValue('emailNotifications', !!checked)}
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium">
              Email notifications for new questions
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Profile Preview</span>
          </CardTitle>
          <CardDescription>
            This is how your public page will look to visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">{currentSettings.telegramHandle.slice(1, 3).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{currentSettings.telegramHandle}</h3>
                  <p className="text-sm text-muted-foreground">
                    <SolAmountDisplay lamports={currentSettings.priceSol * 1_000_000_000} showUsd={true} />
                    <span className="ml-2">per question</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-bold">12</span>
                  </div>
                  <p className="text-muted-foreground">Tips this week</p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-bold">1.2 SOL</span>
                  </div>
                  <p className="text-muted-foreground">SOL earned</p>
                </div>
              </div>
              <div className="pt-2 border-t text-center">
                <Badge variant="outline" className="text-xs">
                  Response rate: 90% • Avg reply: 6h
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Referral Program</span>
          </CardTitle>
          <CardDescription>
            Invite other creators and earn 3% of their fees for 3 months
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">Earn 3% Commission</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Share your referral link and earn 3% of fees from creators you invite for their first 3 months.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Referral Link</label>
              <Copyable text={referralLink} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 border rounded-lg">
              <div className="text-lg font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Referred Creators</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-lg font-bold text-primary">0 SOL</div>
              <div className="text-xs text-muted-foreground">Earned This Month</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-lg font-bold text-primary">0 SOL</div>
              <div className="text-xs text-muted-foreground">Total Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Links */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Profile</CardTitle>
          <CardDescription>
            Share these links to start receiving paid questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Public Profile Link</label>
            <Copyable text={publicLink} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Blink Action Link</label>
              <Badge variant="outline" className="text-xs">Advanced</Badge>
            </div>
            <Copyable text={actionLink} />
            <p className="text-xs text-muted-foreground">
              For Solana wallets that support Actions/Blinks
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Supporters */}
      <SupportersLeaderboard creatorHandle={currentSettings.telegramHandle} />
    </div>
  )
}



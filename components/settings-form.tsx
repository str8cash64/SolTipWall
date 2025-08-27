'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { settingsFormSchema } from '@/lib/validations'
import { SettingsFormData } from '@/lib/types'
import { lamportsToSol, solToLamports } from '@/lib/utils'
import { Loader2, Copy, ExternalLink } from 'lucide-react'
import { Copyable } from './copyable'

export function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Mock current settings - in real app this would come from API/auth context
  const currentSettings = {
    walletAddress: 'FvyAGeYrfChRp4XGX2FhHoax8J4TqBr4WB8ZmMhDDnGP',
    priceSol: 0.1,
    telegramHandle: '@IvySolana'
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: currentSettings
  })

  const onSubmit = async (data: SettingsFormData) => {
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

  const publicLink = `https://tipwall.app/c/${currentSettings.telegramHandle}`
  const actionLink = `https://dial.to/action/tipwall/${currentSettings.telegramHandle}`

  return (
    <div className="space-y-6">
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
              <label htmlFor="walletAddress" className="text-sm font-medium">
                Solana Wallet Address
              </label>
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
              {errors.priceSol && (
                <p className="text-sm text-destructive">{errors.priceSol.message}</p>
              )}
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
                placeholder="@username"
                {...register('telegramHandle')}
                className={errors.telegramHandle ? 'border-destructive' : ''}
              />
              {errors.telegramHandle && (
                <p className="text-sm text-destructive">{errors.telegramHandle.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This is where answers will be sent to your followers
              </p>
            </div>

            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
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

      <Card>
        <CardHeader>
          <CardTitle>Share Your TipWall</CardTitle>
          <CardDescription>
            Copy these links to share with your audience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Public Profile Link</label>
            <Copyable value={publicLink} />
            <p className="text-xs text-muted-foreground">
              Share this link for followers to ask you questions
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tip Action Link (Blink)</label>
            <Copyable value={actionLink} />
            <p className="text-xs text-muted-foreground">
              Use this for Solana Actions/Blinks integration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

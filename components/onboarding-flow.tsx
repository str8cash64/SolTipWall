'use client'

import { useState, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { settingsFormSchema } from '@/lib/validations'
import { SettingsFormData } from '@/lib/types'
import { CheckCircle, ArrowRight, Loader2, Wallet, MessageCircle, DollarSign } from 'lucide-react'
import { Copyable } from './copyable'
import { WalletConnect } from './wallet-connect'
import { PriceHelper } from './price-helper'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      walletAddress: '',
      priceSol: 0.1,
      telegramHandle: ''
    }
  })

  const handleWalletConnected = (address: string) => {
    setValue('walletAddress', address)
    toast({
      title: "Wallet connected!",
      description: "Your wallet address has been automatically filled."
    })
  }

  const steps = [
    {
      title: "Welcome to TipWall!",
      description: "Let's set up your creator profile in 3 easy steps",
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're almost ready!</h3>
            <p className="text-muted-foreground">
              Complete your profile setup to start earning from your expertise.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Connect your wallet</p>
                <p className="text-sm text-muted-foreground">Where you'll receive payments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Set your price</p>
                <p className="text-sm text-muted-foreground">How much per question</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Connect Telegram</p>
                <p className="text-sm text-muted-foreground">For delivering answers</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Wallet",
      description: "Add your Solana wallet address to receive payments",
      icon: Wallet,
      content: (
        <div className="space-y-6">
          <WalletConnect 
            onWalletConnected={handleWalletConnected}
            currentAddress={watch('walletAddress')}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="walletAddress" className="text-sm font-medium">
              Solana Wallet Address
            </label>
            <Input
              id="walletAddress"
              placeholder="Enter your Solana wallet address"
              {...register('walletAddress')}
              className={errors.walletAddress ? 'border-destructive' : ''}
            />
            {errors.walletAddress && (
              <p className="text-sm text-destructive">{errors.walletAddress.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This is where you'll receive SOL payments from your followers.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Price & Telegram",
      description: "Configure your question price and Telegram for delivery",
      icon: DollarSign,
      content: (
        <div className="space-y-4">
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
              placeholder="@username"
              {...register('telegramHandle')}
              className={errors.telegramHandle ? 'border-destructive' : ''}
            />
            {errors.telegramHandle && (
              <p className="text-sm text-destructive">{errors.telegramHandle.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              We'll send answers to your followers via our Telegram bot
            </p>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Your creator profile is ready. Start sharing your link!",
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile Complete!</h3>
            <p className="text-muted-foreground">
              Your TipWall creator profile is now live and ready to receive questions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Public Profile Link</label>
              <Copyable value={`https://tipwall.app/c/@IvySolana`} />
              <p className="text-xs text-muted-foreground">
                Share this link with your audience so they can ask you questions
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Next steps:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Share your TipWall link on social media</li>
              <li>• Check your dashboard for incoming questions</li>
              <li>• Answer questions to start earning SOL</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true)
    
    try {
      // Mock API call - in real app this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile updated!",
        description: "Your creator settings have been saved successfully."
      })
      
      setCurrentStep(currentStep + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your settings. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete()
    } else if (currentStep === 0) {
      setCurrentStep(1)
    } else if (currentStep === 1) {
      // Wallet step - just move to next step if validation passes
      if (canProceed()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      // Final form step - submit the form
      handleSubmit(onSubmit)()
    }
  }

  const canProceed = useCallback(() => {
    if (currentStep === 0 || currentStep === steps.length - 1) return true
    
    try {
      const watchedValues = watch()
      if (currentStep === 1) {
        const walletValue = watchedValues?.walletAddress || ''
        return walletValue && walletValue.length >= 32 && walletValue.length <= 44 && /^[A-Za-z0-9]+$/.test(walletValue)
      }
      
      if (currentStep === 2) {
        const priceValue = watchedValues?.priceSol || 0
        const telegramValue = watchedValues?.telegramHandle || ''
        return !!priceValue && priceValue >= 0.001 && !!telegramValue && telegramValue.length >= 5
      }
    } catch (error) {
      console.warn('Error in canProceed:', error)
      return false
    }
    
    return false
  }, [currentStep, watch, steps.length])

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <currentStepData.icon className="w-5 h-5" />
            <span>{currentStepData.title}</span>
          </CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStepData.content}
            
            <div className="flex justify-between pt-6">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className={currentStep === 0 || currentStep === steps.length - 1 ? 'w-full' : 'ml-auto'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  'Go to Dashboard'
                ) : (
                  <>
                    {currentStep === 0 ? 'Get Started' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

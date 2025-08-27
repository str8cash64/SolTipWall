'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { tipFormSchema } from '@/lib/validations'
import { TipFormData } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { PriceHelper, SolAmountDisplay } from '@/components/price-helper'
import { Loader2 } from 'lucide-react'

interface TipFormProps {
  creatorHandle: string
  priceLamports: number
}

export function TipForm({ creatorHandle, priceLamports }: TipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TipFormData>({
    resolver: zodResolver(tipFormSchema)
  })

  const agreeToTerms = watch('agreeToTerms')

  const onSubmit = async (data: TipFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/tip/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorHandle,
          tipperTg: data.telegramHandle,
          questionText: data.questionText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to initialize tip')
      }

      const result = await response.json()
      
      // Show payment summary briefly before redirect
      toast({
        title: "Redirecting to Phantom...",
        description: `Amount: ${formatSol(priceLamports)} SOL`
      })

      // Simulate brief delay then redirect
      setTimeout(() => {
        const urlWithCreator = new URL(result.actionUrl)
        urlWithCreator.searchParams.set('creator', creatorHandle)
        window.location.href = urlWithCreator.toString()
      }, 1500)

    } catch (error) {
      console.error('Error submitting tip:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
        <CardDescription>
          Pay {formatSol(priceLamports)} SOL to get a personalized answer delivered via Telegram
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          </div>

          <div className="space-y-2">
            <label htmlFor="questionText" className="text-sm font-medium">
              Your Question
            </label>
            <Textarea
              id="questionText"
              placeholder="What would you like to ask?"
              rows={4}
              {...register('questionText')}
              className={errors.questionText ? 'border-destructive' : ''}
              maxLength={280}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {errors.questionText && (
                <span className="text-destructive">{errors.questionText.message}</span>
              )}
              <span className={`ml-auto ${(watch('questionText')?.length || 0) > 250 ? 'text-red-500 font-medium' : ''}`}>
                {watch('questionText')?.length || 0}/280
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Amount:</span>
                <div className="text-right">
                  <SolAmountDisplay lamports={priceLamports} showUsd={true} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Creator:</span>
                <span className="font-medium">{creatorHandle}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand this is a tip and not financial advice
                </label>
              </div>
              
              <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-2">
                <strong>Disclaimer:</strong> Tips are final. Creators are expected to reply but TipWall cannot guarantee responses.
              </div>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="md"
            className="w-full"
            disabled={isSubmitting || !agreeToTerms}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Phantom...
              </>
            ) : (
              <>
                <span className="text-lg mr-1">◎</span>
                {`Pay ${formatSol(priceLamports)} SOL & Ask`}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

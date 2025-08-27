'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { TipRow } from '@/lib/types'
import { answerFormSchema } from '@/lib/validations'
import { formatSol } from '@/lib/utils'
import { Loader2, Send } from 'lucide-react'

interface AnswerDialogProps {
  tip: TipRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

type AnswerFormData = {
  answerText: string
}

export function AnswerDialog({ tip, open, onOpenChange, onSubmit }: AnswerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerFormSchema)
  })

  const handleAnswerSubmit = async (data: AnswerFormData) => {
    if (!tip) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipId: tip.id,
          answerText: data.answerText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send answer')
      }

      toast({
        title: "Answer sent!",
        description: "Your answer has been delivered via Telegram."
      })

      reset()
      onOpenChange(false)
      onSubmit() // Refresh the parent component
    } catch (error) {
      console.error('Error sending answer:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send answer. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!tip) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Answer Question</DialogTitle>
          <DialogDescription>
            Responding to {tip.tipperTg} • {formatSol(tip.amountLamports)} SOL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">Question:</h4>
            <p className="text-sm">{tip.questionText}</p>
          </div>

          <form onSubmit={handleSubmit(handleAnswerSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="answerText" className="text-sm font-medium">
                Your Answer
              </label>
              <Textarea
                id="answerText"
                placeholder="Type your answer here..."
                rows={6}
                {...register('answerText')}
                className={errors.answerText ? 'border-destructive' : ''}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.answerText && (
                  <span className="text-destructive">{errors.answerText.message}</span>
                )}
                <span className="ml-auto">
                  {watch('answerText')?.length || 0}/1000
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Answer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

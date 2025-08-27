'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Copy, Check } from 'lucide-react'

interface CopyableProps {
  value?: string
  text?: string
  className?: string
}

export function Copyable({ value, text, className }: CopyableProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  
  const displayText = text || value || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the link manually"
      })
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Input 
        value={displayText} 
        readOnly 
        className="font-mono text-sm"
        onClick={(e) => e.currentTarget.select()}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

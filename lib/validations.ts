import { z } from 'zod'

export const tipFormSchema = z.object({
  telegramHandle: z
    .string()
    .min(1, 'Telegram handle is required')
    .regex(
      /^@?[a-zA-Z0-9_]{5,}$/,
      'Invalid Telegram handle format. Must be at least 5 characters and contain only letters, numbers, and underscores'
    )
    .transform(val => val.startsWith('@') ? val : `@${val}`),
  questionText: z
    .string()
    .min(1, 'Question is required')
    .max(280, 'Question must be 280 characters or less'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms')
})

export const settingsFormSchema = z.object({
  walletAddress: z
    .string()
    .min(32, 'Wallet address must be at least 32 characters')
    .max(44, 'Wallet address must be at most 44 characters')
    .refine(
      (val) => {
        // More lenient validation - just check if it looks like a Solana address
        return /^[A-Za-z0-9]+$/.test(val) && val.length >= 32 && val.length <= 44
      },
      'Please enter a valid Solana wallet address (32-44 characters, alphanumeric)'
    ),
  priceSol: z
    .number()
    .min(0.001, 'Minimum price is 0.001 SOL')
    .max(10, 'Maximum price is 10 SOL'),
  telegramHandle: z
    .string()
    .min(1, 'Telegram handle is required')
    .regex(
      /^@?[a-zA-Z0-9_]{5,}$/,
      'Invalid Telegram handle format'
    )
    .transform(val => val.startsWith('@') ? val : `@${val}`)
})

export const answerFormSchema = z.object({
  answerText: z
    .string()
    .min(1, 'Answer is required')
    .max(1000, 'Answer must be 1000 characters or less')
})

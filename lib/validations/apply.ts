import { z } from 'zod'
import { JOB_POSITIONS } from '@/types'

export const applyFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Phone number too short')
    .max(20, 'Phone number too long')
    .regex(/^[+\d\s()-]+$/, 'Invalid phone number format'),
  linkedIn: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .url('Please enter a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Please enter a valid number of years'),
  position: z.enum(JOB_POSITIONS as [string, ...string[]]),
})

export type ApplyFormData = z.infer<typeof applyFormSchema>

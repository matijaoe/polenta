import { z } from 'zod'
import { validateXpub } from '~/server/utils/bitcoin'

export const accountSchema = z.object({
  id: z.number(),
  walletId: z.number(),
  xpub: z.string()
    .refine(validateXpub, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(/^[0-9A-Fa-f]{8}$/, 'Fingerprint must be in hex format with 8 characters')
    .transform(fp => fp.toUpperCase())
    .optional(),
  derivationPath: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
})

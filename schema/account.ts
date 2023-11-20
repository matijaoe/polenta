import { z } from 'zod'
import { createUpdateSchema, derivationPathRegex, fingerprintRegex } from '~/utils'

export const accountSchema = z.object({
  walletId: z.number(),
  xpub: z.string()
    .refine(validateXpub, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
    .transform((fp) => fp.toLowerCase())
    .optional(),
  derivationPath: z.string().regex(derivationPathRegex, 'Invalid derivation path'),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
})

export const accountUpdateSchema = createUpdateSchema(accountSchema, {
  omit: [
    'xpub',
    'derivationPath',
    'createdAt',
    'walletId'
  ],
})

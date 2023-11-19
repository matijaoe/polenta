import { z } from 'zod'
import { validateXpub } from '~/server/utils/bitcoin'

export const accountSchema = z.object({
  id: z.number(),
  walletId: z.number(),
  xpub: z.string()
    .refine(validateXpub, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
    .transform(fp => fp.toUpperCase())
    .optional(),
  derivationPath: z.string().regex(derivationPathRegex, 'Invalid derivation path'),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
})

export const accountUpdateSchema = createUpdateSchema(accountSchema, {
  omit: [
    'id',
    'xpub',
    'derivationPath',
    'createdAt'
  ],
})

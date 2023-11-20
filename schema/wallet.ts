import { z } from 'zod'
import { Script } from '~/models'
import { createUpdateSchema } from '~/utils'

export const walletSchema = z.object({
  name: z.string().min(3).max(40),
  description: z.string().optional(),
  scriptType: z.nativeEnum(Script),
  passphraseProtected: z.boolean().default(false),
  createdAt: z.string().optional(),
})

export const walletUpdateSchema = createUpdateSchema(walletSchema, {
  omit: [
    'createdAt'
  ],
})

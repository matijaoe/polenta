import { z } from 'zod'
import { Script } from '~/models'
import { createUpdateSchema } from '~/utils/zod'

const walletSchema = z.object({
  id: z.string(),
  xpub: z.string(),
  derivationPath: z.string(),
  name: z.string().min(3).max(40),
  description: z.string().optional(),
  scriptType: z.string().default(Script.native_segwit),
  passphraseProtected: z.boolean(),
  createdAt: z.string().optional(),
})

const walletUpdateSchema = createUpdateSchema(walletSchema, {
  omit: ['id', 'createdAt'],
})

export {
  walletSchema,
  walletUpdateSchema
}

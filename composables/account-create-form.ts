import { z } from 'zod'
import type { Script } from '~/models'

export const useWalletAccountCreateForm = (wallet: MaybeRefOrGetter<Wallet>) => {
  const schema = z.object({
    walletId: z.number(),
    name: z.string()
      .min(1, 'Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(40, 'Name must be at most 40 characters'),
    description: z.string().optional(),
    xpub: z.string()
      .min(1, 'xpub is required')
      .refine(validateXpubClientSide, 'Invalid xpub'),
    fingerprint: z
      .string()
      .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
      .transform((fp) => fp.toUpperCase()).optional(),
    derivationPath: z.string()
      .min(1, 'Derivation path is required')
      .regex(derivationPathRegex, 'Invalid derivation path')
      .transform((path) => path.replaceAll(`'`, 'h')),
  })

  const DEFAULTS: {
    script: Script
    fingerprint: string
  } = {
    script: toValue(wallet).scriptType as Script,
    fingerprint: '00000000'
  }

  const {
    values,
    errors,
    handleSubmit,
    defineField,
    setFieldValue,
    setFieldTouched,
    isFieldTouched,
    resetForm,
  } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues: {
      walletId: toValue(wallet).id,
      name: '',
      description: '',
      xpub: '',
      fingerprint: '',
      // derivationPath: getScriptValue(DEFAULTS.script)!.derivationPath,
      // TODO: increment last index
      derivationPath: '',
    },
  })

  const fieldError = (field: keyof typeof values) => {
    return isFieldTouched(field) && errors.value[field!]
  }

  return {
    defaults: DEFAULTS,
    defineField,
    values,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
    fieldError,
  }
}

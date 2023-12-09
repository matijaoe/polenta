import { z } from 'zod'
import { Script } from '~/models'

export const useWalletCreateForm = () => {
  const schema = z.object({
    name: z.string()
      .min(1, 'Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(40, 'Name must be at most 40 characters'),
    description: z.string().optional(),
    scriptType: z.nativeEnum(Script),
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
    passphraseProtected: z.boolean().default(false),
  })

  const DEFAULTS: {
    script: Script
    fingerprint: string
  } = {
    script: Script.native_segwit,
    fingerprint: '00000000'
  }

  const { getScriptValue } = useBitcoinScripts()

  const {
    values,
    errors,
    handleSubmit,
    defineField,
    setFieldValue,
    setFieldTouched,
    isFieldTouched,
    resetForm,
    resetField,
  } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues: {
      name: '',
      description: '',
      scriptType: DEFAULTS.script,
      xpub: '',
      fingerprint: '',
      passphraseProtected: false,
      derivationPath: getScriptValue(DEFAULTS.script)!.derivationPath,
    },
  })

  const fieldError = (field: keyof typeof values) => {
    return isFieldTouched(field) && errors.value[field!]
  }

  return {
    defaults: DEFAULTS,
    values,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetField,
    defineField,
    resetForm,
    fieldError,
  }
}

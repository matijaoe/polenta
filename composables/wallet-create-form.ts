import { toTypedSchema } from '@vee-validate/valibot'
import { boolean, customAsync, enum_, maxLength, minLength, objectAsync, optional, regex, string, stringAsync, toCustom, toUpperCase } from 'valibot'
import { Script } from '~/models'

export const useWalletCreateForm = () => {
  const schema = objectAsync({
    name: string([
      minLength(1, 'Name is required'),
      minLength(3, 'Name must be at least 3 characters'),
      maxLength(40, 'Name must be at most 40 characters'),
    ]),
    description: optional(string()),
    scriptType: enum_(Script),
    xpub: stringAsync([
      minLength(1, 'xpub is required'),
      customAsync(validateXpubClientSide, 'Invalid xpub'),
    ]),
    fingerprint: optional(string([
      regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string'),
      toUpperCase(),
    ])),
    derivationPath: string([
      minLength(1, 'Derivation path is required'),
      regex(derivationPathRegex, 'Invalid derivation path'),
      toCustom((path) => path.replaceAll(`'`, 'h')),
    ]),
    passphraseProtected: optional(boolean()),
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

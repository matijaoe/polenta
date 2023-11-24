<script lang="ts" setup>
import { ErrorCode, Script } from '~/models'

const validationSchema = z.object({
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

const { scriptOptions, getScriptValue } = useBitcoinScripts()

const {
  values,
  errors,
  handleSubmit,
  defineInputBinds,
  setFieldValue,
  useFieldModel,
  setFieldTouched,
  isFieldTouched,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(validationSchema),
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

const inputOptions = { validateOnInput: true }
const name = defineInputBinds('name', inputOptions)
const description = defineInputBinds('description', inputOptions)
const xpub = defineInputBinds('xpub', inputOptions)
const fingerprint = defineInputBinds('fingerprint', inputOptions)
const scriptType = defineInputBinds('scriptType', inputOptions)
const derivationPath = defineInputBinds('derivationPath', inputOptions)
const passphraseProtectedModel = useFieldModel('passphraseProtected')

const fieldError = (field: keyof typeof values) => {
  return isFieldTouched(field) && errors.value[field!]
}

const selectedScriptType = computed({
  get: () => getScriptValue(scriptType.value.value),
  set: (selected) => setFieldValue('scriptType', selected?.value)
})

watch(() => fingerprint.value, ({ value }) => {
  setFieldValue('fingerprint', value?.toUpperCase())
})

const defaultDerivationPath = computed(() => {
  const script = scriptType.value.value ?? DEFAULTS.script
  return getScriptValue(script)!.derivationPath
})

const setDefaultDerivationPath = () => {
  setFieldValue('derivationPath', defaultDerivationPath.value)
}

watchEffect(() => {
  setDefaultDerivationPath()
})

const autofillDerivation = () => {
  if (values.derivationPath !== '') {
    return
  }
  setDefaultDerivationPath()
}

const autofillFingerprint = () => {
  if (values.fingerprint !== '') {
    return
  }
  setFieldValue('fingerprint', DEFAULTS.fingerprint)
}

const toast = useToast()

const { execute: createWallet, status, data: createdData, error } = await useFetch('/api/wallets', {
  method: 'POST',
  immediate: false,
  server: false,
  watch: false,
  body: computed(() => ({
    wallet: {
      name: values.name,
      description: values.description,
      scriptType: values.scriptType,
      passphraseProtected: values.passphraseProtected,
    },
    account: {
      name: 'First account',
      xpub: values.xpub,
      fingerprint: values.fingerprint,
      derivationPath: values.derivationPath,
    }
  })),
})

const errorCode = computed(() => error.value?.data.data?.errorCode as ErrorCode | undefined)
const isSuccess = computed(() => status.value === 'success')
const isLoading = computed(() => status.value === 'pending')

const onSubmit = handleSubmit(
  async (values, { resetForm, setFieldError }) => {
    await createWallet()

    if (isSuccess.value && createdData.value) {
      toast.add({
        title: 'Wallet created successfully',
        description: 'Your new wallet is now ready for use.',
        color: 'green',
        icon: 'i-ph-confetti-bold',
        timeout: 0,
        actions: [
          {
            label: 'Check it out',
            click: () => {
              navigateTo({
                name: 'wallets-walletId-accountId',
                params: {
                  accountId: createdData.value!.account.id,
                  walletId: createdData.value!.wallet.id,
                }
              })
            },
            color: 'green',
            variant: 'solid',
          },
          {
            label: 'See data',
            click: () => {
              alert(JSON.stringify(createdData.value, null, 2))
            },
          },

        ]
      })
      resetForm()
      navigateTo('/')
      return
    }

    if (error.value) {
      const code = errorCode.value
      if (code === ErrorCode.DUPLICATE_XPUB) {
        setFieldError('xpub', 'Wallet with this xpub already exists')
        // TODO: add a button to navigate to the wallet with that xpub
        // perhaps also show some data of that account in the toast
        toast.add({
          title: 'Wallet creation failed',
          description: 'A wallet with the provided XPUB already exists in your account. Please enter a unique XPUB to create a new wallet.',
          color: 'red',
          timeout: 0,
          icon: 'i-ph-warning-bold',
        })
        return
      }
      toast.add({
        title: 'Unable to create your wallet',
        description: 'An unexpected error occurred while creating your wallet. Please try again. If the issue persists, please send us a bug report.',
        color: 'red',
        icon: 'i-ph-bug-bold',
        actions: [
          {
            label: 'Report a bug',
            click: () => {
              alert('Bug reported')
            },
            color: 'red',
            variant: 'soft'
          },
          {
            label: 'See error',
            click: () => {
              alert(JSON.stringify(error.value, null, 2))
            }
          }
        ]
      })
    }
  },
  (context) => {
    toast.add({ title: 'Check you data', color: 'red' })
    console.error('⚠️ Validation error', context)
  }
)
const activeEl = useActiveElement()
const clearDerivationBtnActive = computed(() => activeEl.value?.id === 'clearDerivationPathBtn')

const derivationPathEl = ref<{ input: HTMLInputElement } | null>(null)
const onClearDerivationPath = () => {
  setFieldValue('derivationPath', '')
  const input = derivationPathEl.value?.input
  input?.focus()
  setFieldTouched('derivationPath', false)
}
</script>

<template>
  <div>
    <UForm :state="values" class="max-w-4xl" @submit="onSubmit">
      <div class="grid lg:grid-cols-2">
        <div class="flex flex-col gap-5">
          <UFormGroup
            size="sm"
            label="Wallet name"
            :error="fieldError('name')"
          >
            <UInput v-bind="name" />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Wallet description"
            :error="fieldError('description')"
          >
            <UTextarea v-bind="description" />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Script type"
          >
            <USelectMenu
              v-model="selectedScriptType"
              :options="scriptOptions"
            >
              <template #option="{ option }">
                <div class="flex flex-col gap-2 w-full">
                  <p class="flex-1">
                    {{ option.label }}
                  </p>

                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    Address starts with <span class="font-bold text-gray-500 dark:text-gray-400">{{ option.addressFormat }}</span>
                  </p>
                </div>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="xpub"
            hint="Extended private key"
            :error="fieldError('xpub')"
          >
            <UTextarea v-bind="xpub" placeholder="xpub" />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Master fingerprint"
            :error="fieldError('fingerprint')"
          >
            <UInput
              v-bind="fingerprint"
              :placeholder="DEFAULTS.fingerprint"
              maxlength="8"
              pattern="[a-fA-F0-9]*"
              @keyup.right="autofillFingerprint"
            />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Derivation path"
            :error="!clearDerivationBtnActive && fieldError('derivationPath')"
          >
            <UInput
              v-bind="derivationPath"
              ref="derivationPathEl"
              :placeholder="defaultDerivationPath"
              :ui="{ icon: { trailing: { pointer: '' } } }"
              @keyup.right="autofillDerivation"
            >
              <template #trailing>
                <UButton
                  v-show="derivationPath.value !== ''"
                  id="clearDerivationPathBtn"
                  color="gray"
                  variant="link"
                  icon="i-ph-x-bold"
                  :padded="false"
                  @click.stop="onClearDerivationPath"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Passphrase protected"
          >
            <UToggle
              v-model="passphraseProtectedModel"
              on-icon="i-heroicons-lock-closed"
              off-icon="i-heroicons-lock-open"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <UButton color="white" variant="solid" @click="resetForm">
          Clear
        </UButton>

        <UButton type="submit" :loading="isLoading">
          Create
        </UButton>
      </div>
    </UForm>
  </div>
</template>

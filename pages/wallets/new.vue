<script lang="ts" setup>
import { z } from 'zod'
import { Script } from '~/models'

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

const { scriptOptions, getScriptValue } = useBitcoinScripts()
const DEFAULT_SCRIPT: Script = Script.native_segwit

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
    scriptType: DEFAULT_SCRIPT,
    xpub: '',
    fingerprint: '',
    passphraseProtected: false,
    derivationPath: getScriptValue(DEFAULT_SCRIPT)!.derivationPath,
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
  const script = scriptType.value.value ?? DEFAULT_SCRIPT
  return getScriptValue(script)!.derivationPath
})

const setDefaultDerivationPath = () => {
  setFieldValue('derivationPath', defaultDerivationPath.value)
}

// watch script value and set default derivation path
watchEffect(() => {
  setDefaultDerivationPath()
})

const toast = useToast()

const { execute, status, data: createdData } = await useFetch('/api/wallets', {
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
const isLoading = computed(() => status.value === 'pending')

const onSubmit = handleSubmit(
  async (values, { resetForm }) => {
    console.log('✅', values)
    await execute()
    if (createdData.value) {
      console.log('createdData', createdData.value)
      toast.add({ title: 'Wallet created', color: 'green' })
      resetForm()
      navigateTo('/')
    } else {
      toast.add({ title: 'Error creating wallet', color: 'red' })
    }
  },
  (values) => {
    console.error('⚠️ error', values)
  }
)

const derivationPathInput = ref<any | null>(null)
const onClearDerivationPath = () => {
  setFieldValue('derivationPath', '')
  const elem = derivationPathInput.value.$el
  const input = elem?.querySelector('input')
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
              placeholder="00000000"
              maxlength="8"
              pattern="[a-fA-F0-9]*"
            />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Derivation path"
            :error="fieldError('derivationPath')"
          >
            <UInput
              v-bind="derivationPath"
              ref="derivationPathInput"
              :placeholder="defaultDerivationPath"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  v-show="derivationPath.value !== ''"
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
          Revert
        </UButton>

        <UButton type="submit" :loading="isLoading">
          Create
        </UButton>
      </div>
    </UForm>
  </div>
</template>

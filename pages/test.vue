<script lang="ts" setup>
import { Script } from '~/models'

const validationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(40, 'Name must be at most 40 characters'),
  description: z.string().optional(),
  scriptType: z.nativeEnum(Script),
  xpub: z.string()
    .refine(validateXpubClientSide, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
    .transform((fp) => fp.toLowerCase()).optional(),
  passphraseProtected: z.boolean().default(false),
})

const {
  values,
  errors,
  handleSubmit,
  defineInputBinds,
  setFieldValue,
  useFieldModel,
  isFieldTouched,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    name: '',
    description: '',
    scriptType: Script.native_segwit,
    xpub: '',
    fingerprint: '',
    passphraseProtected: true,
  },
})

const inputOptions = { validateOnInput: true }
const name = defineInputBinds('name', inputOptions)
const description = defineInputBinds('description', inputOptions)
const xpub = defineInputBinds('xpub', inputOptions)
const fingerprint = defineInputBinds('fingerprint', inputOptions)
const scriptType = defineInputBinds('scriptType', inputOptions)
const passphraseProtectedModel = useFieldModel('passphraseProtected')

const fieldError = (field: keyof typeof values) => {
  return isFieldTouched(field) && errors.value[field!]
}

const { scriptOptions, getScriptValue } = useBitcoinScripts()
const selectedScriptType = computed({
  get: () => {
    return getScriptValue(scriptType.value.value)
  },
  set: (selected) => {
    setFieldValue('scriptType', selected?.value)
  }
})

const onSubmit = handleSubmit(
  (values) => {
    console.log('✅ success', values)
  },
  (values) => {
    console.log('⚠️ error', values)
  }
)
</script>

<template>
  <div>
    <form class="mt-8 flex flex-col gap-4" @submit.prevent="onSubmit">
      <UFormGroup label="Wallet name" :error="fieldError('name')">
        <UInput v-bind="name" />
      </UFormGroup>
      isFieldTouched: {{ isFieldTouched('name') }}

      <UFormGroup label="Wallet description" :error="fieldError('description')">
        <UInput v-bind="description" />
      </UFormGroup>

      <UFormGroup label="xpub" hint="Extended private key" :error="fieldError('xpub')">
        <UTextarea v-bind="xpub" placeholder="xpub" />
      </UFormGroup>

      <UFormGroup
        label="Master fingerprint"
        :error="fieldError('fingerprint')"
      >
        <UInput v-bind="fingerprint" error placeholder="00000000" max="6" />
      </UFormGroup>

      <UFormGroup label="Passphrase protected">
        <UToggle
          v-model="passphraseProtectedModel"
          on-icon="i-heroicons-lock-closed"
          off-icon="i-heroicons-lock-open"
        />
      </UFormGroup>

      <UFormGroup label="Script type" class="max-w-sm">
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

      <div class="flex justify-end gap-3">
        <UButton color="white" variant="solid" @click="resetForm">
          Revert
        </UButton>

        <UButton type="submit">
          Create
        </UButton>
      </div>
    </form>
  </div>
</template>

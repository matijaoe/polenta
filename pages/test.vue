<script lang="ts" setup>
const validationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(40, 'Name must be at most 40 characters'),
  description: z.string().optional(),
  xpub: z.string()
    .refine(validateXpubClientSide, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
    .transform((fp) => fp.toLowerCase())
    .optional(),
  passphraseProtected: z.boolean().refine((v) => v === true),
})

const {
  defineInputBinds,
  handleSubmit,
  errors,
  values,
  isFieldTouched,
  resetForm,
  useFieldModel,
} = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    name: '',
    description: '',
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
const passphraseProtectedModel = useFieldModel('passphraseProtected')

const fieldError = (field: keyof typeof values) => {
  return isFieldTouched(field) && errors.value[field!]
}

const onSubmit = handleSubmit((values) => {
  console.log('✅ success', values)
}, (values) => {
  console.log('⚠️ error', values)
})
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
        <UInput v-bind="fingerprint" error placeholder="00000000" />
      </UFormGroup>

      <UFormGroup label="Passphrase protected">
        <UToggle
          v-model="passphraseProtectedModel"
          on-icon="i-heroicons-lock-closed"
          off-icon="i-heroicons-lock-open"
        />
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

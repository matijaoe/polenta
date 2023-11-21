<script lang="ts" setup>
import { z } from 'zod'
import { Script } from '~/models'

const deviceStore = useDeviceStore()

const validationSchema = z.object({
  name: z.string().min(3).max(40),
  description: z.string().optional(),
  scriptType: z.nativeEnum(Script),
  passphraseProtected: z.boolean().default(false),
  xpub: z.string()
    .refine(validateXpubClientSide, 'Invalid xpub'),
  fingerprint: z
    .string()
    .regex(fingerprintRegex, 'Fingerprint must be an 8-digit hex string')
    .transform((fp) => fp.toLowerCase())
    .optional(),
  derivationPath: z.string().regex(derivationPathRegex, 'Invalid derivation path'),
})

const { defineInputBinds, handleSubmit, errors, meta } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    description: '',
    xpub: '',
    fingerprint: '',
    scriptType: Script.native_segwit,
    derivationPath: '',
    passphraseProtected: false,
  }
})

const name = defineInputBinds('name')
const description = defineInputBinds('description')
const scriptType = defineInputBinds('scriptType')
const passphraseProtected = defineInputBinds('passphraseProtected')
const xpub = defineInputBinds('xpub')
const fingerprint = defineInputBinds('fingerprint')
const derivationPath = defineInputBinds('derivationPath')

const selectedDevice = ref<{ id: string; label: string }>()

const tags = ref([
  { id: 'kyc', label: 'KYC' },
  { id: 'no-kyc', label: 'NO KYC' },
  { id: 'light-kyc', label: 'Light KYC' },
  { id: 'compromised', label: 'compromised' },
  { id: 'old', label: 'old' },
  { id: 'inactive', label: 'inactive' },
  { id: 'stolen', label: 'stolen' },
  { id: 'testnet', label: 'testnet' },
])

const selectedTags = ref<{ id: string; label: string }[]>([])

const onSubmit = handleSubmit((values) => {
  console.log('values', values)
})
</script>

<template>
  <div>
    <div>
      <h2 class="text-4xl">
        Add wallet
      </h2>
    </div>

    <form class="mt-8 grid grid-cols-3 gap-8">
      <div class="flex flex-col gap-12" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-4">
          <UFormGroup label="Wallet name" :errors="errors.name">
            <UInput v-bind="name" />
          </UFormGroup>

          <UFormGroup label="Wallet description" :error="errors.description">
            <UInput v-bind="description" />
          </UFormGroup>

          <UFormGroup label="xpub" hint="Extended private key" :error="errors.xpub">
            <UTextarea v-bind="xpub" placeholder="xpub" />
          </UFormGroup>
        </div>

        <UFormGroup
          label="Derivation"
          description="The derivation path to the xpub from the master private key"
          help="m / purpose' / coin_type' / account'"
          :error="errors.derivationPath"
        >
          <UInput v-bind="derivationPath" />
        </UFormGroup>

        <UFormGroup
          label="Master fingerprint"
          :error="errors.fingerprint"
          description="Uniquely identifies this keystore using the first 4 bytes of the master public key hash."
          help="It's safe to use any valid value (00000000) for watch-only wallets."
        >
          <UInput v-bind="fingerprint" error placeholder="00000000" />
        </UFormGroup>

        <UFormGroup
          label="Passphrase protected"
          :error="errors.passphraseProtected"
        >
          <UToggle
            v-bind="passphraseProtected"
            on-icon="i-heroicons-lock-closed"
            off-icon="i-heroicons-lock-open"
            class="mt-2"
          />
        </UFormGroup>

        <div class="flex justify-end gap-3">
          <UButton color="white" variant="solid">
            Revert
          </UButton>

          <UButton>
            Create
          </UButton>
        </div>
      </div>

      <div class="flex flex-col gap-12">
        <div class="flex flex-col gap-4">
          <UFormGroup label="Device">
            <USelectMenu
              v-bind="selectedDevice"
              searchable
              creatable
              :options="deviceStore.devices"
              placeholder="Select devices"
            />
          </UFormGroup>

          <UFormGroup label="Tags">
            <USelectMenu
              v-bind="selectedTags"
              searchable
              multiple
              creatable
              :options="tags"
              placeholder="Select tags"
              searchable-placeholder="Search"
            >
              <template #label>
                <div v-if="selectedTags?.length" class="flex gap-2 overflow-x-auto hide-scrollbar" size="xs">
                  <UBadge
                    v-for="tag in selectedTags"
                    :key="tag.id"
                    class="shrink-0"
                    size="xs"
                  >
                    {{ tag.label }}
                  </UBadge>
                </div>
                <div v-else>
                  Select tags
                </div>
              </template>
            </USelectMenu>
          </UFormGroup>
        </div>
      </div>
    </form>
  </div>
</template>

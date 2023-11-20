<script lang="ts" setup>
import { Script } from '~/models'
import { validateXpubClientSide } from '~/utils'

const deviceStore = useDeviceStore()

const name = ref('')
const description = ref('')

const xpub = ref('')

const { walletTypes, getWalletByType } = useWalletType()

const manualDerivationPathEnabled = ref(false)

const selectedScript = ref(getWalletByType(Script.native_segwit)!)
const withPassphrase = ref(false)

const scriptBranch = ref<number>(selectedScript.value.branch)
const account = ref<number>(0)

const fingerprint = ref('00000000')

function derivationPathBuilder({ purpose, account }: { purpose?: number; account?: number }) {
  return `m/${purpose ?? selectedScript.value.branch ?? 0}'/0'/${account ?? 0}'`
}

const derivationPath = computed(() => {
  return derivationPathBuilder({ purpose: scriptBranch.value, account: account.value })
})

const derivationPathManual = ref('')
const derivationPathManualPlaceholder = computed(() => {
  return derivationPathBuilder({ purpose: scriptBranch.value, account: 0 })
})

watch(selectedScript, (wallet) => {
  set(scriptBranch, wallet.branch)
})

const xpubValid = computed(() => validateXpubClientSide(xpub.value))
const derivationValid = computed(() => validateWalletDerivation(derivationPath.value))
const derivationManualValid = computed(() => validateWalletDerivation(derivationPathManual.value))
const fingerprintValid = computed(() => validateFingerprintFormat(fingerprint.value))
const accountValid = computed(() => isDefined(account) && account.value >= 0)

watch(manualDerivationPathEnabled, (enabled) => {
  if (enabled) {
    set(derivationPathManual, derivationPath.value)
    set(scriptBranch, selectedScript.value.branch)
  } else if (!enabled && derivationManualValid.value) {
    const parts = derivationPathManual.value.split('/')
    const parsedAccount = parts[3].split('\'')[0]
    if (account != null) {
      set(account, Number.parseInt(parsedAccount))
    }
  } else {
    set(account, 0)
  }
})

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
</script>

<template>
  <div>
    <div>
      <h2 class="text-4xl">
        Add wallet
      </h2>
    </div>

    <div class="mt-8 grid grid-cols-3 gap-8">
      <div class="flex flex-col gap-12">
        <div class="flex flex-col gap-4">
          <UFormGroup label="Wallet name">
            <UInput v-model="name" />
          </UFormGroup>

          <UFormGroup label="Wallet description">
            <UInput v-model="description" />
          </UFormGroup>

          <UFormGroup label="xpub" hint="Extended private key" :error="!xpubValid && !!xpub.length">
            <UTextarea v-model="xpub" placeholder="xpub" />
          </UFormGroup>

          <UFormGroup label="Wallet type">
            <USelectMenu
              v-model="selectedScript"
              :options="walletTypes"
            />
          </UFormGroup>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex gap-4 items-center">
            <UToggle v-model="manualDerivationPathEnabled" />
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
              Manual
            </p>
          </div>

          <div v-show="!manualDerivationPathEnabled" class="flex flex-col gap-4">
            <div>
              <UFormGroup
                label="Account number"
                :error="!accountValid"
                :hint=" derivationValid ? derivationPath : undefined"
              >
                <UInput v-model.number.trim="account" :min="0" type="number" placeholder="0" />
              </UFormGroup>
            </div>
            <div />
          </div>

          <div v-show="manualDerivationPathEnabled">
            <UFormGroup
              label="Derivation"
              description="The derivation path to the xpub from the master private key"
              help="m / purpose' / coin_type' / account'"
              :error="!derivationManualValid"
            >
              <UInput v-model="derivationPathManual" :placeholder="derivationPathManualPlaceholder" />
            </UFormGroup>
          </div>
        </div>

        <div>
          <UFormGroup
            label="Master fingerprint"
            :error="!fingerprintValid"
            description="Uniquely identifies this keystore using the first 4 bytes of the master public key hash."
            help="It's safe to use any valid value (00000000) for watch-only wallets."
          >
            <UInput v-model="fingerprint" error placeholder="00000000" />
          </UFormGroup>
        </div>

        <div class="flex gap-4 items-center">
          <UFormGroup label="Passphrase protected">
            <UToggle
              v-model="withPassphrase"
              on-icon="i-heroicons-lock-closed"
              off-icon="i-heroicons-lock-open"
              class="mt-2"
            />
          </UFormGroup>
        </div>

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
              v-model="selectedDevice"
              searchable
              creatable
              :options="deviceStore.devices"
              placeholder="Select devices"
            />
          </UFormGroup>

          <UFormGroup label="Tags">
            <USelectMenu
              v-model="selectedTags"
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
    </div>
  </div>
</template>

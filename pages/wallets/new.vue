<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { validateFingerprint, validateWalletDerivation, validateXpub } from '~/utils'

const name = ref('')
const description = ref('')

const xpub = ref('')
const qrCode = useQRCode(xpub)

const { walletTypes, getWalletByType } = useWalletType()

const manualDerivationPathEnabled = ref(false)

const selectedScript = ref(getWalletByType('native-segwit')!)
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
  scriptBranch.value = wallet.branch
})

const xpubValid = computed(() => validateXpub(xpub.value))
const derivationValid = computed(() => validateWalletDerivation(derivationPath.value))
const derivationManualValid = computed(() => validateWalletDerivation(derivationPathManual.value))
const fingerprintValid = computed(() => validateFingerprint(fingerprint.value))
const accountValid = computed(() => isDefined(account) && account.value >= 0)

watch(manualDerivationPathEnabled, (enabled) => {
  if (enabled) {
    derivationPathManual.value = derivationPath.value
    scriptBranch.value = selectedScript.value.branch
  } else if (!enabled && derivationManualValid.value) {
    const parts = derivationPathManual.value.split('/')
    const parsedAccount = parts[3].split('\'')[0]
    if (account != null)
      account.value = Number.parseInt(parsedAccount)
  } else {
    account.value = 0
  }
})
</script>

<template>
  <div>
    <div>
      <h2 class="text-4xl">
        Add wallet
      </h2>
    </div>

    <div class="mt-8 grid grid-cols-3 gap-8">
      <div class="flex flex-col gap-14">
        <div class="flex flex-col gap-4">
          <UFormGroup label="Name">
            <UInput v-model="name" color="gray" />
          </UFormGroup>

          <UFormGroup label="Description">
            <UInput v-model="description" color="gray" />
          </UFormGroup>

          <UFormGroup label="xpub" description="Extended private key" :error="!xpubValid && !!xpub.length">
            <UTextarea v-model="xpub" color="gray" placeholder="xpub" />
          </UFormGroup>

          <UFormGroup label="Wallet type">
            <USelectMenu
              v-model="selectedScript" :options="walletTypes"
            />
          </UFormGroup>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <p class="font-medium text-gray-700 dark:text-gray-200 text-sm" />

            <UFormGroup
              label="Derivation"
              description="The derivation path to the xpub from the master private key."
            >
              <div class="flex gap-4 items-center mt-3">
                <UToggle v-model="manualDerivationPathEnabled" />
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Manual
                </p>
              </div>
            </UFormGroup>
          </div>

          <div v-show="!manualDerivationPathEnabled" class="flex flex-col gap-4">
            <div class="flex gap-2">
              <UFormGroup
                label="Account number"
                class="w-[150px]"
                :error="!accountValid"
              >
                <UInput v-model.number.trim="account" :min="0" type="number" color="gray" placeholder="0" />
              </UFormGroup>

              <UFormGroup
                class="flex-1"
                label="Derivation path"
                :error="!derivationValid"
              >
                <UInput v-model="derivationPath" readonly error :placeholder="derivationPathManualPlaceholder" />
              </UFormGroup>
            </div>
          </div>

          <div v-show="manualDerivationPathEnabled">
            <UFormGroup
              help="m / purpose' / coin_type' / account' / change / index"
              :error="!derivationManualValid"
            >
              <UInput v-model="derivationPathManual" color="gray" :placeholder="derivationPathManualPlaceholder" />
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

      <div>
        <div v-if="xpub" class="flex items-center justify-center">
          <img :src="qrCode">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { validateFingerprint, validateWalletDerivation, validateXpub } from '~/utils'
import type { WalletScriptType } from '~/models'

const name = ref('')
const description = ref('')

const xpub = ref('')
const qrCode = useQRCode(xpub)

const { scriptTypeDerivationMap, walletTypes } = useWalletType()

const manualDerivationPathEnabled = ref(false)

const scriptTypeId = ref<WalletScriptType>('native-segwit')
const scriptType = computed(() => scriptTypeDerivationMap[scriptTypeId.value])
const withPassphrase = ref(false)

const purpose = ref<number>(scriptType.value.branch)
const account = ref<number>(0)

const fingerprint = ref('00000000')

function derivationPathBuilder({ purpose, account }: { purpose?: number; account?: number }) {
  return `m/${purpose ?? scriptType.value.branch ?? 0}'/0'/${account ?? 0}'`
}

const derivationPath = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: account.value })
})

const derivationPathManual = ref('')
const derivationPathManualPlaceholder = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: 0 })
})

whenever(manualDerivationPathEnabled, () => {
  derivationPathManual.value = derivationPath.value
  purpose.value = scriptType.value.branch
})

watch(scriptType, (wallet) => {
  purpose.value = wallet.branch
})

const xpubValid = computed(() => validateXpub(xpub.value))
const derivationValid = computed(() => validateWalletDerivation(derivationPathManual.value))
const fingerprintValid = computed(() => validateFingerprint(fingerprint.value))
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
        </div>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Wallet type">
            <div class="mt-2 flex flex-col gap-2">
              <URadio
                v-for="type in walletTypes"
                :key="type.id"
                v-model="scriptTypeId"
                :label="type.label"
                :value="type.id"
                :help="type.help"
              />
            </div>
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
              <UFormGroup label="Account number" class="w-[150px]">
                <UInput v-model.number.trim="account" :min="0" type="number" color="gray" placeholder="0" />
              </UFormGroup>

              <UFormGroup
                class="flex-1"
                label="Derivation path"
              >
                <UInput v-model="derivationPath" readonly error :placeholder="derivationPathManualPlaceholder" />
              </UFormGroup>
            </div>
          </div>

          <div v-show="manualDerivationPathEnabled">
            <UFormGroup
              help="m / purpose' / coin_type' / account' / change / index"
              :error="!derivationValid"
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

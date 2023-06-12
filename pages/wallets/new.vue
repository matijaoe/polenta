<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'

type ScriptType = 'legacy' | 'segwit' | 'native-segwit' | 'taproot'
const scriptTypeDerivationMap = {
  'legacy': 44,
  'segwit': 49,
  'native-segwit': 84,
  'taproot': 86,
}

const key = ref('')
const qrCode = useQRCode(key)

const manualDerivationPath = ref(false)

const scriptType = ref<ScriptType>('native-segwit')
const withPassphrase = ref(false)

const purpose = ref<number>(scriptTypeDerivationMap[scriptType.value])
const account = ref<number>(0)

const fingerprint = ref('000000')

function derivationPathBuilder({ purpose, account }: { purpose?: number; account?: number }) {
  return `m/${purpose ?? scriptTypeDerivationMap?.[scriptType.value] ?? 0}'/0'/0'/${account ?? 0}`
}

const derivationPath = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: account.value })
})

const derivationPathManual = ref('')
const derivationPathManualPlaceholder = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: 0 })
})

watch(scriptType, (type) => {
  purpose.value = scriptTypeDerivationMap[type]
})

const xpubValid = computed(() => {
  const regex = /^xpub[1-9A-HJ-NP-Za-km-z]{107}$/
  return regex.test(key.value)
})
const derivationValid = computed(() => {
  const regex = /^m\/84'?(\/0'?)?(\/0'?)?(\/0'?)?$/
  return regex.test(derivationPathManual.value)
})
const fingerprintValid = computed(() => {
  const regex = /^[0-9a-fA-F]{6}$/
  return regex.test(fingerprint.value)
})
</script>

<template>
  <div>
    <div>
      <h2 class="text-3xl">
        Add wallet
      </h2>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-8">
      <div class="flex flex-col gap-9">
        <div>
          <p class="mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm" />
          <UFormGroup label="xpub" hint="Extended private key" :error="!xpubValid && !!key.length">
            <UTextarea v-model="key" size="md" color="gray" placeholder="xpub" autoresize />
          </UFormGroup>
        </div>

        <div class="flex flex-col gap-2">
          <UFormGroup label="Wallet type">
            <div class="mt-2 flex flex-col gap-2">
              <URadio v-model="scriptType" label="Legacy" value="legacy" help="Address starts with 1" />
              <URadio v-model="scriptType" label="Segwit" value="segwit" help="Address starts with 3" />
              <URadio v-model="scriptType" label="Native Segwit" value="native-segwit" help="Address starts with bc1q" />
              <URadio v-model="scriptType" label="Taproot" value="taproot" help="Address starts with bc1p" />
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
                <UToggle v-model="manualDerivationPath" />
                <p class="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  Enter manually
                </p>
              </div>
            </UFormGroup>
          </div>

          <div v-show="!manualDerivationPath" class="flex flex-col gap-4">
            <div class="flex gap-2">
              <UFormGroup label="Purpose">
                <UInput v-model="purpose" size="md" type="number" color="gray" placeholder="84" />
              </UFormGroup>

              <UFormGroup label="Account number">
                <UInput v-model="account" :min="0" size="md" type="number" color="gray" placeholder="0" />
              </UFormGroup>
            </div>

            <UFormGroup
              label="Derivation path"
              hint="readonly"
            >
              <UInput v-model="derivationPath" readonly size="md" error :placeholder="derivationPathManualPlaceholder" />
            </UFormGroup>
          </div>

          <div v-show="manualDerivationPath">
            <UFormGroup
              help="m / purpose' / coin_type' / account' / change / index"
              :error="!derivationValid"
            >
              <UInput v-model="derivationPathManual" size="md" color="gray" :placeholder="derivationPathManualPlaceholder" />
            </UFormGroup>
          </div>
        </div>

        <div>
          <UFormGroup
            label="Master fingerprint"
            :error="!fingerprintValid"
            description="Uniquely identifies this keystore using the first 4 bytes of the master public key hash."
            help="It is safe to use any valid value (00000000) for Watch Only Wallets."
          >
            <UInput v-model="fingerprint" size="md" error placeholder="000000" />
          </UFormGroup>
        </div>

        <div class="flex gap-4 items-center">
          <UFormGroup label="Passphrase protected">
            <UToggle v-model="withPassphrase" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" class="mt-2" />
          </UFormGroup>
        </div>
      </div>

      <div>
        <div v-if="key" class="flex items-center justify-center">
          <img :src="qrCode">
        </div>
      </div>
    </div>
  </div>
</template>

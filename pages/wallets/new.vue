<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { validateDerivation, validateFingerprint, validateXpub } from '~/utils'

type ScriptType = 'legacy' | 'segwit' | 'native-segwit' | 'taproot'
const scriptTypeDerivationMap = {
  'legacy': {
    branch: 44,
    extendedKey: 'xpub',
    label: 'Legacy',
    addressFormat: '1',
  },
  'segwit': {
    branch: 49,
    extendedKey: 'ypub',
    label: 'Segwit',
    addressFormat: '3',

  },
  'native-segwit': {
    branch: 84,
    extendedKey: 'zpub',
    label: 'Native Segwit',
    addressFormat: 'bc1q',
  },
  'taproot': {
    branch: 86,
    extendedKey: 'zpub',
    label: 'Taproot',
    addressFormat: 'bc1p',
  },
}

const walletTypes = computed(() => {
  return (Object.keys(scriptTypeDerivationMap) as ScriptType[]).map(key => ({
    label: key,
    id: key,
    help: `Address starts with ${scriptTypeDerivationMap[key].addressFormat}`,
  }))
})

const xpub = ref('')
const qrCode = useQRCode(xpub)

const manualDerivationPath = ref(false)

const scriptType = ref<ScriptType>('native-segwit')
const withPassphrase = ref(false)

const purpose = ref<number>(scriptTypeDerivationMap[scriptType.value].branch)
const account = ref<number>(0)

const fingerprint = ref('000000')

function derivationPathBuilder({ purpose, account }: { purpose?: number; account?: number }) {
  return `m/${purpose ?? scriptTypeDerivationMap?.[scriptType.value].branch ?? 0}'/0'/0'/${account ?? 0}`
}

const derivationPath = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: account.value })
})

const derivationPathManual = ref('')
const derivationPathManualPlaceholder = computed(() => {
  return derivationPathBuilder({ purpose: purpose.value, account: 0 })
})

whenever(manualDerivationPath, () => {
  derivationPathManual.value = derivationPath.value
  const p = scriptTypeDerivationMap[scriptType.value].branch
  purpose.value = p
})

watch(scriptType, (type) => {
  const p = scriptTypeDerivationMap[scriptType.value].branch
  purpose.value = p
})

const xpubValid = computed(() => validateXpub(xpub.value))
const derivationValid = computed(() => validateDerivation(derivationPathManual.value))
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
      <div class="flex flex-col gap-9">
        <div>
          <p class="mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm" />
          <UFormGroup label="xpub" hint="Extended private key" :error="!xpubValid && !!xpub.length">
            <UTextarea v-model="xpub" size="md" color="gray" placeholder="xpub" />
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
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Manual
                </p>
              </div>
            </UFormGroup>
          </div>

          <div v-show="!manualDerivationPath" class="flex flex-col gap-4">
            <UFormGroup label="Account number">
              <UInput v-model.number.trim="account" :min="0" size="md" type="number" color="gray" placeholder="0" />
            </UFormGroup>

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
            <UToggle
              v-model="withPassphrase"
              on-icon="i-heroicons-lock-closed"
              off-icon="i-heroicons-lock-open"
              class="mt-2"
            />
          </UFormGroup>
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

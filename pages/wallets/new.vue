<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'

const key = ref('')

// `qrcode` will be a ref of data URL
const qrcode = useQRCode(key)

const scriptType = ref('native-segwit')
const withPassphrase = ref(false)
</script>

<template>
  <div>
    <div>
      <h2 class="text-3xl">
        Add wallet
      </h2>
    </div>
    <div class="mt-8 grid grid-cols-3 gap-8">
      <div class="flex flex-col gap-8">
        <div>
          <p class="mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm">
            Extended private key (XPUB)
          </p>
          <UTextarea v-model="key" size="xl" color="gray" placeholder="xpub" autoresize />
        </div>
        <div class="flex flex-col gap-2">
          <URadio v-model="scriptType" label="Legacy" value="legacy" help="Address starts with 1" />
          <URadio v-model="scriptType" label="Segwit" value="segwit" help="Address starts with 3" />
          <URadio v-model="scriptType" label="Native Segwit" value="native-segwit" help="Address starts with bc1q" />
          <URadio v-model="scriptType" label="Taproot" value="taproot" help="Address starts with bc1p" />
        </div>
        <div class="flex gap-4 items-center">
          <UToggle v-model="withPassphrase" on-icon="i-heroicons-lock-closed" off-icon="i-heroicons-lock-open" />
          <p class="font-medium text-gray-700 dark:text-gray-200 text-sm">
            With passphrase
          </p>
        </div>
      </div>
      <div>
        <div v-if="key" class="flex items-center justify-center">
          <img :src="qrcode">
        </div>
      </div>
    </div>
  </div>
</template>

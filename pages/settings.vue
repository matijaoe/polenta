<script lang="ts" setup>
const { currencies, currency } = storeToRefs(useCurrencyStore())
</script>

<template>
  <div>
    <h1 class="text-2xl">
      Settings
    </h1>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="flex flex-col gap-4">
        <div class="mt-8 flex justify-start">
          <ColorPreferenceSelect />
        </div>

        <div>
          <ColorPicker />
        </div>

        <div>
          <USelect
            v-model="currency"
            :options="currencies"
            label="Currency"
          />
        </div>
      </div>
    </div>
  </div>
</template>

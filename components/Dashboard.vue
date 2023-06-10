<script lang="ts" setup>
const color = useColorMode()

const { value: colorValue } = toRefs(color)
const isDark = computed(() => colorValue.value === 'dark')

function toggleDark() {
  color.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-4xl text-primary-500">
          xpubhub
        </p>
        <p class="text-sm mt-2 opacity-70">
          Bitcoin account tracker
        </p>
      </div>
      <UButton color="white" variant="solid" @click="toggleDark">
        Toggle theme
      </UButton>
    </div>

    <div class="mt-12">
      <AddressDerivation />
    </div>
  </div>
</template>

<script setup lang="ts">
const { toggleColorMode, colorModeIcon } = useTheme()
</script>

<template>
  <ClientOnly>
    <UButton
      size="sm"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      :icon="colorModeIcon"
      @click="toggleColorMode"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

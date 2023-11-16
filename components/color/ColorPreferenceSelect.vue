<script lang="ts" setup>
const colorOptions = ['system', 'light', 'dark']
</script>

<template>
  <ClientOnly>
    <ColorScheme>
      <USelect v-model="$colorMode.preference" class="mr-4" size="sm" variant="outline" :options="colorOptions" />
    </ColorScheme>
  </ClientOnly>
</template>

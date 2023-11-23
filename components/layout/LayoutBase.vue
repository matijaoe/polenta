<script lang="ts" setup>
defineProps<{
  noPadding?: boolean
  scrollable?: boolean
}>()
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col">
    <TheHeader class="flex-shrink-0" />

    <div class="content-container-height grid grid-cols-[230px_1fr] flex-auto">
      <SidebarMain />
      <div
        class="h-full w-full"
        :class="{
          'p-6 pb-14': !noPadding,
          'overflow-y-auto': scrollable,
        }"
      >
        <slot />
      </div>
    </div>

    <TheFooter class="flex-shrink-0 bg-white dark:bg-gray-900" />
  </div>

  <CommandPalette />
</template>

<style lang="postcss" scoped>
.container-height {
  max-height: calc(100vh - var(--footer-height) - var(--header-height));
  height: 100%;
}
</style>

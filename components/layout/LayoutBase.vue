<template>
  <div class="h-screen w-screen of-hidden">
    <TheHeader />

    <div class="container-height grid grid-cols-[230px_1fr]">
      <SidebarMain />
      <div class="h-full overflow-y-auto w-full">
        <slot />
      </div>
    </div>

    <TheFooter />

    <CommandPalette />
  </div>
</template>

<style lang="postcss" scoped>
.container-height {
  height: calc(100vh - var(--footer-height) - var(--header-height));
}
</style>

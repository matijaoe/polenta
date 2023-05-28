<template>
  <div class="h-screen">
    <div class="h-[calc(100vh-25px)] grid grid-cols-[230px_1fr]">
      <SidebarMain />

      <div class="h-full overflow-y-auto">
        <slot />
      </div>
    </div>

    <TheFooter />
  </div>
</template>

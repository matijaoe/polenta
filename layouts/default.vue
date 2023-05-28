<template>
  <div class="h-screen grid grid-cols-[240px_1fr]">
    <SidebarMain class="h-full overflow-y-auto" />
    <div class="h-full overflow-y-auto p-8">
      <slot />
    </div>
  </div>
</template>

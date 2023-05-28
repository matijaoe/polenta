<template>
  <div class="h-screen ">
    <div class="h-[calc(100vh-25px)] grid grid-cols-[260px_1fr]">
      <SidebarMain class="h-full overflow-y-auto" />

      <div class="h-full overflow-y-auto p-8">
        <slot />
      </div>
    </div>

    <TheFooter
      class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700"
    />
  </div>
</template>

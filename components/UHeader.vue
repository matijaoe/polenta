<script lang="ts" setup>
defineProps<{
  links: {
    label: string
    icon: string
    to: RouteLocationRaw
  }[]
}>()

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-4 flex items-center justify-between gap-3 h-[--header-height]">
      <div class=" lg:flex-1 flex items-center gap-1.5">
        <slot name="left" />
      </div>

      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <slot name="right" />

        <button
          type="button"
          class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center lg:hidden"
          aria-label="Open Menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span
            class="i-ph-list-bold flex-shrink-0 h-5 w-5"
            :class="mobileMenuOpen ? 'i-ph-x-bold' : 'i-ph-list-bold'"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
:global(:root) {
  --header-height: 50px;
}
</style>

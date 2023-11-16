<script lang="ts" setup>
import type { RouteLocationRaw } from '#ui-colors/vue-router-stub'

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
    <UContainer class="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-[--header-height]">
      <div class=" lg:flex-1 flex items-center gap-1.5">
        <slot name="left" />
      </div>

      <ul class="items-center gap-x-8 hidden lg:flex">
        <li v-for="(link, i) in links" :key="i">
          <NuxtLink
            active-class="text-primary"
            :href="link.to"
            class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

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
    </UContainer>
  </header>
</template>

<style lang="postcss">
:root {
  --header-height: 64px;
}
</style>

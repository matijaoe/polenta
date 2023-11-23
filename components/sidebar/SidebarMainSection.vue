<script lang="ts" setup>
import type { VerticalNavigationLink } from '@nuxt/ui/dist/runtime/types'
import type { RouteLocationRaw } from 'vue-router/auto'

defineProps<{
  links: VerticalNavigationLink[]
  title?: string
  to?: RouteLocationRaw
}>()
</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <template v-if="title">
        <UButton
          v-if="to"
          :ui="{ font: 'font-bold' }"
          :padded="false"
          size="lg"
          variant="link"
          color="black"
          :to="to"
          class="font-bold"
        >
          {{ title }}
        </UButton>

        <p
          v-else
          class="text-sm font-bold"
        >
          {{ title }}
        </p>
      </template>

      <div v-if="$slots.right" class="ml-auto">
        <slot name="right" />
      </div>
    </div>

    <UVerticalNavigation
      :links="links"
      class="-mx-3 mt-1"
    />
  </section>
</template>

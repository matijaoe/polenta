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
          class="font-bold"
          :to
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
    >
      <template #default="{ link }">
        <div class="flex items-center justify-between gap-1 w-full group" :title="link.label">
          <p class="group-hover:text-primary relative line-clamp-1 text-left">
            {{ link.label }}
          </p>
          <UBadge
            v-if="isDefined(link.index)"
            class="invisible opacity-0 group-hover:visible group-hover:opacity-100"
            size="xs"
            color="primary"
            variant="subtle"
          >
            {{ link.index }}
          </UBadge>
        </div>
      </template>
    </UVerticalNavigation>
  </section>
</template>

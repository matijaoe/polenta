<script lang="ts" setup>
import type { RouteLocationRaw } from '#vue-router'

const colorMode = useColorMode()
const { openCommandPalette } = useCommandPalette()

const links = computed<{
  label: string
  icon: string
  to: RouteLocationRaw
}[]>(() => ([
  {
    label: 'Home',
    icon: 'i-ph-house-bold',
    to: `/`
  },
  {
    label: 'Settings',
    icon: 'i-ph-gear-six-bold',
    to: '/settings'
  }
].filter(Boolean)))

const { metaSymbol } = useShortcuts()
</script>

<template>
  <UHeader :links="links">
    <template #left>
      <NuxtLink to="/">
        <div class="flex items-center gap-2.5">
          <TheLogo />
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <ColorPicker />

      <UTooltip text="Search" :shortcuts="[metaSymbol, 'K']">
        <UButton
          icon="i-ph-magnifying-glass-bold"
          size="sm"
          square
          variant="ghost"
          color="gray"
          @click="openCommandPalette"
        />
      </UTooltip>

      <UTooltip :text="`Switch to ${colorMode.value === 'light' ? 'dark' : 'light'}`" :shortcuts="[metaSymbol, 'J']">
        <ColorModeButton />
      </UTooltip>

      <UTooltip text="GitHub">
        <UButton
          to="https://github.com/matijaoe/polenta"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          size="sm"
          square
          variant="ghost"
          color="gray"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>

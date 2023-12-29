<script lang="ts" setup>
import type { Command, Group } from '~/models'

const {
  isCommandPaletteOpen,
  closeCommandPalette,
  toggleCommandPalette
} = useCommandPalette()

const { colorModeIcon, toggleColorMode } = useTheme()
const { metaSymbol } = useShortcuts()

const pages = computed<Command[]>(() => [
  {
    id: 'home',
    label: 'Home',
    icon: 'i-ph-house-bold',
    to: '/',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'i-ph-gear-six-bold',
    to: '/settings'
  },
  {
    id: 'wallets',
    label: 'Wallets',
    icon: 'i-ph-wallet-bold',
    to: '/wallets'
  },

])

const actions = computed<Command[]>(() => [
  {
    id: 'create-wallet',
    label: 'Create wallet',
    icon: 'i-ph-wallet-bold',
    to: '/wallets/new',
  },
  {
    id: 'change-theme',
    label: 'Change theme',
    icon: colorModeIcon.value,
    click: () => toggleColorMode(),
    shortcuts: [metaSymbol.value, 'J']
  },
])

const groups = computed<Group[]>(() => [
  {
    key: 'pages',
    label: 'Pages',
    commands: pages.value
  },
  {
    key: 'actions',
    label: 'Actions',
    commands: actions.value
  }
])

const onSelect = (option: Command) => {
  closeCommandPalette()
  if (option.click) {
    option.click()
  } else if (option.to) {
    navigateTo(option.to)
  } else if (option.href) {
    navigateTo(option.href, { external: true, open: { target: '_blank' } })
  }
}

defineShortcuts({
  meta_k: () => toggleCommandPalette(),
  meta_j: () => toggleColorMode(),
})
</script>

<template>
  <UModal v-model="isCommandPaletteOpen">
    <UCommandPalette
      :groups
      :ui="{
        wrapper: 'min-h-[--cmd-palette-height] max-h-[--cmd-palette-height]'
      }"
      @update:model-value="onSelect"
    />
  </UModal>
</template>

<style lang="postcss" scoped>
:global(:root) {
  --cmd-palette-height: 22rem;
}
</style>

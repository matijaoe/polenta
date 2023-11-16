<script lang="ts" setup>
const { isCommandPaletteOpen, closeCommandPalette, toggleCommandPalette } = useCommandPalette()
const colorMode = useColorMode()
const toast = useToast()
const { metaSymbol } = useShortcuts()

const pages = [
  {
    id: 'home',
    label: 'Home',
    icon: 'i-ph-house-bold',
    click: () => {
      navigateTo({ name: 'index' })
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'i-ph-gear-six-bold',
    click: () => {
      navigateTo({ name: 'settings' })
    },
  },

]

const actions = [
  { id: 'new-file', label: 'Add new file', icon: 'i-ph-file-text-bold', click: () => toast.add({ title: 'New file added!' }), shortcuts: [metaSymbol.value, 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-ph-folder-plus-bold', click: () => toast.add({ title: 'New folder added!' }), shortcuts: [metaSymbol.value, 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-ph-hash-bold', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: [metaSymbol.value, 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-ph-tag-bold', click: () => toast.add({ title: 'Label added!' }), shortcuts: [metaSymbol.value, 'L'] }
]

const groups = computed(() => [
  {
    key: 'pages',
    label: 'Pages',
    commands: pages
  },
  {
    key: 'actions',
    commands: actions
  }
].filter(Boolean))

function onSelect(option: any) {
  if (option.click) {
    option.click()
  } else if (option.to) {
    navigateTo(option.to)
  } else if (option.href) {
    navigateTo(option.to, { external: true, open: { target: '_blank' } })
  }
  closeCommandPalette()
}

defineShortcuts({
  meta_k: () => toggleCommandPalette(),
  meta_j: () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <div>
    <Header />

    <UContainer class="mt-8 pb-12">
      <main>
        <slot />
      </main>
    </UContainer>
  </div>

  <UModal v-model="isCommandPaletteOpen">
    <UCommandPalette :groups="groups" @update:model-value="onSelect" />
  </UModal>
</template>

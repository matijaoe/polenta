<script lang="ts" setup>
const color = useColorMode()

const { value: colorValue } = toRefs(color)
const isDark = computed(() => colorValue.value === 'dark')

function toggleDark() {
  color.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div>
    <div>
      <p class="text-4xl text-primary-500">
        xpubhub
      </p>
      <p class="text-sm mt-2 opacity-70">
        Bitcoin account tracker
      </p>
    </div>

    <div class="mt-8 flex gap-2">
      <UButton>
        Publish
      </UButton>
      <UButton color="white" variant="solid" @click="toggleDark">
        Toggle theme
      </UButton>
    </div>
  </div>
</template>

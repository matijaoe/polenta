<script lang="ts" setup>
const { primary } = useColor()
</script>

<template>
  <Body class="h-screen h-100dvh font-mono bg-white dark:bg-gray-900 overflow-hidden">
    <NuxtLoadingIndicator
      :throttle="300"
      :color="primary?.hex"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </Body>
</template>

<style lang="postcss">
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.content-container-height {
  height: calc(100vh - var(--footer-height) - var(--header-height));
}
</style>

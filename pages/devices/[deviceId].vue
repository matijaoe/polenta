<script lang="ts" setup>
const route = useRoute()
const deviceId = computed(() => (route.params as { deviceId: string }).deviceId)

const devicesStore = useDeviceStore()

const device = computed(() => devicesStore.getDevice(deviceId.value))
</script>

<template>
  <div
    v-if="device"
  >
    <div class="space-y-4">
      <h2 class="text-3xl">
        {{ device.label }}
      </h2>
    </div>
  </div>
</template>

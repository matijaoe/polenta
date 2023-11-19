import { defineStore } from 'pinia'
import type { Device } from '~/models'

const DEVICES: Device[] = [
  {
    label: 'COLDCARD mk4',
    id: 'MELJOV0SusBuhIsYBwlB7',
  },
  {
    label: 'COLDCARD mk3',
    id: 'BvxHbZz64t9V1J73fIj77',
  },
  {
    label: 'Ledger Nano S Plus',
    id: 'nTK0ha9xrH3TB8OgETBjD',
  },
  {
    label: 'Ledger Nano S',
    id: '3G9CASNIqC646jDQg1xdN',
  },
  {
    label: 'Trezor One',
    id: 'S7CiQYYxBwNMMkfgHQ2zc',
  },
]

export const useDeviceStore = defineStore('devices', () => {
  const devices = ref<Device[]>(DEVICES)

  const getDevice = (deviceId: string) => {
    return devices.value.find((device) => device.id === deviceId)
  }

  const getDevices = (deviceId: string) => {
    return devices.value.filter((device) => device.id === deviceId)
  }

  return {
    devices,
    getDevice,
    getDevices,
  }
})

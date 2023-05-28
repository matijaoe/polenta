import { defineStore } from 'pinia'
import type { Device } from '~/models'

export const useDevicesStore = defineStore('devices', () => {
  const devices: Device[] = [
    {
      label: 'COLDCARD',
      id: 'MELJOV0SusBuhIsYBwlB7',
    },
    {
      label: 'COLDCARD backup',
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

  const getDevice = (deviceId: string) => {
    return devices.find(device => device.id === deviceId)
  }

  const getDevices = (deviceId: string) => {
    return devices.filter(device => device.id === deviceId)
  }

  return {
    devices,
    getDevice,
    getDevices,
  }
})

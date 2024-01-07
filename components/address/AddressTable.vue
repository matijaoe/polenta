<script lang="ts" setup>
type Row = {
  [key: string]: any
  key: string
  sortable?: boolean | undefined
  direction?: 'asc' | 'desc' | undefined
  class?: string | undefined
}

defineProps<{
  rows: Row[]
  loading?: boolean
}>()

const columns = ref([
  {
    key: 'index',
    label: '#',
  },
  {
    key: 'address',
    label: 'address',
  },
  {
    key: 'balance',
    label: 'balance',
  },
  {
    key: 'value',
    label: 'value'
  },
  {
    key: 'txCount',
    label: 'tx count',
  }
])

const navigateToBlockExplorer = (row: Row) => {
  const url = blockExplorerAddressUrl(row.address)
  navigateTo(url, {
    external: true,
    open: { target: '_blank' }
  })
}
</script>

<template>
  <UTable
    :rows
    :columns
    :loading
    @select="navigateToBlockExplorer"
  />
</template>

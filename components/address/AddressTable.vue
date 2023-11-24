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
    key: 'address',
    label: 'Address',
  },
  {
    key: 'balance',
    label: 'Balance',
  },
  {
    key: 'value',
    label: 'Value'
  },
  {
    key: 'txCount',
    label: 'Tx count',
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
    :rows="rows"
    :columns="columns"
    :loading="loading"
    @select="navigateToBlockExplorer"
  />
</template>

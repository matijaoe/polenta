export default defineEventHandler(async () => {
  const { accounts: includeAccounts } = useQueryParams<{ accounts: boolean }>({
    parseBooleans: true
  })

  return db.query.wallet_table.findMany({
    with: includeAccounts ? { accounts: true } : {}
  })
})

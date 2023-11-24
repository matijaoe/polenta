export default defineEventHandler(async () => {
  const { accounts: includeAccounts } = useQueryParams<{ accounts: boolean }>({
    parseBooleans: true
  })

  // TODO: there is probably a better way to do this
  const config = includeAccounts
    ? {
        with: {
          accounts: true
        }
      }
    : {}

  return db.query.wallet_table.findMany(config as unknown as any)
})

import { eq } from 'drizzle-orm'
import { accounts, wallets } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const { accounts: includeAccounts } = useQueryParams<{ accounts: boolean }>({
    parseBooleans: true
  })

  if (includeAccounts) {
    const res = await db.select()
      .from(wallets)
      .leftJoin(accounts, eq(wallets.id, accounts.walletId))
      .groupBy((builder) => builder.wallets.id)

    return db.query.wallets.findMany({
      with: {
        accounts: true
      }
    })

    // TODO: not good, have to group by wallet id
    return res
    // return res.map((row) => ({
    //   ...row.wallets,
    //   accounts: row.accounts
    // }))
  } else {
    const wallet = db.select()
      .from(wallets)
      .get()

    return wallet
  }
})

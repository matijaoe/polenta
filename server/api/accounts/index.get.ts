export default defineEventHandler(() => {
  return db.query.account_table.findMany({
    with: {
      wallet: true,
    }
  })
})

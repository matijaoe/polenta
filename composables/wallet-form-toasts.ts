export const useWalletFormToasts = () => {
  const toast = useToast()

  const createdSuccessfully = (data: { wallet: Wallet; account: Account }) => toast.add({
    title: 'Wallet created successfully',
    description: 'Your new wallet is now ready for use.',
    color: 'green',
    icon: 'i-ph-confetti-bold',
    timeout: 0,
    actions: [
      {
        label: 'Check it out',
        click: () => {
          navigateTo({
            name: 'wallets-walletId-accountId',
            params: {
              accountId: data.account.id,
              walletId: data.wallet.id,
            }
          })
        },
        color: 'green',
        variant: 'solid',
      },
      {
        label: 'See data',
        click: () => {
          alert(JSON.stringify(data, null, 2))
        },
      },
    ]
  })

  // TODO: add a button to navigate to the wallet with that xpub
  // perhaps also show some data of that account in the toast
  const createFailed = (description?: string) => toast.add({
    title: 'Wallet creation failed',
    description,
    color: 'red',
    timeout: 5000,
    icon: 'i-ph-warning-bold',
  })

  const unexpectedError = (error: any) => toast.add({
    title: 'Unable to create your wallet',
    description: 'An unexpected error occurred while creating your wallet. Please try again. If the issue persists, please send us a bug report.',
    color: 'red',
    timeout: 5000,
    icon: 'i-ph-bug-bold',
    actions: [
      {
        label: 'Report a bug',
        click: () => {
          alert('Bug reported')
        },
        color: 'red',
        variant: 'soft'
      },
      {
        label: 'See error',
        click: () => {
          alert(JSON.stringify(error, null, 2))
        }
      }
    ]
  })

  return {
    createdSuccessfully,
    createFailed,
    unexpectedError,
  }
}

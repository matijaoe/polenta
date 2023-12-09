<script lang="ts" setup>
import { generateSlug } from 'random-word-slugs'
import { ErrorCode } from '~/models'

// --------------------------------------
// Form
// --------------------------------------

const route = useRoute('wallets-walletId-new')
const walletId = computed(() => Number.parseInt(route.params.walletId))
const { data: wallet } = await useWallet(walletId)

const {
  defaults,
  values,
  handleSubmit,
  defineField,
  setFieldValue,
  setFieldTouched,
  resetForm,
  fieldError
} = useWalletAccountCreateForm(wallet.value!)
// TODO: is it safe to force wallet to be defined here?

const fieldConfig = { validateOnModelUpdate: true }
const [name, nameProps] = defineField('name', fieldConfig)
const [description, descriptionProps] = defineField('description', fieldConfig)
const [xpub, xpubProps] = defineField('xpub', fieldConfig)
const [fingerprint, fingerprintProps] = defineField('fingerprint', fieldConfig)
const [derivationPath, derivationPathProps] = defineField('derivationPath', fieldConfig)

// --------------------------------------
// Field transformation
// --------------------------------------

watch(fingerprint, (value) => {
  setFieldValue('fingerprint', value?.toUpperCase())
})

// --------------------------------------
// Autofill and clear
// --------------------------------------

const autofillFingerprint = () => {
  setFieldTouched('fingerprint', false)
  setFieldValue('fingerprint', defaults.fingerprint)
}

const defaultDerivationPath = computed(() => {
  // increment last account number (or missing number inbetween)
  // TODO: messy PoC, needs refactoring
  const script = useScript(defaults.script)
  const walletPath = script.value!.derivationPath
  const walletAccounts = wallet.value?.accounts ?? []
  // sort wallet accounts by derivation index, if m/84'/0'/0' and m/84'/0'/1', index is third number
  const lastAccount = walletAccounts.sort((a, b) => {
    const aIdx = Number.parseInt(a.derivationPath.split('/')[3])
    const bIdx = Number.parseInt(b.derivationPath.split('/')[3])
    return bIdx - aIdx
  })[0]
  const accountIdx = lastAccount ? Number.parseInt(lastAccount.derivationPath.split('/')[3]) + 1 : 0
  // replace last number with account index
  const accountPath = walletPath.replace(/\/\d+'$/, `/${accountIdx}'`)
  return accountPath
})

setFieldValue('derivationPath', defaultDerivationPath.value)

const autofillDerivation = () => {
  setFieldTouched('derivationPath', false)
  setFieldValue('derivationPath', defaultDerivationPath.value)
}

const derivationInputBtnActive = useInputFieldBtnActive(['autofillDerivationBtn', 'clearDerivationBtn'])
const fingerprintInputBtnActive = useInputFieldBtnActive(['autofillFingerprintBtn'])

const derivationPathEl = ref<{ input: HTMLInputElement } | null>(null)
const onClearDerivationPath = () => {
  setFieldValue('derivationPath', '')
  derivationPathEl.value?.input.focus()
  setFieldTouched('derivationPath', false)
}

const generateRandomName = () => {
  setFieldTouched('name', false)
  const name = generateSlug(2, { format: 'sentence' })
  setFieldValue('name', name)
}

const autofillRandomName = () => {
  if (name.value !== '') {
    return
  }
  const generatedName = generateSlug(2, { format: 'sentence' })
  setFieldValue('name', generatedName)
}

// ---------------------------------------
// Submit
// --------------------------------------

const toasts = useWalletFormToasts()

const {
  execute: createWallet,
  data: createdData,
  error,
  errorCode,
  isSuccess,
  isLoading,
} = await useCreateWalletAccount(computed(() => ({
  walletId: values.walletId,
  name: name.value,
  description: description.value,
  xpub: xpub.value,
  fingerprint: fingerprint.value,
  derivationPath: derivationPath.value,
}
)))

const onSubmit = handleSubmit(
  async (_values, { resetForm, setFieldError }) => {
    await createWallet()

    if (isSuccess.value && createdData.value) {
      // toasts.createdSuccessfully(createdData.value)
      resetForm()
      refreshNuxtData([FetchKey.Wallets, FetchKey.Accounts, FetchKey.Wallet(createdData.value.walletId)])
      navigateTo({
        name: 'wallets-walletId-accountId',
        params: {
          walletId: createdData.value.walletId,
          accountId: createdData.value.id,
        },
      }, { replace: true })
      return
    }

    if (error.value) {
      console.error(error.value.data)
      if (errorCode.value === ErrorCode.DUPLICATE_XPUB) {
        setFieldError('xpub', 'Wallet with this xpub already exists')
        toasts.createFailed('A wallet with the provided XPUB already exists in your account. Please enter a unique XPUB to create a new wallet.')
        return
      }
      if (errorCode.value === ErrorCode.DUPLICATE_DERIVATION_PATH) {
        setFieldError('derivationPath', 'Wallet with this derivation path already exists')
        toasts.createFailed('A wallet with the provided derivation path already exists in your account. Please enter a unique derivation path to create a new wallet.')
        return
      }
      // TODO: errors when derivation/account idx already exists for this wallet
      toasts.unexpectedError(error.value)
    }
  },
  (ctx) => {
    console.error('⚠️ Validation error', ctx)
  }
)

// --------------------------------------
// Other fluff
// --------------------------------------

const disablePointerEventsUi = computed(() => {
  return { icon: { trailing: { pointer: '' } } }
})

const { metaSymbol } = useShortcuts()
</script>

<template>
  <div>
    <form
      class="max-w-4xl"
      @submit.prevent="onSubmit"
      @keydown.meta.enter="onSubmit"
    >
      <div class="flex flex-col gap-5 max-w-lg">
        <UFormGroup
          size="sm"
          label="Wallet name"
          :error="fieldError('name')"
        >
          <UInput
            v-model="name"
            icon="i-ph-identification-badge"
            v-bind="nameProps"
            autofocus
            :ui="disablePointerEventsUi"
            @keyup.right="autofillRandomName"
          >
            <template #trailing>
              <UTooltip text="Generate random name" :shortcuts="['→']">
                <button
                  tabindex="-1"
                  type="button"
                  class="flex items-center"
                  @click.stop="generateRandomName"
                >
                  <UKbd>
                    <i class="i-ph-shuffle-bold" />
                  </UKbd>
                </button>
              </UTooltip>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup
          size="sm"
          label="Wallet description"
          :error="fieldError('description')"
        >
          <UTextarea v-model="description" v-bind="descriptionProps" />
        </UFormGroup>

        <UFormGroup
          size="sm"
          label="xpub"
          hint="Extended private key"
          :error="fieldError('xpub')"
        >
          <UTextarea v-model="xpub" v-bind="xpubProps" placeholder="xpub" />
        </UFormGroup>

        <UFormGroup
          size="sm"
          label="Master fingerprint"
          :error="!fingerprintInputBtnActive && fieldError('fingerprint')"
        >
          <UInput
            v-model="fingerprint"
            icon="i-ph-fingerprint"
            v-bind="fingerprintProps"
            :placeholder="defaults.fingerprint"
            maxlength="8"
            pattern="[a-fA-F0-9]*"
            :ui="disablePointerEventsUi"
            @keyup.right="autofillFingerprint"
          >
            <template #trailing>
              <UTooltip v-if="fingerprint === ''" text="Set default" :shortcuts="['→']">
                <button
                  id="autofillFingerprintBtn"
                  class="flex items-center"
                  type="button"
                  tabindex="-1"
                  @click.stop="autofillFingerprint"
                >
                  <UKbd>
                    →
                  </UKbd>
                </button>
              </UTooltip>
              <!-- must be here, otherwise leading icons shows up for some weird reason -->
              <div v-else class="invisible" />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup
          size="sm"
          label="Derivation path"
          :error="!derivationInputBtnActive && fieldError('derivationPath')"
        >
          <UInput
            v-bind="derivationPathProps"
            ref="derivationPathEl"
            v-model="derivationPath"
            icon="i-ph-git-branch"
            :placeholder="defaultDerivationPath"
            :ui="disablePointerEventsUi"
            @keyup.right="autofillDerivation"
          >
            <template #trailing>
              <UTooltip v-if="derivationPath === ''" text="Set default" :shortcuts="['→']">
                <button
                  id="autofillDerivationBtn"
                  class="flex items-center"
                  type="button"
                  tabindex="-1"
                  @click="autofillDerivation"
                >
                  <UKbd>
                    →
                  </UKbd>
                </button>
              </UTooltip>

              <UTooltip v-else text="Clear">
                <UButton
                  v-show="derivationPath !== ''"
                  id="clearDerivationBtn"
                  color="gray"
                  variant="link"
                  icon="i-ph-x-bold"
                  :padded="false"
                  tabindex="-1"
                  type="button"
                  size="xs"
                  @click="onClearDerivationPath"
                />
              </UTooltip>
            </template>
          </UInput>
        </UFormGroup>

        <div class="flex justify-end gap-3">
          <UButton type="reset" color="white" variant="solid" @click="resetForm">
            Clear
          </UButton>

          <UTooltip text="Submit" :shortcuts="[metaSymbol, '↵']" :popper="{ placement: 'top' }">
            <UButton type="submit" :loading="isLoading">
              Create
            </UButton>
          </UTooltip>
        </div>
      </div>
    </form>
  </div>
</template>

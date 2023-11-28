<script lang="ts" setup>
import { generateSlug } from 'random-word-slugs'
import { ErrorCode } from '~/models'

const {
  defaults,
  // form
  values,
  handleSubmit,
  setFieldValue,
  setFieldTouched,
  resetForm,
  // fields
  name,
  description,
  xpub,
  fingerprint,
  derivationPath,
  passphraseProtectedModel,
  // ----
  fieldError
} = useWalletCreateForm()

const { scriptOptions, getScriptValue } = useBitcoinScripts()

const selectedScript = computed({
  get: () => getScriptValue(values.scriptType),
  set: (item) => setFieldValue('scriptType', item?.value)
})

watch(() => fingerprint.value, ({ value }) => {
  setFieldValue('fingerprint', value?.toUpperCase())
})

const autofillFingerprint = () => {
  if (values.fingerprint !== '') {
    return
  }
  setFieldValue('fingerprint', defaults.fingerprint)
}

const defaultDerivationPath = computed(() => {
  const scriptType = values.scriptType ?? defaults.script
  const script = useScript(scriptType)
  return script.value!.derivationPath
})

const autofillDerivation = () => {
  if (values.derivationPath !== '') {
    return
  }
  setFieldValue('derivationPath', defaultDerivationPath.value)
}

watchEffect(() => {
  autofillDerivation()
})

const toast = useToast()

const {
  execute: createWallet,
  data: createdData,
  error,
  errorCode,
  isSuccess,
  isLoading,
} = await useCreateWallet(computed(() => ({
  wallet: {
    name: values.name,
    description: values.description,
    scriptType: values.scriptType,
    passphraseProtected: values.passphraseProtected,
  },
  account: {
    name: 'First account',
    xpub: values.xpub,
    fingerprint: values.fingerprint,
    derivationPath: values.derivationPath,
  }
})))

const toasts = {
  createdSuccessfully: () => toast.add({
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
              accountId: createdData.value!.account.id,
              walletId: createdData.value!.wallet.id,
            }
          })
        },
        color: 'green',
        variant: 'solid',
      },
      {
        label: 'See data',
        click: () => {
          alert(JSON.stringify(createdData.value, null, 2))
        },
      },
    ]
  }),
  // TODO: add a button to navigate to the wallet with that xpub
  // perhaps also show some data of that account in the toast
  createFailed: () => toast.add({
    title: 'Wallet creation failed',
    description: 'A wallet with the provided XPUB already exists in your account. Please enter a unique XPUB to create a new wallet.',
    color: 'red',
    timeout: 0,
    icon: 'i-ph-warning-bold',
  }),
  unexpectedError: () => toast.add({
    title: 'Unable to create your wallet',
    description: 'An unexpected error occurred while creating your wallet. Please try again. If the issue persists, please send us a bug report.',
    color: 'red',
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
          alert(JSON.stringify(error.value, null, 2))
        }
      }
    ]
  })
}

const onSubmit = handleSubmit(
  async (_, { resetForm, setFieldError }) => {
    await createWallet()

    if (isSuccess.value && createdData.value) {
      toasts.createdSuccessfully()
      resetForm()
      refreshNuxtData([FetchKey.Wallets, FetchKey.Accounts])
      navigateTo('/')
      return
    }

    if (error.value) {
      console.error(error.value.data)
      if (errorCode.value === ErrorCode.DUPLICATE_XPUB) {
        setFieldError('xpub', 'Wallet with this xpub already exists')
        toasts.createFailed()
        return
      }
      toasts.unexpectedError()
    }
  },
  (context) => {
    console.error('⚠️ Validation error', context)
  }
)

const activeEl = useActiveElement()
const clearDerivationBtnActive = computed(() => {
  return activeEl.value?.id === 'clearDerivationPathBtn'
})

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

const disablePointerEventsUi = computed(() => {
  return { icon: { trailing: { pointer: '' } } }
})
</script>

<template>
  <div>
    <UForm :state="values" class="max-w-4xl" @submit="onSubmit">
      <div class="grid lg:grid-cols-2">
        <div class="flex flex-col gap-5">
          <UFormGroup
            size="sm"
            label="Wallet name"
            :error="fieldError('name')"
          >
            <UInput
              icon="i-ph-identification-badge"
              v-bind="name"
              autofocus
              :ui="disablePointerEventsUi"
            >
              <template #trailing>
                <UTooltip text="Generate random">
                  <UButton
                    id="clearDerivationPathBtn"
                    color="gray"
                    variant="link"
                    icon="i-ph-shuffle-bold"
                    :padded="false"
                    tabindex="-1"
                    type="button"
                    @click.stop="generateRandomName"
                  />
                </UTooltip>
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Wallet description"
            :error="fieldError('description')"
          >
            <UTextarea v-bind="description" />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Script type"
          >
            <USelectMenu
              v-model="selectedScript"
              icon="i-ph-currency-btc"
              :options="scriptOptions"
              by="value"
              option-attribute="label"
            >
              <template #option="{ option, selected }">
                <div class="flex flex-col gap-2 w-full">
                  <p
                    class="flex-1"
                    :class="{
                      'font-bold text-primary': selected
                    }"
                  >
                    {{ option.label }}
                  </p>

                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    Address starts with <span class="font-bold text-gray-500 dark:text-gray-400">{{ option.addressFormat }}</span>
                  </p>
                </div>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="xpub"
            hint="Extended private key"
            :error="fieldError('xpub')"
          >
            <UTextarea v-bind="xpub" placeholder="xpub" />
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Master fingerprint"
            :error="fieldError('fingerprint')"
          >
            <UInput
              icon="i-ph-fingerprint"
              v-bind="fingerprint"
              :placeholder="defaults.fingerprint"
              maxlength="8"
              pattern="[a-fA-F0-9]*"
              :ui="disablePointerEventsUi"
              @keyup.right="autofillFingerprint"
            >
              <template #trailing>
                <UTooltip v-if="fingerprint.value === ''" text="Set default">
                  <button class="flex items-center" type="button" tabindex="-1" @click.stop="autofillFingerprint">
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
            :error="!clearDerivationBtnActive && fieldError('derivationPath')"
          >
            <UInput
              v-bind="derivationPath"
              ref="derivationPathEl"
              icon="i-ph-git-branch"
              :placeholder="defaultDerivationPath"
              :ui="disablePointerEventsUi"
              @keyup.right="autofillDerivation"
            >
              <template #trailing>
                <UTooltip v-if="derivationPath.value === ''" text="Set default">
                  <button class="flex items-center" type="button" tabindex="-1" @click.stop="autofillDerivation">
                    <UKbd>
                      →
                    </UKbd>
                  </button>
                </UTooltip>

                <UTooltip v-else text="Clear">
                  <UButton
                    v-show="derivationPath.value !== ''"
                    id="clearDerivationPathBtn"
                    color="gray"
                    variant="link"
                    icon="i-ph-x"
                    :padded="false"
                    tabindex="-1"
                    type="button"
                    @click.stop="onClearDerivationPath"
                  />
                </UTooltip>
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup
            size="sm"
            label="Passphrase protected"
          >
            <UToggle
              v-model="passphraseProtectedModel"
              on-icon="i-heroicons-lock-closed"
              off-icon="i-heroicons-lock-open"
            />
          </UFormGroup>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <UButton color="white" variant="solid" type="reset" @click="resetForm">
          Clear
        </UButton>

        <UButton type="submit" :loading="isLoading">
          Create
        </UButton>
      </div>
    </UForm>
  </div>
</template>

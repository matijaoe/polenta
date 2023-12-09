<script lang="ts" setup>
import { generateSlug } from 'random-word-slugs'
import { ErrorCode } from '~/models'

// --------------------------------------
// Form
// --------------------------------------

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
  // other
  fieldError
} = useWalletCreateForm()

// --------------------------------------
// Field transformation
// --------------------------------------

const { scriptOptions, getScriptValue } = useBitcoinScripts()

const selectedScript = computed({
  get: () => getScriptValue(values.scriptType),
  set: (item) => setFieldValue('scriptType', item?.value)
})

watch(() => fingerprint.value, ({ value }) => {
  setFieldValue('fingerprint', value?.toUpperCase())
})

// --------------------------------------
// Autofill and clear
// --------------------------------------

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
  setFieldTouched('derivationPath', false)
  setFieldValue('derivationPath', defaultDerivationPath.value)
}

watch(selectedScript, () => {
  autofillDerivation()
})

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
  if (values.name !== '') {
    return
  }
  const name = generateSlug(2, { format: 'sentence' })
  setFieldValue('name', name)
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
} = await useCreateWallet(computed(() => ({
  wallet: {
    name: values.name,
    description: values.description,
    scriptType: values.scriptType,
    passphraseProtected: values.passphraseProtected,
  },
  account: {
    name: 'Account 1',
    xpub: values.xpub,
    fingerprint: values.fingerprint,
    derivationPath: values.derivationPath,
  }
})))

const onSubmit = handleSubmit(
  async (_, { resetForm, setFieldError }) => {
    await createWallet()

    if (isSuccess.value && createdData.value) {
      toasts.createdSuccessfully(createdData.value)
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
    <UForm
      :state="values"
      class="max-w-4xl"
      @submit="onSubmit"
      @keydown.meta.enter="onSubmit"
    >
      <div class="flex flex-col gap-5 max-w-lg">
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
            @keyup.right="autofillRandomName"
          >
            <template #trailing>
              <UTooltip text="Generate random name" :shortcuts="['→']">
                <UButton
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
              <UTooltip v-if="fingerprint.value === ''" text="Set default" :shortcuts="['→']">
                <button
                  id="autofillFingerprintBtn"
                  class="flex items-center"
                  type="button"
                  tabindex="-1"
                  @click="autofillFingerprint"
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
            v-bind="derivationPath"
            ref="derivationPathEl"
            icon="i-ph-git-branch"
            :placeholder="defaultDerivationPath"
            :ui="disablePointerEventsUi"
            @keyup.right="autofillDerivation"
          >
            <template #trailing>
              <UTooltip v-if="derivationPath.value === ''" text="Set default" :shortcuts="['→']">
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
                  v-show="derivationPath.value !== ''"
                  id="clearDerivationBtn"
                  color="gray"
                  variant="link"
                  icon="i-ph-x"
                  :padded="false"
                  tabindex="-1"
                  type="button"
                  @click="onClearDerivationPath"
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

        <div class="flex justify-end gap-3">
          <UButton color="white" variant="solid" type="reset" @click="resetForm">
            Clear
          </UButton>

          <UTooltip text="Submit" :shortcuts="[metaSymbol, '↵']" :popper="{ placement: 'top' }">
            <UButton type="button" :loading="isLoading">
              Create
            </UButton>
          </UTooltip>
        </div>
      </div>
    </UForm>
  </div>
</template>

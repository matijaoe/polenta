import tailwindColors from '#tailwind-config/theme/colors'

export type ColorKey = keyof typeof tailwindColors

export const useColor = () => {
  const appConfig = useAppConfig()
  const { isDark } = useTheme()

  const GRAY_COLORS = ['slate', 'cool', 'zinc', 'neutral', 'stone']
  const COLORS = appConfig.ui.colors.filter((color) => color !== 'primary')

  const colorMapper = (color: string) => ({
    value: color,
    text: color,
    hex: tailwindColors?.[color as ColorKey]?.[isDark.value ? 400 : 500] ?? ''
  })

  const primaryColors = computed(() => COLORS.map(colorMapper))
  const primary = computed({
    get: () => primaryColors.value.find((option) => option.value === appConfig.ui.primary),
    set: (option) => {
      if (!option) {
        return
      }

      appConfig.ui.primary = option.value
      window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.primary)
    }
  })

  const grayColors = computed(() => GRAY_COLORS.map(colorMapper))

  const gray = computed({
    get: () => grayColors.value.find((option) => option.value === appConfig.ui.gray),
    set: (option) => {
      if (!option) {
        return
      }

      appConfig.ui.gray = option.value
      window.localStorage.setItem('nuxt-ui-gray', appConfig.ui.gray)
    }
  })

  return {
    tailwindColors,
    primaryColors,
    primary,
    grayColors,
    gray,
  }
}

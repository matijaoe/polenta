export const useTheme = () => {
  const colorMode = useColorMode()

  const isDark = computed({
    get: () => colorMode.value === 'dark',
    set: () => {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  })

  const toggleColorMode = useToggle(isDark)

  const colorModeIcon = computed(() => {
    return isDark.value ? 'i-ph-sun-bold' : 'i-ph-moon-bold'
  })

  return {
    isDark,
    colorModeIcon,
    toggleColorMode,
  }
}

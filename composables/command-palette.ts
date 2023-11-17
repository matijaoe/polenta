export const useCommandPalette = () => {
  const isCommandPaletteOpen = useState('command-palette', () => false)

  const openCommandPalette = () => {
    set(isCommandPaletteOpen, true)
  }

  const closeCommandPalette = () => {
    set(isCommandPaletteOpen, true)
  }

  const toggleCommandPalette = () => {
    set(isCommandPaletteOpen, !isCommandPaletteOpen.value)
  }

  return {
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette
  }
}

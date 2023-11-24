export const useCommandPalette = () => {
  const isCommandPaletteOpen = useState('command-palette', () => false)

  const toggleCommandPalette = useToggle(isCommandPaletteOpen)

  const openCommandPalette = () => toggleCommandPalette(true)
  const closeCommandPalette = () => toggleCommandPalette(false)

  return {
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette
  }
}

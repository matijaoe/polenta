export const useInputFieldBtnActive = (elementIds: string[]) => {
  const activeEl = useActiveElement()
  return computed(() => {
    const id = activeEl.value?.id
    return id && elementIds.includes(id)
  })
}

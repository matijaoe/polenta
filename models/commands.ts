import type { Command as _Command, Group as _Group } from '@nuxt/ui/dist/runtime/types'
import type { RouteLocationRaw } from '#vue-router'

export type Command = _Command & {
  to?: RouteLocationRaw | null
  href?: string | null
  click?: () => void
}

export type Group = _Group & {
  commands: Command[]
}

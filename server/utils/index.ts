import type { z } from 'zod'

export const extractZodErrorMessage = (err: z.ZodError) => {
  return err.errors.map((error: z.ZodIssue) => {
    if (!error.path?.length) {
      return error.message
    }
    return `Field <${error.path.join('.')}>: ${error.message}`
  }).join('; ')
}

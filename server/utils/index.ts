import type { ParseOptions } from 'query-string'
import queryString from 'query-string'
import type { z } from 'zod'

export const generateIndices = ({ start = 0, count }: { start: number; count: number }) => {
  return Array.from({ length: count }).map((_, i) => start + i)
}

export const formatZodValidationErrorMessage = (err: z.ZodError) => {
  return err.errors.map((error: z.ZodIssue) => {
    if (!error.path?.length) {
      return error.message
    }
    return `Field <${error.path.join('.')}>: ${error.message}`
  }).join('; ')
}

/**
 * Parses the query parameters from the current event and returns them as an object of type T.
 */
export const useQueryParams = <T extends Record<string, any>>(options: ParseOptions = { parseNumbers: true }) => {
  const event = useEvent()
  const params = getQuery<T>(event)

  const parsedParams = queryString.parse(queryString.stringify(params), options)

  return parsedParams as T
}

/**
 * Extracts parameters from the URL path of an H3 event.
 */
export const useParams = <T extends Record<string, string>>(): T => {
  const event = useEvent()
  const params = event.context.params as Record<string, string> | undefined

  if (!params) {
    // Handle the case where params are undefined.
    throw new Error('No parameters found in the event context.')
  }

  return params as T
}

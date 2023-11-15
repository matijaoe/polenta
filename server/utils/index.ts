import { z } from 'zod';
import queryString, { ParseOptions } from 'query-string';
import { H3Event, EventHandlerRequest } from 'h3'

export const generateIndices = ({ start = 0, count }: { start: number, count: number }) => {
  return Array.from({ length: count }).map((_, i) => start + i);
}

export const formatZodValidationErrorMessage = (err: z.ZodError) => {
  return err.errors.map((error: z.ZodIssue) => {
    if (!error.path?.length) {
      return error.message
    }
    return `Field <${error.path.join('.')}>: ${error.message}`
  }).join('; ')
}

export const useQueryParams = <T extends Record<string, any>>(event: H3Event<EventHandlerRequest>, options: ParseOptions = { parseNumbers: true }) => {
  const params = getQuery<T>(event)

  const parsedParams = queryString.parse(queryString.stringify(params), options);

  return parsedParams as T;
}

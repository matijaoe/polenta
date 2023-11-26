import { z } from '#imports'

type OmitFields<T extends z.ZodObject<any, any>> = {
  omit?: Array<keyof T['shape']>
}

export const createUpdateSchema = <T extends z.ZodObject<any, any>>(schema: T, options: OmitFields<T> = {}) => {
  const fields = schema.shape
  const newFields: Record<string, z.ZodTypeAny> = {}
  for (const key in fields) {
    if (options.omit && options.omit.includes(key as keyof T['shape'])) {
      continue
    }
    newFields[key] = fields[key].optional()
  }
  return z.object(newFields) as T
}

export const omitFromSchema = <T extends z.ZodObject<any, any>>(schema: T, fields: Array<keyof T['shape']>) => {
  const newFields: Record<string, z.ZodTypeAny> = {}
  for (const key in schema.shape) {
    if (fields.includes(key as keyof T['shape'])) {
      continue
    }
    newFields[key] = schema.shape[key]
  }
  return z.object(newFields) as T
}

import crypto from 'node:crypto'

export const createHash = (key: any): string => {
  const stringifiedKey = JSON.stringify(key)
  return crypto.createHash('sha1').update(stringifiedKey).digest('hex')
}

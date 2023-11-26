export const addressSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  type: z.union([z.literal(0), z.literal(1)]),
  index: z.number().min(0),
  address: z.string().refine(validateAddress, 'Invalid Bitcoin address'),
  createdAt: z.string().optional(),
})

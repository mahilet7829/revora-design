import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  imageUrl: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const updateProductSchema = createProductSchema.partial();
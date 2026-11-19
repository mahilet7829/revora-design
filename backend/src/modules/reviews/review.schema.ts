import { z } from 'zod';

export const createReviewSchema = z.object({
  name: z.string().min(1, 'Reviewer name is required'),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  productId: z.string().cuid('Invalid product ID format'),
});
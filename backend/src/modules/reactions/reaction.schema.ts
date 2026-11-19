import { z } from 'zod';
import { ReactionType } from '@prisma/client';

export const createReactionSchema = z.object({
  type: z.nativeEnum(ReactionType, { message: 'Invalid reaction type' }),
});

export type CreateReactionInput = z.infer<typeof createReactionSchema>;
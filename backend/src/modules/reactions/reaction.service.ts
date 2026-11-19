import { PrismaClient, ReactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class ReactionService {
  async findByProductId(productId: string) {
    return await prisma.reaction.findMany({
      where: { productId },
    });
  }

  async incrementReaction(productId: string, type: string) {
    return await prisma.reaction.create({
      data: {
        productId,
        type: type as ReactionType,
      },
    });
  }
}
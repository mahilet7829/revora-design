import { prisma } from '../../../prisma/client';

export class ReviewService {
  async findByProductId(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { name: string; comment: string; rating: number; productId: string }) {
    // Ensure product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return prisma.review.create({
      data,
    });
  }

  async delete(id: string) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new Error('Review not found');
    }

    return prisma.review.delete({
      where: { id },
    });
  }
}
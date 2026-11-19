import { prisma } from '../../../prisma/client';
import { Prisma } from '@prisma/client';

export class ProductService {
  async findAll() {
    return prisma.product.findMany({
      include: {
        reactions: true,
        _count: {
          select: { reviews: true, orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: { orderBy: { createdAt: 'desc' } },
        reactions: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    await this.findById(id); // Ensure product exists
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findById(id); // Ensure product exists
    return prisma.product.delete({
      where: { id },
    });
  }
}
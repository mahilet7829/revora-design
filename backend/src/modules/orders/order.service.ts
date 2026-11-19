import { prisma } from '../../../prisma/client';
import { Prisma, OrderStatus } from '@prisma/client';

export class OrderService {
  async findAll() {
    return prisma.order.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async create(data: {
    customerName: string;
    customerPhone: string;
    size: string;
    quantity: number;
    productId: string;
  }) {
    // Verify product exists before creating order
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error('Product not found for this order');
    }

    return prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        size: data.size,
        quantity: data.quantity,
        productId: data.productId,
      },
      include: {
        product: true,
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findById(id); // Ensure order exists

    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        product: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id); // Ensure order exists
    return prisma.order.delete({
      where: { id },
    });
  }
}
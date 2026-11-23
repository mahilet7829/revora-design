import { prisma } from '../../../prisma/client';
import { OrderStatus } from '@prisma/client';

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  productId: string;
  size: string;
  quantity: number;
}

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      const err: any = new Error(`Product not found: ${input.productId}`);
      err.statusCode = 404;
      throw err;
    }

    return prisma.order.create({
      data: {
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.trim(),
        productId: product.id,
        size: input.size.trim(),
        quantity: Number(input.quantity),
        status: OrderStatus.PENDING,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  // Alias for order.controller.ts
  async create(input: CreateOrderInput) {
    return this.createOrder(input);
  }

  async findAll() {
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findById(id);
    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.order.delete({
      where: { id },
    });
  }
}
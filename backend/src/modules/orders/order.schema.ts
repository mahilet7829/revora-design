import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(1, 'Customer phone is required'),
  size: z.string().min(1, 'Size is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  productId: z.string().cuid('Invalid product ID format'),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, { message: 'Invalid order status' }),
});
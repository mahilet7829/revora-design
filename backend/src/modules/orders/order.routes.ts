import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { OrderStatus } from '@prisma/client';

const router = Router();
const orderService = new OrderService();

function getParamId(req: Request): string {
  const rawId = req.params.id;
  return Array.isArray(rawId) ? rawId[0] : String(rawId);
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, customerPhone, productId, size, quantity } = req.body ?? {};

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required.',
      });
    }

    if (!customerPhone || typeof customerPhone !== 'string' || !customerPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone is required.',
      });
    }

    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    if (!size || typeof size !== 'string' || !size.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Size is required.',
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a whole number of at least 1.',
      });
    }

    const order = await orderService.createOrder({
      customerName,
      customerPhone,
      productId,
      size,
      quantity: qty,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.findAll();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req);
    const order = await orderService.findById(id);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req);
    const { status } = req.body ?? {};
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${Object.values(OrderStatus).join(', ')}`,
      });
    }

    const updated = await orderService.updateStatus(id, status as OrderStatus);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParamId(req);
    await orderService.delete(id);
    return res.status(200).json({
      success: true,
      message: 'Order deleted.',
    });
  } catch (error) {
    next(error);
  }
});

export const orderRoutes = router;
export default router;
import { Router } from 'express';
import { OrderController } from './order.controller';
import { validate } from '../../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './order.schema';

const router = Router();
const controller = new OrderController();

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.post('/', validate(createOrderSchema), controller.createOrder);
router.patch('/:id/status', validate(updateOrderStatusSchema), controller.updateOrderStatus);
router.delete('/:id', controller.deleteOrder);

export const orderRoutes = router;
import { Request, Response } from 'express';
import { OrderService } from './order.service';

const orderService = new OrderService();

export class OrderController {
  async getOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.findAll();
      return res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const order = await orderService.findById(id);
      return res.status(200).json({ success: true, data: order });
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const order = await orderService.create(req.body);
      return res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updatedOrder = await orderService.updateStatus(id, status);
      return res.status(200).json({ success: true, data: updatedOrder });
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 400;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await orderService.delete(id);
      return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
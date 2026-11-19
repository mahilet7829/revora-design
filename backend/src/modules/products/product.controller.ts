import { Request, Response } from 'express';
import { ProductService } from './product.service';

const productService = new ProductService();

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.findAll();
      return res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.findById(id);
      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      const status = error.message === 'Product not found' ? 404 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const product = await productService.update(id, req.body);
      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      const status = error.message === 'Product not found' ? 404 : 400;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await productService.delete(id);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      const status = error.message === 'Product not found' ? 404 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
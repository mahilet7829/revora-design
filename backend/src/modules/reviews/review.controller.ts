import { Request, Response } from 'express';
import { ReviewService } from './review.service';

const reviewService = new ReviewService();

export class ReviewController {
  async getReviewsByProduct(req: Request, res: Response) {
    try {
      const productId = req.params.productId as string;
      const reviews = await reviewService.findByProductId(productId);
      return res.status(200).json({ success: true, data: reviews });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const review = await reviewService.create(req.body);
      return res.status(201).json({ success: true, data: review });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await reviewService.delete(id);
      return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error: any) {
      const status = error.message === 'Review not found' ? 404 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
import { Request, Response } from 'express';
import { ReactionService } from './reaction.service';

const reactionService = new ReactionService();

export class ReactionController {
  async getReactions(req: Request, res: Response) {
    try {
      const productId = req.params.productId as string;
      const reactions = await reactionService.findByProductId(productId);
      return res.status(200).json({ success: true, data: reactions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async react(req: Request, res: Response) {
    try {
      const productId = req.params.productId as string;
      const { type } = req.body;
      const reaction = await reactionService.incrementReaction(productId, type);
      return res.status(200).json({ success: true, data: reaction });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
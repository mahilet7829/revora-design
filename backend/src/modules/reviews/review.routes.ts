import { Router } from 'express';
import { ReviewController } from './review.controller';
import { validate } from '../../middleware/validate.middleware';
import { createReviewSchema } from './review.schema';

const router = Router();
const controller = new ReviewController();

router.get('/product/:productId', controller.getReviewsByProduct);
router.post('/', validate(createReviewSchema), controller.createReview);
router.delete('/:id', controller.deleteReview);

export const reviewRoutes = router;
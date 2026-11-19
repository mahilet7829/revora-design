import { Router } from 'express';
import { ReactionController } from './reaction.controller';
import { validate } from '../../middleware/validate.middleware';
import { createReactionSchema } from './reaction.schema';

const router = Router();
const controller = new ReactionController();

router.get('/product/:productId', controller.getReactions);
router.post('/product/:productId', validate(createReactionSchema), controller.react);

export const reactionRoutes = router;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productRoutes } from './modules/products/product.routes';
import { orderRoutes } from './modules/orders/order.routes';
import { reactionRoutes } from './modules/reactions/reaction.routes';
import { reviewRoutes } from './modules/reviews/review.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount all routes under /api
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
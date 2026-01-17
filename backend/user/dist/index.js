import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectDb from './config/db.js';
import { createClient } from 'redis';
import userRoutes from './routes/user.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import cors from 'cors';
dotenv.config();
connectDb();
connectRabbitMQ();
if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
}
export const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.connect().then(() => console.log('Connected to Redis')).catch((err) => {
    console.error('Failed to connect to Redis', err);
    process.exit(1);
});
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", userRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`User service is running on port ${port}`);
});
//# sourceMappingURL=index.js.map
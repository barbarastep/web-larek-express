import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import { DB_ADDRESS, PORT } from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(productRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(orderRoutes);
app.use(errorLogger);
app.use(errors());
app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT, () => {});
  })
  .catch(() => process.exit(1));
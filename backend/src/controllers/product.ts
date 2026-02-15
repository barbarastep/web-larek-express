import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

const productValidationMessage = 'Ошибка валидации данных при создании товара';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({});
    res.send({ items, total: items.length });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError(productValidationMessage));
      return;
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким title уже существует'));
      return;
    }

    next(error);
  }
};

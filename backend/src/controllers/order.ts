import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

type Payment = 'card' | 'online';

interface CreateOrderBody {
  payment: Payment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const orderValidationMessage = 'Ошибка валидации данных при создании заказа';

const createOrder = async (
  req: Request<unknown, unknown, CreateOrderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!payment || !email || !phone || !address) {
      throw new BadRequestError(orderValidationMessage);
    }
    if (payment !== 'card' && payment !== 'online') {
      throw new BadRequestError(orderValidationMessage);
    }
    if (typeof total !== 'number' || Number.isNaN(total)) {
      throw new BadRequestError(orderValidationMessage);
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError(orderValidationMessage);
    }
    if (items.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new BadRequestError(orderValidationMessage);
    }

    const products = await Product.find({ _id: { $in: items } }).select('price');

    if (products.length !== items.length) {
      throw new BadRequestError(orderValidationMessage);
    }
    if (products.some((p) => p.price === null)) {
      throw new BadRequestError(orderValidationMessage);
    }

    const sum = products.reduce((acc, p) => acc + (p.price as number), 0);
    if (sum !== total) throw new BadRequestError(orderValidationMessage);

    res.send({ id: faker.string.uuid(), total });
  } catch (error) {
    next(error);
  }
};

export default createOrder;

import { Request, Response, NextFunction } from 'express';

type ErrorWithStatus = Error & { statusCode?: number };

export default (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as ErrorWithStatus;
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : error.message;

  res.status(statusCode).send({ message });
};

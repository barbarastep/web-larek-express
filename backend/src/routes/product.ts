import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product';
import { validateCreateProduct } from '../middlewares/validations';

const router = Router();

router.get('/product', getProducts);
router.post('/product', validateCreateProduct, createProduct);

export default router;

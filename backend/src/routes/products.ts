import express from 'express';
import { createProduct, getProduct, getQuestions, getAllProducts } from '../controllers/productController';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/all', optionalAuth, getAllProducts);
router.get('/questions', getQuestions);
router.post('/', optionalAuth, createProduct);
router.get('/:id', optionalAuth, getProduct);

export default router;
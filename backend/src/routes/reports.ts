import express from 'express';
import { generatePDFReport } from '../controllers/reportController';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

router.post('/:id/pdf', optionalAuth, generatePDFReport);

export default router;
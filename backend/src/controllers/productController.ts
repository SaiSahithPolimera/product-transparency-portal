import { Request, Response } from 'express';
import pool from '../database/connection';
import { ProductSubmission } from '../types';
import { AuthRequest } from '../middleware/auth';
import { validateProductSubmission } from '../utils/validation';

export const createProduct = async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, category, company, description, answers }: ProductSubmission = req.body;
    
    const validationResult = validateProductSubmission(req.body);
    
    if (validationResult.hasErrors()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationResult.getErrorMessages(),
        fieldErrors: validationResult.getErrors()
      });
    }
    
    const userId = req.user?.id || null;
    const productResult = await client.query(
      'INSERT INTO products (name, category, company, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, company, description, userId]
    );
    
    const product = productResult.rows[0];
    
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        await client.query(
          'INSERT INTO answers (product_id, question_id, value) VALUES ($1, $2, $3)',
          [product.id, answer.question_id, answer.value]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    
    const answersResult = await pool.query(`
      SELECT a.*, q.text as question_text, q.type as question_type
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.product_id = $1
      ORDER BY q.id
    `, [id]);
    
    const answers = answersResult.rows;
    
    res.json({
      product,
      answers
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let query: string;
    let params: any[] = [];
    
    if (category) {
      query = 'SELECT * FROM questions WHERE condition IS NULL OR condition @> $1 ORDER BY sort_order, id';
      params = [JSON.stringify({ category })];
    } else {
      query = 'SELECT * FROM questions WHERE condition IS NULL ORDER BY sort_order, id';
    }
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, category, company } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    
    let whereClause = '';
    let params: any[] = [];
    let paramCount = 0;
    
    const conditions = [];
    
    if (category) {
      paramCount++;
      conditions.push(`p.category = $${paramCount}`);
      params.push(category);
    }
    
    if (company) {
      paramCount++;
      conditions.push(`p.company ILIKE $${paramCount}`);
      params.push(`%${company}%`);
    }
    
    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    const productsQuery = `
      SELECT 
        p.*,
        u.email as user_email,
        u.company as user_company
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    params.push(Number(limit), offset);
    
    
    const productsResult = await pool.query(productsQuery, params);
    
    
    const countQuery = `SELECT COUNT(*) FROM products p ${whereClause}`;
    const countParams = params.slice(0, paramCount);
    const countResult = await pool.query(countQuery, countParams);
    const totalProducts = parseInt(countResult.rows[0].count);
    
    
    res.json({
      products: productsResult.rows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        totalProducts,
        hasNext: offset + Number(limit) < totalProducts,
        hasPrev: Number(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
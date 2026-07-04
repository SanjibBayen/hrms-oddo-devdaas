import { param, query } from 'express-validator';

export const objectIdValidator = [
    param('id').isMongoId().withMessage('Invalid ID format'),
];

export const paginationValidator = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const dateValidator = [
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2020 }).toInt(),
];
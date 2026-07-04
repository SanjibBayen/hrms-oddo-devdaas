import { body } from 'express-validator';

export const checkInValidator = [
    body('notes').optional().isLength({ max: 500 }),
];

export const checkOutValidator = [
    body('notes').optional().isLength({ max: 500 }),
];
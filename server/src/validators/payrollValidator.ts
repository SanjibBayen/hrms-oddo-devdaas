import { body } from 'express-validator';

export const generatePayrollValidator = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    body('year').isInt({ min: 2020 }).withMessage('Year must be 2020 or later'),
    body('basicPay').isNumeric().withMessage('Basic pay must be a number'),
    body('allowances').optional().isNumeric(),
    body('deductions').optional().isNumeric(),
    body('bonus').optional().isNumeric(),
];
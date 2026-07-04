import { body } from 'express-validator';

export const signupValidator = [
    body('employeeId')
        .notEmpty().withMessage('Employee ID is required')
        .matches(/^EMP\d{4}$/).withMessage('Employee ID must be EMP followed by 4 digits'),
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('position')
        .notEmpty().withMessage('Position is required'),
    body('department')
        .notEmpty().withMessage('Department is required'),
];

export const loginValidator = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

export const refreshTokenValidator = [
    body('refreshToken')
        .notEmpty().withMessage('Refresh token is required'),
];
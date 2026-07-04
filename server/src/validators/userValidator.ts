import { body } from 'express-validator';

export const updateProfileValidator = [
    body('personalDetails.phone').optional().isMobilePhone('any'),
    body('personalDetails.address').optional().isLength({ max: 200 }),
];

export const updateUserValidator = [
    body('role').optional().isIn(['employee', 'admin', 'super_admin']),
    body('isActive').optional().isBoolean(),
    body('jobDetails.position').optional().notEmpty(),
    body('jobDetails.department').optional().notEmpty(),
];
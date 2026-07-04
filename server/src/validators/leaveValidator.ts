import { body } from 'express-validator';

export const applyLeaveValidator = [
    body('leaveType')
        .isIn(['paid', 'sick', 'unpaid', 'casual']).withMessage('Invalid leave type'),
    body('startDate')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Start date must be YYYY-MM-DD'),
    body('endDate')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('End date must be YYYY-MM-DD'),
    body('reason')
        .isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
        .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
];

export const updateLeaveStatusValidator = [
    body('status')
        .isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
];
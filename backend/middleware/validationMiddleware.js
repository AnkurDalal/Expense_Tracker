const { body, validationResult } = require('express-validator');

// Validation middleware for user registration
const validateRegistration = [
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('profileImageUrl')
        .optional()
        .custom((value) => {
            // Allow null, empty string, or valid URL
            if (!value || value === '') {
                return true;
            }
            // Check if it's a valid URL
            try {
                new URL(value);
                return true;
            } catch (e) {
                throw new Error('Profile image URL must be a valid URL');
            }
        })
];

// Validation middleware for user login
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation middleware for income
const validateIncome = [
    body('source')
        .trim()
        .notEmpty()
        .withMessage('Source is required')
        .isLength({ max: 100 })
        .withMessage('Source cannot exceed 100 characters'),
    
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date'),
    
    body('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string')
];

// Validation middleware for expense
const validateExpense = [
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ max: 100 })
        .withMessage('Category cannot exceed 100 characters'),
    
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date'),
    
    body('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string')
];

// Validation middleware for date range queries
const validateDateRange = [
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateIncome,
    validateExpense,
    validateDateRange,
    handleValidationErrors
};
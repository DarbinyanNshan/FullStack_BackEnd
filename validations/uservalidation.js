const { body } = require('express-validator');
exports.createUser =[
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  body('createdAt').notEmpty().withMessage('Created date is required'),
  body('updatedAt').notEmpty().withMessage('Updated date is required'),
  body('role').notEmpty().withMessage('Role is required'),
];
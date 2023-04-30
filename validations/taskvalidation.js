const { body } = require('express-validator');
exports.createTask =[
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.name').notEmpty().withMessage('Item name is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be greater than 0'),
    body('items.*.price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
  ];
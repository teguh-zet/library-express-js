const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const borrowingController = require('../controllers/borrowingController');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createBorrowingValidation = [
  body('book_id')
    .notEmpty()
    .withMessage('Book ID is required')
    .isUUID()
    .withMessage('Book ID must be a valid UUID'),
  body('member_id')
    .notEmpty()
    .withMessage('Member ID is required')
    .isUUID()
    .withMessage('Member ID must be a valid UUID')
];

/**
 * @swagger
 * /api/borrowings:
 *   post:
 *     summary: Create new book borrowing
 *     tags: [Borrowings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - member_id
 *             properties:
 *               book_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               member_id:
 *                 type: string
 *                 format: uuid
 *                 example: "660e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Borrowing'
 *       400:
 *         description: Book out of stock or member has reached borrowing limit
 *       404:
 *         description: Book or member not found
 */
router.post('/', createBorrowingValidation, handleValidationErrors, borrowingController.createBorrowing);

/**
 * @swagger
 * /api/borrowings/{id}/return:
 *   put:
 *     summary: Process book return
 *     tags: [Borrowings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Borrowing ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Borrowing'
 *       400:
 *         description: Book already returned
 *       404:
 *         description: Borrowing record not found
 */
router.put('/:id/return', borrowingController.returnBorrowing);

module.exports = router;


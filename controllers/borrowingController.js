const borrowingService = require('../services/borrowingService');
const bookService = require('../services/bookService');

const createBorrowing = async (req, res) => {
  try {
    const borrowing = await borrowingService.createBorrowing(req.body);
    
    // Get book details for response
    const book = await bookService.getBookById(borrowing.book_id);
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: {
        ...borrowing,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn
        }
      }
    });
  } catch (error) {
    console.error('Create borrowing error:', error);
    
    const statusCode = 
      error.message === 'Book not found' || error.message === 'Member not found' ? 404 :
      error.message === 'Book is out of stock' || error.message === 'Member cannot borrow more than 3 books' ? 400 :
      500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error creating borrowing',
      error: error.message
    });
  }
};

const returnBorrowing = async (req, res) => {
  try {
    const { id } = req.params;
    
    const borrowing = await borrowingService.returnBorrowing(id);
    
    // Get book details for response
    const book = await bookService.getBookById(borrowing.book_id);
    
    res.json({
      success: true,
      message: 'Book returned successfully',
      data: {
        ...borrowing,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn
        }
      }
    });
  } catch (error) {
    console.error('Return borrowing error:', error);
    
    const statusCode = 
      error.message === 'Borrowing record not found' ? 404 :
      error.message === 'Book has already been returned' ? 400 :
      500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error returning book',
      error: error.message
    });
  }
};

module.exports = {
  createBorrowing,
  returnBorrowing
};


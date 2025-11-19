const bookService = require('../services/bookService');

const getBooks = async (req, res) => {
  try {
    const { title, author, page, limit } = req.query;
    
    const result = await bookService.getBooks({
      title,
      author,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.json(result);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

module.exports = {
  getBooks
};


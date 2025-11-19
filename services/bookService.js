const { query } = require('../config/database');

const getBooks = async (filters = {}) => {
  const { title, author, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      id,
      title,
      author,
      published_year,
      stock,
      isbn,
      CASE WHEN stock > 0 THEN true ELSE false END as available
    FROM books
    WHERE 1=1
  `;
  const params = [];

  if (title) {
    sql += ` AND LOWER(title) LIKE LOWER($${params.length + 1})`;
    params.push(`%${title}%`);
  }

  if (author) {
    sql += ` AND LOWER(author) LIKE LOWER($${params.length + 1})`;
    params.push(`%${author}%`);
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);

  // Get total count
  let countSql = `SELECT COUNT(*) as total FROM books WHERE 1=1`;
  const countParams = [];

  if (title) {
    countSql += ` AND LOWER(title) LIKE LOWER($${countParams.length + 1})`;
    countParams.push(`%${title}%`);
  }

  if (author) {
    countSql += ` AND LOWER(author) LIKE LOWER($${countParams.length + 1})`;
    countParams.push(`%${author}%`);
  }

  const countResult = await query(countSql, countParams);
  const total = parseInt(countResult.rows[0].total);

  return {
    data: result.rows,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getBookById = async (bookId) => {
  const result = await query(
    'SELECT * FROM books WHERE id = $1',
    [bookId]
  );
  return result.rows[0];
};

const updateBookStock = async (bookId, change) => {
  const result = await query(
    'UPDATE books SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [change, bookId]
  );
  return result.rows[0];
};

module.exports = {
  getBooks,
  getBookById,
  updateBookStock
};


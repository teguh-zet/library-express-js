const { pool, query } = require('../config/database');

const createBorrowing = async (borrowingData) => {
  const { book_id, member_id } = borrowingData;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if book exists and has stock
    const bookResult = await client.query(
      'SELECT * FROM books WHERE id = $1',
      [book_id]
    );
    
    if (bookResult.rows.length === 0) {
      throw new Error('Book not found');
    }
    
    const book = bookResult.rows[0];
    if (book.stock <= 0) {
      throw new Error('Book is out of stock');
    }

    // Check if member exists
    const memberResult = await client.query(
      'SELECT * FROM members WHERE id = $1',
      [member_id]
    );
    
    if (memberResult.rows.length === 0) {
      throw new Error('Member not found');
    }

    // Check member's current borrowing count
    const countResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM borrowings 
       WHERE member_id = $1 AND status = 'BORROWED'`,
      [member_id]
    );
    
    const borrowingCount = parseInt(countResult.rows[0].count);
    if (borrowingCount >= 3) {
      throw new Error('Member cannot borrow more than 3 books');
    }

    // Decrease book stock
    await client.query(
      'UPDATE books SET stock = stock - 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [book_id]
    );

    // Create borrowing record
    const borrowDate = new Date().toISOString().split('T')[0];
    const result = await client.query(
      `INSERT INTO borrowings (book_id, member_id, borrow_date, status) 
       VALUES ($1, $2, $3, 'BORROWED') 
       RETURNING *`,
      [book_id, member_id, borrowDate]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const returnBorrowing = async (borrowingId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get borrowing record
    const borrowingResult = await client.query(
      'SELECT * FROM borrowings WHERE id = $1',
      [borrowingId]
    );

    if (borrowingResult.rows.length === 0) {
      throw new Error('Borrowing record not found');
    }

    const borrowing = borrowingResult.rows[0];

    if (borrowing.status === 'RETURNED') {
      throw new Error('Book has already been returned');
    }

    // Increase book stock
    await client.query(
      'UPDATE books SET stock = stock + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [borrowing.book_id]
    );

    // Update borrowing record
    const returnDate = new Date().toISOString().split('T')[0];
    const result = await client.query(
      `UPDATE borrowings 
       SET status = 'RETURNED', return_date = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [returnDate, borrowingId]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getMemberBorrowings = async (memberId, filters = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      b.id,
      b.book_id,
      b.member_id,
      b.borrow_date,
      b.return_date,
      b.status,
      b.created_at,
      b.updated_at,
      json_build_object(
        'id', bk.id,
        'title', bk.title,
        'author', bk.author,
        'published_year', bk.published_year,
        'isbn', bk.isbn
      ) as book
    FROM borrowings b
    INNER JOIN books bk ON b.book_id = bk.id
    WHERE b.member_id = $1
  `;
  const params = [memberId];

  if (status) {
    sql += ` AND b.status = $${params.length + 1}`;
    params.push(status);
  }

  sql += ` ORDER BY b.borrow_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(sql, params);

  // Get total count
  let countSql = `SELECT COUNT(*) as total FROM borrowings WHERE member_id = $1`;
  const countParams = [memberId];

  if (status) {
    countSql += ` AND status = $2`;
    countParams.push(status);
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

module.exports = {
  createBorrowing,
  returnBorrowing,
  getMemberBorrowings
};


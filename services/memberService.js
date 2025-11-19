const { query } = require('../config/database');

const createMember = async (memberData) => {
  const { name, email, phone, address } = memberData;

  // Check if email already exists
  const existingMember = await query(
    'SELECT id FROM members WHERE email = $1',
    [email]
  );

  if (existingMember.rows.length > 0) {
    throw new Error('Email already exists');
  }

  const result = await query(
    `INSERT INTO members (name, email, phone, address) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, phone, address, created_at, updated_at`,
    [name, email, phone, address]
  );

  return result.rows[0];
};

const getMemberById = async (memberId) => {
  const result = await query(
    'SELECT * FROM members WHERE id = $1',
    [memberId]
  );
  return result.rows[0];
};

const getMemberBorrowingCount = async (memberId) => {
  const result = await query(
    `SELECT COUNT(*) as count 
     FROM borrowings 
     WHERE member_id = $1 AND status = 'BORROWED'`,
    [memberId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  createMember,
  getMemberById,
  getMemberBorrowingCount
};


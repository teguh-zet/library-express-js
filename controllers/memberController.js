const memberService = require('../services/memberService');
const borrowingService = require('../services/borrowingService');

const createMember = async (req, res) => {
  try {
    const member = await memberService.createMember(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: member
    });
  } catch (error) {
    console.error('Create member error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating member',
      error: error.message
    });
  }
};

const getMemberBorrowings = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page, limit } = req.query;

    // Check if member exists
    const member = await memberService.getMemberById(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const result = await borrowingService.getMemberBorrowings(id, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    res.json(result);
  } catch (error) {
    console.error('Get member borrowings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching member borrowings',
      error: error.message
    });
  }
};

module.exports = {
  createMember,
  getMemberBorrowings
};


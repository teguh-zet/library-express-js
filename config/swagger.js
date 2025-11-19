const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'API Documentation untuk Library Management System - Technical Test Summit Global Teknologi',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Book ID',
            },
            title: {
              type: 'string',
              description: 'Book title',
            },
            author: {
              type: 'string',
              description: 'Book author',
            },
            published_year: {
              type: 'integer',
              description: 'Year published',
            },
            stock: {
              type: 'integer',
              description: 'Available stock',
            },
            isbn: {
              type: 'string',
              description: 'ISBN number',
            },
            available: {
              type: 'boolean',
              description: 'Is book available (stock > 0)',
            },
          },
        },
        Member: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Member ID',
            },
            name: {
              type: 'string',
              description: 'Member name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Member email',
            },
            phone: {
              type: 'string',
              description: 'Member phone number',
            },
            address: {
              type: 'string',
              description: 'Member address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Borrowing: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            book_id: {
              type: 'string',
              format: 'uuid',
            },
            member_id: {
              type: 'string',
              format: 'uuid',
            },
            borrow_date: {
              type: 'string',
              format: 'date',
            },
            return_date: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['BORROWED', 'RETURNED'],
            },
            book: {
              type: 'object',
              description: 'Book details',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


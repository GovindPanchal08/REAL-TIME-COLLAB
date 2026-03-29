const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
      file: req.file,
    });
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors || error.issues,
    });
  }
};

module.exports = validate;

// Example schemas for reuse
module.exports.authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3).optional(),
  }),
});

module.exports.roomSchema = z.object({
  body: z.object({
    userId: z.string(),
    roomid: z.string().min(1),
  }),
});


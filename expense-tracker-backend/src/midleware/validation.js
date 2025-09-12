const Joi = require('joi');
const summaryValidation = {
  monthlySummary: (req, res, next) => {
    if (req.query.month) {
      const schema = Joi.object({
        month: Joi.string().pattern(/^\d{4}-\d{2}$/).required()
      });
      
      const { error } = schema.validate({ month: req.query.month });
      if (error) {
        return res.status(400).json({ 
          message: 'Invalid month format. Use YYYY-MM' 
        });
      }
    }
    next();
  },
  dateRangeSummary: (req, res, next) => {
    const schema = Joi.object({
      start: Joi.date().required(),
      end: Joi.date().greater(Joi.ref('start')).required()
    });

    const { error } = schema.validate({
      start: req.query.start,
      end: req.query.end
    });

    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    next();
  }
};

module.exports = { summaryValidation };
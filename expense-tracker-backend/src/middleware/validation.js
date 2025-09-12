const Joi = require('joi');

const summaryValidation = {
  monthlySummary: (req, res, next) => {
    const { month } = req.query;
    if (month) {
      const schema = Joi.string()
        .pattern(/^\d{4}-\d{2}$/)
        .required()
        .messages({
          'string.pattern.base': 'Format de mois invalide. Utilisez YYYY-MM',
          'any.required': 'Le mois est requis'
        });

      const { error } = schema.validate(month);
      if (error) return res.status(400).json({ message: error.message });
    }
    next();
  },

  dateRangeSummary: (req, res, next) => {
    const schema = Joi.object({
      start: Joi.date().required().messages({ 'any.required': 'Date de début requise' }),
      end: Joi.date().greater(Joi.ref('start')).required().messages({
        'date.greater': 'La date de fin doit être après la date de début',
        'any.required': 'Date de fin requise'
      })
    });

    const { error } = schema.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
  }
};

module.exports = summaryValidation;

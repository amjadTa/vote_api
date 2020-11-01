const Joi = require('joi');

const validateMiddleware = (schema, property) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);

        if (!result.error) {
            next();
        } else {
            const { details } = result.error;
            const message = details.map(i => i.message).join(',');
            res.status(403).send({ error: message });
        }
    }
}

module.exports = {
    validateMiddleware
};
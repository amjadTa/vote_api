const Joi = require('joi');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^[\x20-\x7E]+$/;
const schemas = {
    login: Joi.object().keys({
        email: Joi.string().regex(EMAIL_REGEX).email().required(),
        password: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        rememberMe:Joi.string().min(0).allow('').allow(null),
    }),

    forgetPass: Joi.object().keys({
        email: Joi.string().regex(EMAIL_REGEX).email().required(),
    }),

    resetPass: Joi.object().keys({
        password: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        confirmPassword: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
    }),
};


module.exports = schemas;
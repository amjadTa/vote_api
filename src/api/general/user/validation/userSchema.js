const Joi = require('joi');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^[\x20-\x7E]+$/;
const schemas = {
    register: Joi.object().keys({
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        email: Joi.string().regex(EMAIL_REGEX).email().required(),
        feedlot_id: Joi.number().integer().required(),
        login: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(10).required(),
        password: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        confirmPassword: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        role: Joi.string().required().valid('vet', 'rider', 'driver', 'checkIn', 'admin'),
    }),

    edit: Joi.object().keys({
        firstName: Joi.string().min(3).max(20).required(),
        lastName: Joi.string().min(3).max(20).required(),
        email: Joi.string().regex(EMAIL_REGEX).email().required(),
        login: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(10).required(),
        role: Joi.string().required().valid('vet', 'rider', 'driver', 'checkIn', 'admin'),
        password: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        confirmPassword: Joi.string().regex(PASSWORD_REGEX).min(6).max(20).required(),
        feedlot_id: Joi.number().integer().required(),
    }),
};


module.exports = schemas;
/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
const schemas = require('./validation/authSchema');
const { validateMiddleware } = require('../../../middleware/validate-middleware');


const AuthService = require('./authService');

const authService = new AuthService();

router.post('/login',
  (req, res) => {
    passport.authenticate(req.body, { session: false }, (err, user) => {

      if (err || !user) {
        return res.status(401).send({
          error: err ? err.message : 'Login or password is wrong',
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        const token = jwt.sign(user, config.get('auth.jwt.secret'));
        return res.send({ user, token });
      });
    }) (req, res);
  });

router.post('/sign-up', async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.send({ message: 'ok' });
    }
    catch (error) {
      //TODO: logger
      res.status(400).send({ error: error.message });
    }
});

router.post('/reset-pass',
[
  validateMiddleware(schemas.resetPass)
],
 async (req, res) => {
  // const { password, confirmPassword, reset_password_token: resetPasswordToken } = req.body;
  // authService
  //   .resetPassword(password, confirmPassword, resetPasswordToken)
  //   .then(() => res.send({ message: 'ok' }))
  //   .catch(err => res.status(400).send({ error: err.message }));
    try {
      const { password, confirmPassword, reset_password_token: resetPasswordToken } = req.body;
      const result = await authService.resetPassword(password, confirmPassword, resetPasswordToken);
      res.send({ message: 'ok' });
    }
    catch (error) {
      //TODO: logger
      res.status(400).send({ error: error.message });
    }
});

router.post('/request-pass',
  [
    validateMiddleware(schemas.forgetPass)
  ],
  async (req, res) => {
    // const { email } = req.body;
    // authService
    //   .requestPassword(email)
    //   .then(() => res.send({ message: `Email with reset password instructions was sent to email ${email}.` }));
      try {
        const { email } = req.body;
        const result = await authService.requestPassword(email);
        res.send({ message: `Email with reset password instructions was sent to email ${email}.` });
      }
      catch (error) {
        //TODO: logger
        res.status(400).send({ error: error.message });
      }
  });

router.post('/sign-out', (req, res) => {
  res.send({ message: 'ok' });
});

// router.post('/refresh-token', (req, res) => {
//
// });

module.exports = router;

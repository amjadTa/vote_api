const express = require('express');

const router = express.Router();
const logger = require('../../../utils/logger');

const schemas = require('./validation/userSchema');

const UserService = require('./userService');
const AuthService = require('../auth/authService');

const userService = new UserService();
const authService = new AuthService();

router.post('/login',
  async (req, res) => {
    try {
      const result = await userService.login(req.body);
      res.send({ result});
    }
    catch (error) {
      const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
      logger.error(loggerMessage);
      res.status(400).send({ error: error.message });
    }
  });

router.post('/sign-up',
  async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.send({ message: 'ok' });
    }
    catch (error) {
      const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
      logger.error(loggerMessage);
      res.status(400).send({ error: error.message });
    }
  });

  router.post('/update_password',
  async (req, res) => {
    try {
      const result = await userService.updatePassword(req.body);
      res.send({ message: 'ok' });
    }
    catch (error) {
      const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
      logger.error(loggerMessage);
      res.status(400).send({ error: error.message });
    }
  });

  router.get('/get_all_users', async (req, res) => {
    try {
      const result = await userService.allUsers();
      res.send(result);
    }
    catch (error) {
      const loggerMessage = 'User: userController, function: post /, message: ' + error.message;
      logger.error(loggerMessage);
      res.status(400).send({ error: error.message });
    }
  });

module.exports = router;

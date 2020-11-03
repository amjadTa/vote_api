/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('config');
const logger = require('./utils/logger');

require('./passport');

// general controllers
const authController = require('./api/general/auth/authController');
const userController = require('./api/general/user/userController');
const voterController = require('./api/general/voters/votersController');

const SeedService = require('./api/seedService');

const seedService = new SeedService();

const app = express();
const { port, root } = config.get('api');

function logErrors(err, req, res, next) {
  logger.error(err);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something went wrong.' });
  } else {
    next(err);
  }
}

app.use(cors());
app.use(bodyParser.json());

const auth = passport.authenticate('jwt', { session: false });

// seed data in case of empty data base
seedService.checkAndSeed();
// routes for general controllers
app.use(`${root}/auth`, authController);
app.use(`${root}/users`, userController);
app.use(`${root}/update`, voterController);

app.use(logErrors);
app.use(clientErrorHandler);
app.get('/', (req, res) => {
  res.send('Hello to Voter Application!');
});

app.listen(port, '0.0.0.0');

//logger.info(`Server start listening port: ${port}`);

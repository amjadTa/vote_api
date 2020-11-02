/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License. 
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

module.exports = {

  api: {
    port: 3001,
    root: '/api',
  },

  auth: {
    jwt: {
      secret: '5edb26e5-ec21-4150-9fde-57735eabba99',
    },
    resetPassword: {
      secret: '27e048c1-5575-4807-873e-5b3775419286',
    },
  },

  db: {
    // url: 'mongodb://localhost:27017/cms-mgm-db',
    url: 'mongodb://192.168.11.14:27017/cms_mgm_db', // production
    // url: 'mongodb://127.0.0.1:27017/cms_mgm_db',
    // url: 'mongodb://192.168.11.105:27017/cms_mgm_db', // Test
    name: 'cms-mgm-db',
  },
};

/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const { ObjectID } = require('mongodb');
const BaseRepository = require('../../../db/baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findByTz(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ tz: id }));
  }

  changePassword(id, salt, passwordHash) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ tz: id }, { $set: { salt, passwordHash } }));
  }


  allUsers() {
    return this.dbClient
    .then(db => db
      .collection(this.collection).find({})
      .toArray());
  }
}

module.exports = UserRepository;

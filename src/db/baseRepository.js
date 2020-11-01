/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const { ObjectID } = require('mongodb');
const moment = require('moment');
const getMongoDBClient = require('../db/mongodbClient');
const dateService = require('../utils/date.service');


class BaseRepository {
  constructor(collectionName) {
    this.dbClient = getMongoDBClient();
    // this.dbCmsLogger = getMongoDBClient();
    this.collection = collectionName;
  }

  async getCountTotalTags(startDate, endDate, feedlot_id) {

    const m_date = moment();
    //var d = m_date.toDate()

    const tags = await this.dbClient
      .then(db => db
        .collection('cms_cows_avg_temp_hourly_v1')
        .distinct('cow_id', { date_created: { $gte: startDate, $lte: endDate }, feedlot_id: parseInt(feedlot_id) }));
    const result = await this.dbClient
      .then(db => db
        .collection('cms_cows_tbl')
        .find({ feedlot_id: parseInt(feedlot_id), cow_id: { $in: tags } }).count());
    return result;
  }

  getCountFiltered(filter) {
    return this.dbClient
      .then(db => {
        // filtering here
        return db.collection(this.collection).countDocuments({});
      });
  }

  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ _id: ObjectID(id) }));
  }

  add(item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertOne(item));
  }

  updateCowStatus(feedlot_id, cow_id, status) {
    return this.dbClient
      .then(db => db
        .collection('cms_cows_tbl')
        .updateOne(
          { cow_id: Number(cow_id), feedlot_id: Number(feedlot_id) },
          {
            $set: { status: status },
            $currentDate: { lastModified: true }
          }
       ));
  }

  updateTagStatus(feedlot_id, cow_id, status) {
    return this.dbClient
      .then(db => db
        .collection('cms_tags_tbl')
        .updateOne(
          { cow_id: Number(cow_id),  feedlot_id: Number(feedlot_id) },
          {
            $set: { status: status },
            $currentDate: { lastModified: true }
          }
       ));
  }

  addMany(items) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertMany(items));
  }

  edit(email, item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ email: email }, { $set: item }, { upsert: true }));
  }

  delete(email) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .remove({ email: email }));
  }

  list() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .find());
  }

  getAmbTagByFeedlot(feedlot_id, pen_id) {
    return this.dbClient
      .then(db => {
        const amb_tag = db.collection("cms_tags_tbl").find({ pen_id: pen_id, feedlot_id: feedlot_id, "tag_type": 'AMB', "active": true },
          { '_id': 0, "tag_id": 1 });
        return amb_tag.toArray();
      });

  }

  listFiltered(filter) {

    if (filter == null) {
      return;
    }

    var st_date = (new Date(filter.fromDate)).toISOString()
    var end_date = (new Date(filter.toDate)).toISOString()

    return this.dbClient
      .then(db => {

        const data = db.collection(this.collection).find({
          date_created: {
            $gt: new Date(st_date.toString()),
            $lt: new Date(end_date.toString())
          },
          feedlot_id: 9999,
          cow_id: Number(filter.cowId),
          pen_id: Number(filter.penId),
          status: filter.status
        },
          { '_id': 0, "cow_id": 1, "avg_temp_body3": 1, "status": 1, "date_created": 1 })
        console.log(data['cmd']['query']);
        return data.toArray();
      });
  }


  async getAmbdata(filter) {
    if (filter == null) {
      return;
    }
    var st_date = moment(new Date(filter.fromDate)).format('YYYY-MM-DD HH:mm:ss');
    var end_date = moment(new Date(filter.toDate)).format('YYYY-MM-DD HH:mm:ss');

    var amb_tag = await this.getAmbTagByFeedlot(Number(filter.feedlot_id), Number(filter.penId));
    return this.dbClient
      .then(db => {

        const data = db.collection('cms_avg_ambient_hourly_v1').find({
          date_created: {
            $gt: new Date(st_date),
            $lt: new Date(end_date)
          },
          feedlot_id: Number(filter.feedlot_id),
          tag_id: Number(amb_tag[0].tag_id),
          pen_id: Number(filter.penId)
        },
          { '_id': 0, "tag_id": 1, "avg_ambient": 1, "status": 1, "date_created": 1 }).sort({ "date_created": 1 });

        return data.toArray();
      });
  }

}

module.exports = BaseRepository;

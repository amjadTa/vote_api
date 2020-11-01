
const { ObjectID } = require('mongodb');
const BaseRepository = require('../../../db/baseRepository');

class VotersRepository extends BaseRepository {
  constructor() {
    super('voters_tbl');
  }

  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ voter_id: id }));
  }

  findByBox(box, index) {
   
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ calphi_number: parseInt(box),  calphi_index: parseInt(index)}));
  }

  calphisNumbers() {
    return this.dbClient
      .then(db => db
        .collection('calphi_tbl')
        .find({}).toArray());
  }

  async circles() {
      const circle1 = await this.dbClient.then(db => db.collection(this.collection)
      .distinct("circle_1"));
      const circle2 = await this.dbClient.then(db => db.collection(this.collection)
      .distinct("circle_2"));
      const result = circle1.concat(circle2);
      return result;
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .distinc({}).toArray());
  }

  UpdateVoter(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ voter_id: id }, { $set: {did_vote: true} }, { upsert: true }));
  }

  updateContactMade(id) {
    return this.dbClient
    .then(db => db
      .collection(this.collection)
      .updateOne({ voter_id: id }, { $set: {contact_made: true} }, { upsert: true }));
  }

  add(item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertOne(item));
  }

  allList(number, circle, light) {
    return this.dbClient
    .then(db => db
      .collection(this.collection)
      .aggregate([
        { $match: { calphi_number: parseInt(number),  '2020_support': light, $or:[{circle_1: circle}, {circle_2: circle}],
            $and: [{cell_number: {$ne: null}}, {cell_number: {$ne: ''}}], did_vote: false,  contact_made: false} },
        { $project: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
        { $group: { _id: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
      ])
      .toArray())
  }

  lightEmptyList(number, circle) {
      const green = 'לין';
      const lightBlue = 'נטיה ללין';
      const yellow1 = 'מתלבט';
      const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
    .then(db => db
      .collection(this.collection)
      .aggregate([
        { $match: { calphi_number: parseInt(number), $or:[{circle_1: circle}, {circle_2: circle}], $and: [{cell_number: {$ne: null}}, {cell_number: {$ne: ''}}],
         did_vote: false,  contact_made: false, $or: [
             {'2020_support': green},
             {'2020_support': lightBlue},
             {'2020_support': yellow1},
             {'2020_support': yellow2}
            ]} },
        { $project: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
        { $group: { _id: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
      ])
      .toArray())
  }

  numberEmptyList(circle, light) {
    return this.dbClient
    .then(db => db
      .collection(this.collection)
      .aggregate([
        { $match: { '2020_support': light, $or:[{circle_1: circle}, {circle_2: circle}],
            $and: [{cell_number: {$ne: null}}, {cell_number: {$ne: ''}}], did_vote: false,  contact_made: false} },
        { $project: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
        { $group: { _id: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
      ])
      .toArray())
  }

  allDefualtsList(circle) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
  return this.dbClient
  .then(db => db
    .collection(this.collection)
    .aggregate([
      { $match: { $or:[{circle_1: circle}, {circle_2: circle}], $and: [{cell_number: {$ne: null}}, {cell_number: {$ne: ''}}],
       did_vote: false,  contact_made: false, $or: [
           {'2020_support': green},
           {'2020_support': lightBlue},
           {'2020_support': yellow1},
           {'2020_support': yellow2}
          ]} },
      { $project: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
      { $group: { _id: { firs_name: '$firs_name', last_name: '$last_name', cell_number:'$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
    ])
    .toArray())
}
}

module.exports = VotersRepository;

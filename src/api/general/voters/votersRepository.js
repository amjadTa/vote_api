
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
        .findOne({ calphi_number: parseInt(box), calphi_index: parseInt(index) }));
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
        .updateOne({ voter_id: id }, { $set: { did_vote: true } }, { upsert: true }));
  }

  didVote(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ voter_id: id, did_vote: true }));
  }

  updateContactMade(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ voter_id: id }, { $set: { contact_made: true } }, { upsert: true }));
  }

  add(item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertOne(item));
  }

  allList(number, circle, light, user_name) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), '2020_support': light, $or: [{ circle_1: circle }, { circle_2: circle }],
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false, assign_to: user_name
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  noCircleToCall(number, light, user_name) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), '2020_support': light,
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false, assign_to: user_name
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  lightEmptyList(number, circle, user_name) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), $or: [{ circle_1: circle }, { circle_2: circle }], $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, assign_to: user_name, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray());
  }

  lightEmptyNoCircleList(number, user_name) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, assign_to: user_name, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  numberEmptyList(circle, light, user_name) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              '2020_support': light, $or: [{ circle_1: circle }, { circle_2: circle }],
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false, assign_to: user_name
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  numberEmptyNoCricleList(light, user_name) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              '2020_support': light,
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false, assign_to: user_name
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  allDefualtsList(circle, user_name) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              $or: [{ circle_1: circle }, { circle_2: circle }], $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, assign_to: user_name, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }
  allDefualtsNoCircleList(user_name) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, assign_to: user_name, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  votersReport(query) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            "$group":
            {
              '_id': {
                "calphi_number": "$calphi_number",
              },
              "count_total_voters": { "$sum": 1 },
              "total_did_votes": { "$sum": { '$cond': ["$did_vote", 1, 0] } },
              "total_2020_lyn_plus_pref": { "$sum": { '$cond': [{ '$in': ["$2020_support", ["נוטה ללין", "לין"]] }, 1, 0] } },
              "count_2020_lyn_plus_pref_precentage": {
                "$sum": {
                  '$cond': [{
                    '$and': [
                      { '$in': ["$2020_support", ["נוטה ללין", "לין"]] },
                      { '$eq': ["$did_vote", true] }
                    ]
                  }, 1, 0]
                }
              }
            }
          },
          {
            '$project': {
              '_id': 0,
              'calphi_number': '$_id.calphi_number',
              'count_total_voters': "$count_total_voters",
              'total_did_votes': "$total_did_votes",
              'total_2020_lyn_plus_pref': '$total_2020_lyn_plus_pref',
              'count_2020_lyn_plus_pref_precentage': '$count_2020_lyn_plus_pref_precentage'
            }
          },
          { '$sort': { 'calphi_number': 1 } }
        ])
        .toArray());
  }

  circlesReport(query) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            "$group":
            {
              '_id': {
                "circle_1": "$circle_1",
              },
              "count_total_circle": { "$sum": 1 },
              "total_did_votes": { "$sum": { '$cond': ["$did_vote", 1, 0] } },
              "total_2020_lyn_plus_pref": { "$sum": { '$cond': [{ '$in': ["$2020_support", ["נוטה ללין", "לין"]] }, 1, 0] } },
            }
          },
          {
            '$project': {
              '_id': 0,
              'circle_1': '$_id.circle_1',
              "count_total_circle": "$count_total_circle",
              'total_did_votes': "$total_did_votes",
              'total_2020_lyn_plus_pref': '$total_2020_lyn_plus_pref',
            }
          },
        ])
        .toArray());
  }

  allListAdmin(number, circle, light) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), '2020_support': light, $or: [{ circle_1: circle }, { circle_2: circle }],
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false,
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  noCircleToCallAdmin(number, light) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), '2020_support': light,
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  lightEmptyNoCircleListAdmin(number) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  lightEmptyListAdmin(number, circle) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              calphi_number: parseInt(number), $or: [{ circle_1: circle }, { circle_2: circle }], $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray());
  }

  numberEmptyNoCricleListAdmin(light) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              '2020_support': light,
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  numberEmptyListAdmin(circle, light) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              '2020_support': light, $or: [{ circle_1: circle }, { circle_2: circle }],
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }], did_vote: false, contact_made: false
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  allDefualtsNoCircleListAdmin() {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }

  allDefualtsListAdmin(circle) {
    const green = 'לין';
    const lightBlue = 'נטיה ללין';
    const yellow1 = 'מתלבט';
    const yellow2 = 'לין או מועמד אחר';
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              $or: [{ circle_1: circle }, { circle_2: circle }], $and: [{ cell_number: { $ne: null } }, { cell_number: { $ne: '' } }],
              did_vote: false, contact_made: false, $or: [
                { '2020_support': green },
                { '2020_support': lightBlue },
                { '2020_support': yellow1 },
                { '2020_support': yellow2 }
              ]
            }
          },
          { $project: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } },
          { $group: { _id: { calphi_number: '$calphi_number', circle_1: '$circle_1', circle_2: '$circle_2', firs_name: '$firs_name', last_name: '$last_name', cell_number: '$cell_number', '2020_support': '$2020_support', voter_id: '$voter_id' } } },
        ])
        .toArray())
  }
}

module.exports = VotersRepository;

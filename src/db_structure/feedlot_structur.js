
db.cms_feedlot_tbl.insert({
    "feedlot_id":9999,
    "feedlot_name":'Yanai',
    "long_lat":{ x: 33.004703, y: 35.558201 },
    "address":"text",
    "state":"text",
    "zipcode":"0000",
    "country":"IL",
    "date_created":ISODate("2019-07-15 13:00:00"),
})

db.cms_pens_tbl.insert({
    "feedlot_id":9998,
    "pen_id":0,
    "long_lat":{ x: 101.0483004, y: 38.4789316  },
    "date_created":ISODate("2018-11-15 13:00:00"),    
})

db.cms_pens_infra_tbl.insert({
    "feedlot_id":9999,
    "pen_id":0,    
    "unit_id":84,
    "unit_type":"FBU",
    "unit_status": "active",
    "unit_start_date": ISODate("2020-01-01 13:00:00"),
})

db.cms_cows_tbl.insert({
    "feedlot_id":9999,
    "pen_id":0,
    "cow_plastic_id":0,
    "cow_id":705,
    "tag_id":705,
    "check_in_date": ISODate("2020-03-13 14:00:00"),
    "check_out_date":ISODate("2020-04-01 13:00:00"),
})


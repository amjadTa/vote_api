db.cms_cows_tbl.createIndex(
    { feedlot_id: 1, pen_id: 1, tag_id: 1 },{ unique: true } )


    db.cow_events_tbl.createIndex(
        { event_id:1 },{ unique: true } )


    
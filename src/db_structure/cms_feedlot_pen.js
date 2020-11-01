db.createCollection( "cms_feedlot_pens", {
    validator: { $jsonSchema: {
       bsonType: "object",
       required: [ "feedlot_id","pen_id" ],
       properties: {
        feedlot_id: {
             bsonType: "int",
             description: "must be a int and is required"
          },
          pen_id: {
             bsonType : "int",             
             description: "must be a integer"
          },
          status: {
             enum: [ "Active", "NotActive" ],
             description: "can only be one of the enum values"
          }
       }
    } },
    validationLevel: "moderate"
 } )
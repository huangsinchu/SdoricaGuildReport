const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'sdoricaguildreport';

module.exports.insert = (collectionName, records, callback) => {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        db.db(dbName).collection(collectionName).insert(records, (err, result) => {
            if (err) throw err;
            callback(result);
        });
        db.close();
    });
}

module.exports.select = (collectionName, criteria, callback) => {
    
}
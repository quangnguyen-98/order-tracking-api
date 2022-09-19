const { DbUrl} = require('./constant');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(DbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;
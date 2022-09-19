const { DbUrl, DbName, httpResponse, MongoCollection, defaultDbOptions } = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const { SUCCESS, ERROR } = httpResponse;
const { Dishes } = MongoCollection;

module.exports = {
    getListDishes: async function (req, res, next) {
        try {
            const { filter, sort, page, pageSize } = req.body;
            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const dishesCollection = db.collection(Dishes);
            let count = await dishesCollection.find(filter).toArray();
            let totalPage = Math.ceil(parseInt(count.length) / pageSize);
            let dishesData = await dishesCollection.find(filter).sort(sort).limit(parseInt(pageSize)).skip(parseInt(pageSize) * parseInt(page)).toArray();

            dbConnection.close();
            res.status(200).json({
                data: dishesData,
                pagination: {
                    page,
                    pageSize,
                    totalPage,
                    totalItem: count.length
                }

            });
        } catch (e) {
            res.status(400).json({
                status: ERROR,
                message: e.toString()
            });
        }
    },
    createDishes: async function (req, res, next) {
        try {
            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const dishesCollection = db.collection(Dishes);

            //Check dishes name exist
            let result = await dishesCollection.find({ name: req.body.name }).next();
            if (result != null) {
                res.status(400).json({
                    status: ERROR,
                    message: 'Dishes already existed!'
                });
            } else {
                let params = {
                    name: req.body.name,
                    price: parseInt(req.body.price),
                    createdDate: moment().toDate(),
                    updatedDate: moment().toDate()
                };
                let result = await dishesCollection.insertOne(params);
                dbConnection.close();
                res.status(200).json({
                    status: SUCCESS,
                    data: result.ops[0]
                });
            }
        } catch (err) {
            res.status(400).json({
                status: ERROR,
                message: err.toString()
            });
        }
    },
    updateDishes: async function (req, res, next) {
        try {
            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const dishesCollection = db.collection(Dishes);

            //Check dishes name exist
            let result = await dishesCollection.find({ _id: { $ne: ObjectId(req.body._id) }, name: req.body.name }).next();
            if (result != null) {
                res.status(400).json({
                    status: ERROR,
                    message: 'Have an Id use this dishes name!'
                });
            } else {
                let result = await dishesCollection.findOneAndUpdate(
                    { _id: ObjectId(req.body._id) },
                    {
                        $set: {
                            name: req.body.name,
                            price: req.body.price,
                            updatedDate: moment().toDate()
                        }
                    },
                    { returnOriginal: false }
                );
                dbConnection.close();
                res.status(200).json({
                    status: SUCCESS,
                    data: result.value
                });
            }
        } catch (err) {
            res.status(400).json({
                status: ERROR,
                message: err.toString()
            });
        }
    },

};
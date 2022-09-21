const { DbUrl, DbName, httpResponse, MongoCollection, defaultDbOptions } = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const { preprocessingHandleFilter } = require('../utils/appUtils');
const { removeAccents } = require('../utils/stringUtils');
const { SUCCESS, ERROR } = httpResponse;
const { Order } = MongoCollection;

module.exports = {
    getListOrder: async function (req, res, next) {
        try {
            const { filter: paramFilter, sort, page, pageSize } = req.body;
            const filter = preprocessingHandleFilter(paramFilter);

            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const orderCollection = db.collection(Order);
            let count = await orderCollection.find(filter).toArray();
            let totalPage = Math.ceil(parseInt(count.length) / pageSize);
            let orderData = await orderCollection.find(filter).sort(sort).limit(parseInt(pageSize)).skip(parseInt(pageSize) * parseInt(page)).toArray();

            dbConnection.close();
            res.status(200).json({
                data: orderData,
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
    createOrder: async function (req, res, next) {
        try {
            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const orderCollection = db.collection(Order);

            const { address, dishes, merchantAddress, merchantName,
                orderName, riderName, status, totalPrice } = req.body;

            let params = {
                address,
                dishes,
                merchantAddress,
                merchantName,
                orderName,
                orderNameLowerCase: removeAccents(orderName),
                riderName,
                status,
                totalPrice: parseInt(totalPrice),
                createdDate: moment().toDate(),
                updatedDate: moment().toDate()
            };

            let result = await orderCollection.insertOne(params);
            dbConnection.close();
            res.status(200).json({
                status: SUCCESS,
                data: result.ops[0]
            });
        } catch (err) {
            res.status(400).json({
                status: ERROR,
                message: err.toString()
            });
        }
    },
    updateOrder: async function (req, res, next) {
        try {
            const dbConnection = new MongoClient(DbUrl, defaultDbOptions);
            await dbConnection.connect();
            const db = dbConnection.db(DbName);
            const orderCollection = db.collection(Order);

            const { address, dishes, merchantAddress, merchantName,
                orderName, riderName, status, totalPrice } = req.body;
            let result = await orderCollection.findOneAndUpdate(
                { _id: ObjectId(req.body._id) },
                {
                    $set: {
                        address,
                        dishes,
                        merchantAddress,
                        merchantName,
                        orderName,
                        orderNameLowerCase: removeAccents(orderName),
                        riderName,
                        status,
                        totalPrice: parseInt(totalPrice),
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
        } catch (err) {
            res.status(400).json({
                status: ERROR,
                message: err.toString()
            });
        }
    },

};
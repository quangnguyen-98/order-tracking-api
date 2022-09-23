const { DbUrl, DbName, HttpResponse, MongoCollection, DefaultDbOptions } = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const { preprocessingHandleFilter } = require('../utils/appUtils');
const { removeAccents } = require('../utils/stringUtils');
const { SUCCESS, ERROR } = HttpResponse;
const { Order } = MongoCollection;

module.exports = {
	getListOrder: async function (req, res, next) {
		try {
			const { filter: paramFilter, sort, page, pageSize } = req.body;
			const filter = preprocessingHandleFilter(paramFilter);
			const dbConnection = new MongoClient(DbUrl, DefaultDbOptions);
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
			const dbConnection = new MongoClient(DbUrl, DefaultDbOptions);
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
				previousStatus: status,
				totalPrice: parseInt(totalPrice),
				createdDate: moment().toDate(),
				updatedDate: moment().toDate(),
				statusUpdatedDate: moment().toDate()
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
			const dbConnection = new MongoClient(DbUrl, DefaultDbOptions);
			await dbConnection.connect();
			const db = dbConnection.db(DbName);
			const orderCollection = db.collection(Order);

			const { _id, address, dishes, merchantAddress, merchantName,
				orderName, riderName, status, totalPrice } = req.body;

			let existingOrder = await orderCollection.find({ _id: ObjectId(_id) }).next();
			const isUpdateOrderStatus = (existingOrder || {}).status !== status;

			let result = await orderCollection.findOneAndUpdate(
				{ _id: ObjectId(_id) },
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
						previousStatus: isUpdateOrderStatus ? existingOrder.status : existingOrder.previousStatus,
						totalPrice: parseInt(totalPrice),
						updatedDate: moment().toDate(),
						statusUpdatedDate: isUpdateOrderStatus ? moment().toDate() : new Date(existingOrder.statusUpdatedDate)
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
const { DbUrl, DbName, HttpResponse, MongoCollection, DefaultDbOptions } = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const { preprocessingHandleFilter } = require('../utils/appUtils');
const { removeAccents } = require('../utils/stringUtils');
const { SUCCESS, ERROR } = HttpResponse;
const { Dishes } = MongoCollection;

module.exports = {
	getDashboardData: async function (req, res, next) {
		try {
			const dbConnection = new MongoClient(DbUrl, DefaultDbOptions);
			await dbConnection.connect();
			const db = dbConnection.db(DbName);
			const dishesCollection = db.collection(Dishes);
			// let count = await dishesCollection.find(filter).toArray();
			// let totalPage = Math.ceil(parseInt(count.length) / pageSize);
			// let dishesData = await dishesCollection.find(filter).sort(sort).limit(parseInt(pageSize)).skip(parseInt(pageSize) * parseInt(page)).toArray();

			dbConnection.close();
			res.status(200).json({
				orderByStatus: {
					count: 3,
					chartData: {
						labels: ['1', '2', '3'],
						series: [1, 2, 3]
					}
				},
				orderByTiming: {
					count: 3,
					chartData: {
						labels: ['4', '5', '6'],
						series: [4, 5, 6]
					}
				}
			});
		} catch (e) {
			res.status(400).json({
				status: ERROR,
				message: e.toString()
			});
		}
	}
};
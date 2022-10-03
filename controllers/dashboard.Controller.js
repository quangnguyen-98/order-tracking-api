const { DbUrl, DbName, HttpResponse, MongoCollection, DefaultDbOptions, OrderStatuses, OrderStatusLabels, LateStatus } = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const { ERROR } = HttpResponse;
const { Order } = MongoCollection;
const { CREATED, ACCEPTED, DRIVERASSIGNED, DELIVERING, DONE, CANCELED } = OrderStatuses;
const { Created, Accepted, DriverAssigned: Driverassigned, Delivering, Done, Canceled } = OrderStatusLabels;
const { Normal, Warning, Late } = LateStatus;

module.exports = {
	getDashboardData: async function (req, res, next) {
		try {
			const dbConnection = new MongoClient(DbUrl, DefaultDbOptions);
			await dbConnection.connect();
			const db = dbConnection.db(DbName);
			const orderCollection = db.collection(Order);

			const totalOrders = await orderCollection.find().toArray();
			const countOrderByStatus = totalOrders.length;

			const createdOrder = totalOrders.filter(item => item.status === CREATED).length;
			const acceptedOrder = totalOrders.filter(item => item.status === ACCEPTED).length;
			const driverassignedOrder = totalOrders.filter(item => item.status === DRIVERASSIGNED).length;
			const deliveringOrder = totalOrders.filter(item => item.status === DELIVERING).length;
			const doneOrder = totalOrders.filter(item => item.status === DONE).length;
			const canceledOrder = totalOrders.filter(item => item.status === CANCELED).length;

			const listSeries = [createdOrder, acceptedOrder, driverassignedOrder, deliveringOrder, doneOrder, canceledOrder];

			const ordersByStatusChart = {
				labels: [Created, Accepted, Driverassigned, Delivering, Done, Canceled],
				series: listSeries,
			};

			// =========

			let normalOrder = 0;
			let warningOrder = 0;
			let lateOrder = 0;

			for (const item of totalOrders) {
				let currentDate = new Date().getTime();
				let itemDate = new Date(item.statusUpdatedDate).getTime();
				let diffTime = ((currentDate - itemDate) / 1000 / 60);

				if ([DELIVERING].includes(item.status)) {
					if (diffTime > 40) {
						lateOrder += 1;
					} else if (diffTime > 30) {
						warningOrder += 1;
					} else {
						normalOrder += 1;
					}
				} else if ([CREATED, ACCEPTED, DRIVERASSIGNED].includes(item.status)) {
					if (diffTime > 15) {
						lateOrder += 1;
					} else if (diffTime > 10) {
						warningOrder += 1;
					} else {
						normalOrder += 1;
					}
				}
			}

			const countOrderByTiming = normalOrder + warningOrder + lateOrder;
			const ordersByTimingChart = {
				labels: [Normal, Warning, Late],
				series: [normalOrder, warningOrder, lateOrder]
			};

			dbConnection.close();
			res.status(200).json({
				countOrderByStatus: countOrderByStatus,
				orderByStatusChart: ordersByStatusChart,
				countOrderByTiming: countOrderByTiming,
				orderByTimingChart: ordersByTimingChart
			});
		} catch (e) {
			res.status(400).json({
				status: ERROR,
				message: e.toString()
			});
		}
	}
};

const calculateLateStatus = () => {
	let currentDate = new Date().getTime();
	let itemDate = new Date(item.statusUpdatedDate).getTime();
	let diffTime = ((currentDate - itemDate) / 1000 / 60);

	let color = '#52c41a';
	let title = 'Normal';

	if ([DELIVERING].includes(item.status)) {
		if (diffTime > 40) {
			return renderLateStatusTag('#cf1322', 'Late');
		};
		if (diffTime > 30) {
			return renderLateStatusTag('#ffc53d', 'Warning');
		};
		return renderLateStatusTag(color, title);
	} else if ([CREATED, ACCEPTED, DRIVERASSIGNED].includes(item.status)) {
		if (diffTime > 15) {
			return renderLateStatusTag('#cf1322', 'Late');
		};
		if (diffTime > 10) {
			return renderLateStatusTag('#ffc53d', 'Warning');
		};
		return renderLateStatusTag(color, title);
	} else if ([DONE, CANCELED].includes(item.status)) {
		return null;
	} else {
		return renderLateStatusTag(color, title);
	}
};
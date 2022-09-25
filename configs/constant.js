/*Contstant--------------------------------------------------------*/
const HttpResponse = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

const MongoCollection = {
	Dishes: 'Dishes',
	Order: 'Order'
};

const OrderStatuses = {
	CREATED: 'CREATED',
	ACCEPTED: 'ACCEPTED',
	DRIVERASSIGNED: 'DRIVERASSIGNED',
	DELIVERING: 'DELIVERING',
	DONE: 'DONE',
	CANCELED: 'CANCELED'
};

const OrderStatusLabels = {
	Created: 'Created',
	Accepted: 'Accepted',
	DriverAssigned: 'Driver Assigned',
	Delivering: 'Delivering',
	Done: 'Done',
	Canceled: 'Canceled'
};

const LateStatus = {
	Normal: 'Normal',
	Warning: 'Warning',
	Late: 'Late',
};

const DbName = 'baeminOrderTracking';

const DefaultDbOptions = {
	useNewUrlParser: true, useUnifiedTopology: true
};

/*Connect DB--------------------------------------------------------*/
let DbUrl = 'mongodb+srv://bb4298:quangdeptrai01@cluster0.waxmu.mongodb.net/?retryWrites=true&w=majority';

module.exports = {
	DbUrl,
	DbName,
	HttpResponse,
	MongoCollection,
	DefaultDbOptions,
	OrderStatuses,
	OrderStatusLabels,
	LateStatus
};

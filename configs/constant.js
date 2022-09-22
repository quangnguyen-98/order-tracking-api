const HttpResponse = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};


const MongoCollection = {
	Dishes: 'Dishes',
	Order: 'Order'
};
/*Contstant--------------------------------------------------------*/
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
	DefaultDbOptions
};



/*Contstant--------------------------------------------------------*/
const DbName = 'baeminOrderTracking';

/*Connect DB--------------------------------------------------------*/
let DbUrl;
if (process.env.NODE_ENV === 'development') { DbUrl = 'mongodb://localhost:27017'; } //mongodb://localhost:27017
if (process.env.NODE_ENV === 'production') { DbUrl = 'mongodb+srv://bb4298:quangdeptrai01@cluster0.waxmu.mongodb.net/?retryWrites=true&w=majority'; }

module.exports = {
    DbUrl,
    DbName,
};

const {DbUrl, DbName} = require('../configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
module.exports = {
    getOrders: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        const {filter, sort, page, pagesize} = req;
       // console.log(JSON.stringify({filter, page, pagesize}));
        try {
            await client.connect();
            const db = client.db(DbName);
            const colOrder = db.collection('Order');
            let count = await colOrder.find().toArray();
            let totalPage = Math.ceil(parseInt(count.length) / pagesize);
            let arrMGG = await colOrder.find().sort(sort).limit(parseInt(pagesize)).skip(parseInt(pagesize) * parseInt(page)).toArray();
           
            client.close();
            res.status(200).json({
                status: "ok",
                data: arrMGG,
                totalPage: totalPage,
                count: count.length
            });
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },

    //Thao tác CRUD mã giảm giá của chủ shop
    LayMaGiamGiaTheoFilter: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        const {filter, sort, page, pagesize} = req;
       // console.log(JSON.stringify({filter, page, pagesize}));
        try {
            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            let count = await colMaGiamGia.find(filter).toArray();
            let soTrang = Math.ceil(parseInt(count.length) / pagesize);
            let arrMGG = await colMaGiamGia.find(filter).sort(sort).limit(parseInt(pagesize)).skip(parseInt(pagesize) * parseInt(page)).toArray();
            console.log(arrMGG);
            client.close();
            res.status(200).json({
                status: "ok",
                data: arrMGG,
                soTrang: soTrang,
                count: count.length
            });
        } catch (e) {
            console.log(e);
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },

    ThemMaGiamGia: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            const idChuShop =ObjectId(req.chuShopId);
            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            //Kiểm tra tên mã giảm giá đã tồn tại hay chưa
            let result = await colMaGiamGia.find({lowerCase: req.body.tenMGG,ID_ChuShop:idChuShop}).next();
            if (result != null) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Tên mã giảm giá đã tồn tại, vui lòng đặt tên khác !'
                });
            } else {
                //Tạo parameter MaGiamGia
                let MaGiamGia = {
                    tenMGG: req.body.tenMGG,
                    tiLeSale: parseInt(req.body.tiLeSale),
                    soLuong: parseInt(req.body.soLuong),
                    trangThaiKhoa: false,
                    trangThaiXoa: false,
                    ID_ChuShop: idChuShop
                }
                let result = await colMaGiamGia.insertOne(MaGiamGia);
                client.close();
                res.status(200).json({
                    status: 'ok',
                    message: 'Thêm thành công !'
                });
            }
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },

    SuaMaGiamGia: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            const idChuShop =ObjectId(req.chuShopId);
            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            //Kiểm tra tên mã giảm giá đã tồn tại hay chưa
            let result = await colMaGiamGia.find({
                tenMGG: req.body.tenMGG,
                _id: {$ne: ObjectId(req.body.id)},
                trangThaiXoa:false,
                ID_ChuShop:idChuShop
            }).next();

            if (result !== null) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Tên mã giảm giá đã tồn tại, vui lòng đặt tên khác !'
                }); return;
            }
            let r = await colMaGiamGia.updateOne(
                {_id: ObjectId(req.body.id)},
                {
                    $set: {
                        tenMGG: req.body.tenMGG,
                        tiLeSale: parseInt(req.body.tiLeSale),
                        soLuong: parseInt(req.body.soLuong)
                    }
                }
            );
            client.close();
            // console.log(result);
            res.status(200).json({
                status: 'ok',
                message: 'Sửa thành công !'
            });
        } catch (err) {
            res.status(200).json({
                status: "fail",
                message: err.toString()
            });
        }
    },

    KhoaMaGiamGia: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            let ids = req.body.listid; //array
            let type = req.body.type; // true: lock;   false:unlock;

            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            let duyetResult = await colMaGiamGia.updateMany({_id: {'$in': ids.map(item => ObjectId(item))}}, {
                $set: {
                    trangThaiKhoa: type
                }
            });
            client.close();
            res.status(200).json({
                status: "ok",
                message: `Đã ${type?'khóa':'mở khóa'} ${ids.length} mã giảm giá !`
            });
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },
    XoaMaGiamGia: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            let ids = req.body.listid; //array

            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            let duyetResult = await colMaGiamGia.updateMany({_id: {'$in': ids.map(item => ObjectId(item))}}, {
                $set: {
                    trangThaiXoa: true
                }
            });
            client.close();
            res.status(200).json({
                status: "ok",
                message: `Đã xóa ${ids.length} mã giảm giá !`
            });
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },
    KiemTraTonTaiMaGiamGia: async function (req, res, next) {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            let tenMGG = req.body.tenMGG;
            let idChuShop = ObjectId(req.body.idChuShop);

            await client.connect();
            const db = client.db(DbName);
            const colMaGiamGia = db.collection('MaGiamGia');
            let kiemTraTonTaiMGG = await colMaGiamGia.find({tenMGG:tenMGG,ID_ChuShop:idChuShop,soLuong:{'$gt':0},trangThaiKhoa: false,trangThaiXoa: false}).next();

            if(kiemTraTonTaiMGG === null){
                res.status(200).json({
                    status: "fail",
                    message: `Mã giảm giá không tồn tại !`
                }); return;
            }

            res.status(200).json({
                status: "ok",
                message: `Tồn tại mã giảm giá !`,
                tenMGG:kiemTraTonTaiMGG.tenMGG,
                tiLeSale:kiemTraTonTaiMGG.tiLeSale
            });
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }  client.close();
    },
}
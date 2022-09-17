const ObjectId = require('mongodb').ObjectId;

module.exports = {
    ValidateFilterKhiTimKiem_MaGiamGia(req, res, next){
        const chuShopId =  ObjectId(req.chuShopId);
        let {searchtype,tukhoa,sapxep,page,pagesize,loaimgg} = req.query;
        if(!page){page = 0} if(parseInt(page)<0){page = 0}
        if(!pagesize){pagesize = 10}  if(parseInt(pagesize)<0){pagesize = 10}
        let filter = {trangThaiXoa: false, ID_ChuShop:chuShopId}

        if(![0,1].includes(parseInt(loaimgg))){filter.trangThaiKhoa = false}
        if(parseInt(loaimgg) === 0){filter.trangThaiKhoa = false}
        if(parseInt(loaimgg) === 1){filter.trangThaiKhoa = true}


        if(![0,1,2].includes(parseInt(searchtype)) && tukhoa){filter.tenMGG =  {'$regex': tukhoa, '$options': '$i'}}
        if(parseInt(searchtype) === 0 && tukhoa){filter.tenMGG =  {'$regex': tukhoa, '$options': '$i'}}
        if(parseInt(searchtype) === 1 && tukhoa){filter.tiLeSale =  parseInt(tukhoa)}
        if(parseInt(searchtype) === 2 && tukhoa){filter.soLuong = parseInt(tukhoa)}
        req.filter = filter;
        req.page = page;
        req.pagesize = pagesize;


        let sort = {};
        if(!sapxep) { sort._id = -1}
        if(sapxep === 'esc') { sort._id = 1}
        if(sapxep === 'desc') { sort._id = -1}

        req.sort = sort;
        // console.log(searchtype)
         console.log(filter)
         console.log(sort)
        next();
    },

    Validate_MaGiamGia_Khi_Them_Sua: function (req, res, next) {
        let {tenMGG,tiLeSale,soLuong} = req.body;
        console.log(req.body);
        try {
            if (!tenMGG || !tiLeSale  || !soLuong ) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Thông tin không được trống !'
                }); return;
            }
            if (!/^[A-Z0-9]{6,12}$/.test(tenMGG)) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Mã giảm giá phải là chữ in hoa, phải từ 6-12 ký tự !'
                }); return;
            }
            if (!/^[0-9][0-9]?$|^100$/.test(tiLeSale)) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Tỉ lệ sale phải là số, thuộc [0-100] !'
                }); return;
            }
            if (!/^\d{1,12}$/.test(soLuong)) {
                res.status(200).json({
                    status: 'fail',
                    message: 'Số lượng phải là số, không được vượt quá 12 ký tự !'
                }); return;
            }
            next();
        } catch (e) {
            res.status(200).json({
                status: "fail",
                message: e.toString()
            });
        }
    },

}
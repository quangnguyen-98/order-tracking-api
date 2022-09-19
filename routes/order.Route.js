const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');
const { orderValidator } = require('../validators');
//Endpoint:localhost:3000/api/v1/order/


// // Get order
// router.post('/get-order', orderController.getOrders);

// // Lấy mã giảm giá theo filter
// router.get('/magiamgia', orderValidator.ValidateFilterKhiTimKiem_MaGiamGia, orderController.LayMaGiamGiaTheoFilter);

// // Lấy mã giảm giá theo id
// //router.get('/magiamgia/:id',maGiamGiaController.LayDonHangTheoId);

// // Thêm mã giảm giá
// router.post('/magiamgia', orderValidator.Validate_MaGiamGia_Khi_Them_Sua, orderController.ThemMaGiamGia);

// // Sửa mã giảm giá
// router.put('/magiamgia', orderValidator.Validate_MaGiamGia_Khi_Them_Sua, orderController.SuaMaGiamGia);

// // Khóa/mở khóa mã giảm giá theo list item
// router.put('/lockmagiamgia', orderController.KhoaMaGiamGia);

// // Xóa mã giảm giá theo list item
// router.delete('/magiamgia', orderController.XoaMaGiamGia);

module.exports = router;

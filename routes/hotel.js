const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

router.post('/', upload.single('hotelImage'), hotelController.addHotel);
router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getAhotel);

module.exports = router
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const authGaurd = require('../util/authGaurd')

router.post('/', authGaurd,  hotelController.addHotel);
router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getAhotel);

module.exports = router
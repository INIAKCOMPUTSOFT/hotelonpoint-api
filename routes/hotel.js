const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

router.get('/', (req, res) => {
    res.send('Welcome to Hotels Route')
})
router.post('/', upload.single('hotelImage'), hotelController.addHotel)

module.exports = router
const express = require('express')
const router = express.Router()
const roomsController = require('../controllers/room')
const upload = require("../multer");
const authGaurd = require("../util/authGaurd");

router.get('/:hotelId', roomsController.getAllRooms);
router.post('/:hotelId', upload.array("image"), roomsController.AddNewRoom);
router.get('/:id', roomsController.getAroom)
router.put('/:id', roomsController.updateRoom)

module.exports = router;
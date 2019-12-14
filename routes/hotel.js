const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel");
const upload = require("../multer");
const authGaurd = require("../util/authGaurd");

router.post("/", upload.array("image"), hotelController.addHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getAhotel);

module.exports = router;

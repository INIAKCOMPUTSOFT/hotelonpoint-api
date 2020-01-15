const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel");
const upload = require("../multer");
const authGaurd = require("../util/authGaurd");
const paystack = require("paystack")(process.env.PAYSTACK);

router.post("/", authGaurd, upload.array("image"), hotelController.addHotel);
router.put(
  "/uploadhotelphoto/:id",
  upload.array("image"),
  hotelController.uploadhotelphoto
);
router.put("/percentage/:id", authGaurd, hotelController.increasePercentage);
router.get("/", hotelController.getHotels);
router.get("/me", authGaurd, hotelController.getCredUserhotel);
router.get("/myHotel", authGaurd, hotelController.getAuthUserHotel);
router.get("/:id", hotelController.getAhotel);
router.put("/:id", authGaurd, hotelController.updateHotel)
router.post("/verify", function(req, res) {
  paystack.transaction.verify(req.body.ref, function(error, body) {
    if (error) {
      res.json(error);
    } else {
      res.status(200).json(body.message);
    }
  });
});

module.exports = router;

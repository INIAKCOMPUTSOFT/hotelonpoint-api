const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booking");
const authGaurd = require("../util/authGaurd");
const ccAuth = require("../util/ccAuth");

router.get("/", (req, res) => {
  res.send("Booking");
});
router.get("/all", authGaurd, ccAuth, bookController.getAllBookings);
router.get("/hotelbooking/:hotelId", bookController.getAllHotelBookings);
router.get("/userAll", authGaurd, bookController.getAllUserBookings);
router.get(
  "/invoice/:hotelId",
  authGaurd,
  ccAuth,
  bookController.getAllBookingInvoice
);

router.get(
  "/userinvoice/:hotelId",
  authGaurd,
  bookController.getAllBookingInvoice
);
router.get("/:bookingId", authGaurd, bookController.getABooking);
router.put("/:bookingId", authGaurd, ccAuth, bookController.updateBooking);
router.put("/user/:bookingId", authGaurd, bookController.updateBooking);
router.delete("/:bookingId", authGaurd, ccAuth, bookController.deleteBooking);

module.exports = router;

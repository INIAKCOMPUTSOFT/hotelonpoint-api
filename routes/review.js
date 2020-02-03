const express = require("express");
const router = express.Router();
const adminAuth = require("../util/adminAuth");
const authGuard = require("../util/authGaurd");
const ccAuth = require("../util/ccAuth");
const reviewController = require("../controllers/review");

router.get("/", (req, res) => {
  res.send("Review");
});
router.get("/all", reviewController.getAllReviews);
router.post("/:hotelId", reviewController.addReviews);
router.get("/:hotelId", reviewController.getReviewsForHotel);
router.put("/:reviewId", authGuard, ccAuth, reviewController.approveReviews);
router.delete("/:reviewId", authGuard, ccAuth, reviewController.deleteReview);

module.exports = router;

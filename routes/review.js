const express = require('express')
const router = express.Router()
const adminAuth = require('../util/adminAuth')
const reviewController = require('../controllers/review')

router.get('/', (req, res) => {
    res.send('Review')
})
router.get('/all', reviewController.getAllReviews)
router.post('/:hotelId', reviewController.addReviews)
router.get('/:hotelId', reviewController.getReviewsForHotel)
router.put('/:reviewId', adminAuth, reviewController.approveReviews)

module.exports = router
const express = require('express')
const router = express.Router()
const bookController = require('../controllers/booking')
const authGaurd = require('../util/authGaurd')
const adminAuth = require('../util/adminAuth')

router.get('/', (req, res) => {
    res.send('Booking')
})
router.get('/all', authGaurd, bookController.getAllBookings)
router.get('/:bookingId', authGaurd, bookController.getABooking)
router.put('/:bookingId', authGaurd, bookController.updateBooking)
router.delete('/:bookingId', authGaurd, bookController.deleteBooking)

module.exports = router
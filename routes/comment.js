const express = require("express");
const router = express.Router();
const commentController = require('../controllers/comments')
const authGuard = require('../util/authGaurd')

router.get('/', authGuard, commentController.getAllComment)
router.get('/:reviewId', authGuard,  commentController.getCommentForReviews)
router.post('/:reviewId', authGuard, commentController.postComment)
router.put('/:id', authGuard, commentController.updateComment)
router.delete('/:id', authGuard, commentController.deleteComment)


module.exports = router;

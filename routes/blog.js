const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')
const authGaurd = require('../util/authGaurd')

router.post('/', authGaurd, blogController.blogPost)
router.get('/', blogController.getBlogs)
router.get('/:id', blogController.getBlog)
router.delete('/:id', authGaurd, blogController.deleteAPost)
router.put('/:id', authGaurd, blogController.updateStory)
router.post('/comment/:id', authGaurd, blogController.commentOn)
router.get('/comment/:id', blogController.getComment)
// router.delete('/comment/:id', blogController.deleteComment)

module.exports = router
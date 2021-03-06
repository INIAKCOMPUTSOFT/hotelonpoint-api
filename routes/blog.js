const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')
const authGaurd = require('../util/authGaurd')
const adminAuth = require('../util/adminAuth')

const upload = require('../multer')
const fs = require('fs')
const cloudinary = require('../cloudinary')
router.post('/', authGaurd, adminAuth, upload.array('image'), blogController.blogPost)
router.get('/', blogController.getBlogs)
router.get('/:id', blogController.getBlog)
router.delete('/:id', authGaurd, adminAuth,  blogController.deleteAPost)
router.put('/:id', authGaurd, adminAuth,  blogController.updateStory)
router.post('/comment/:id', authGaurd, adminAuth,  blogController.commentOn)
router.get('/comment/:id', blogController.getComment)
// router.delete('/comment/:id', blogController.deleteComment)

module.exports = router
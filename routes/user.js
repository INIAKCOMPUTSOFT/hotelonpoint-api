const express = require('express')
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes')
const router = express.Router()
const userController = require('../controllers/user')
const authGaurd = require('../util/authGaurd')
const { Mail } = require('../models/mail')

const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true);
//     }else {
//         cb(null, false);
//     }
// }

// const upload = multer({ storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter
// })
const upload = multer({ dest: 'uploads/' })

router.get('/me', authGaurd, userController.getAuthUser)
router.post('/', userController.userSignUp)
router.post('/logins', userController.login)
router.get('/:id', userController.getAuser)
router.put(
  '/image/:id',
  upload.single('profileImage'),
  userController.updateProfilePic
)
router.post('/validateUser', userController.checkValidUser)
router.put('/changePassword/:id', userController.changePassword)
router.put('/:id', authGaurd, userController.updateDetails)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body
    const mail = await Mail.findOne({ email })
    if (mail) {
      return res.status(BAD_REQUEST).json({
        message: 'Mail already subscribed to NewsLetter',
        status: 'error'
      })
    }
    newSubscriber = new Mail({
      _id: new mongoose.Types.ObjectId(),
      email
    })

    const resp = await newSubscriber.save()
    if (resp) {
      return res.status(OK).json({
        status: 'success',
        data: resp
      })
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).json({
      message: error,
      status: 'error'
    })
  }
})

module.exports = router

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authGaurd = require('../util/authGaurd')

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
const upload = multer({dest: 'uploads/'})

router.get('/me', authGaurd, userController.getAuthUser)
router.post('/', userController.userSignUp);
router.post('/logins', userController.login);
router.get('/:id', userController.getAuser);
router.put('/image/:id', upload.single('profileImage'), userController.updateProfilePic);
router.put('/:id', authGaurd, userController.updateDetails);

module.exports = router;
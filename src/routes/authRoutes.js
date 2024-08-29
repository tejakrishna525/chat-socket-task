const express = require('express')
const router = express.Router();
const auth = require("../middlewares/auth")


const authController = require("../controllers/authController")



router.post('/register',auth.logout,authController.register);
router.post('/login',authController.login);
router.get('/logout',auth.isLoggedIn, authController.logout);


module.exports = router;
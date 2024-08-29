const express = require("express")
const auth = require("../middlewares/auth")

const router = express.Router()

const userController = require("../controllers/userController")

router.get('/',auth.isLoggedIn, userController.dashboard)

router.post('/save-chat',auth.isLoggedIn,userController.saveChat)
router.get('/groups',auth.isLoggedIn,userController.loadGroups)
router.post('/groups', userController.createGroups)
router.get('/get-members', userController.getMembers)
router.post('/add-members',auth.isLoggedIn, userController.addMembers)
router.get('/group-chat', auth.isLoggedIn,userController.groupChats)
router.get('/group-chat-save', auth.isLoggedIn,userController.groupChatSave)







module.exports = router


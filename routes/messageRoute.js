const express = require("express")
const utilities = require('../utilities/')
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const messageValidator = require("../utilities/message-validation")


router.get('/', utilities.checkLogin, utilities.handleErrors(messageController.buildInboxMessagesView))
router.get('/details/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.buildMessageDetailsView))
router.get('/archive', utilities.checkLogin, utilities.handleErrors(messageController.buildArchivedMessagesView))
router.get('/send', utilities.checkLogin, utilities.handleErrors(messageController.buildSendMessageView))
router.get('/reply/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.buildReplyMessageView))
router.get('/delete/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.deleteMessage))


router.post('/send', utilities.checkLogin, messageValidator.messageRules(), messageValidator.checkMessageData, utilities.handleErrors(messageController.sendMessage))
router.post('/archive/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.archiveMessage))
router.post('/unarchive/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.unarchiveMessage))
router.post('/sendReply', utilities.checkLogin, messageValidator.messageRules(), messageValidator.checkReplyMessageData, utilities.handleErrors(messageController.sendMessage))
router.post('/read/:message_id', utilities.checkLogin, utilities.checkIsUsersMessage, utilities.handleErrors(messageController.markMessageAsRead))



module.exports = router;
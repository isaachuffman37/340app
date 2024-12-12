const utilities = require('../utilities/')
const messageModel = require('../models/message-model')

const messageController = {}

messageController.buildInboxMessagesView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let archived_count = await messageModel.getArchivedMessageCount(res.locals.accountData.account_id)
    let inboxData = await messageModel.getNonArchivedMessages(res.locals.accountData.account_id)
    res.render('message/inbox', {
        nav,
        errors: null,
        title: "Inbox",
        inboxData,
        archived_count
    })
}

messageController.buildArchivedMessagesView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let archivedData = await messageModel.getArchivedMessages(res.locals.accountData.account_id)
    res.render('message/archivedView', {
        nav,
        errors: null,
        title: "Archive",
        archivedData
    })
}

messageController.buildSendMessageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let accountsList = await utilities.buildAccountList()
    res.render('message/messageSend', {
        nav,
        errors: null,
        title: "Send Message",
        accountsList
    })
}

messageController.buildReplyMessageView = async function (req, res, next) {
    let message_id = parseInt(req.params.message_id)
    let messageData = await messageModel.getMessageDetailsById(message_id)
    let nav = await utilities.getNav()
    res.render('message/messageReply', {
        nav,
        errors: null,
        title: "Reply",
        messageSender: `${messageData.account_firstname} ${messageData.account_lastname}`,
        message_to: messageData.account_id,
        message_subject: `RE: ${messageData.message_subject}`
    })
}

messageController.buildMessageDetailsView = async function (req, res, next) {
    let message_id = parseInt(req.params.message_id)
    let nav = await utilities.getNav()
    let messageData = await messageModel.getMessageDetailsById(message_id)

    res.render('message/messageDetail', {
        nav,
        errors: null,
        title: messageData.message_subject,
        message_id,
        message_body: messageData.message_body,
        message_subject: messageData.message_subject,
        message_body: messageData.message_body,
        messageSender: `${messageData.account_firstname} ${messageData.account_lastname}`,
        message_archived: messageData.message_archived,
        message_created: messageData.message_created,
        message_read: messageData.message_read
    })
}

messageController.sendMessage = async function(req, res) {
    let nav = await utilities.getNav()
    const { message_to, message_from, message_body, message_subject } = req.body
    const sendResult = await messageModel.insertMessage(message_to, message_from, message_body, message_subject)
  
    if (sendResult) {
      req.flash(
        "notice",
        `You successfully sent a message!`
      )
      res.status(201).redirect("/messages/")
    } else {
      let accountList = await utilities.buildAccountList(message_to)
      req.flash("failure", "Sorry, failed to add inventory to database.")
      res.status(501).render("messages/messageSend", {
        title: "Add Inventory",
        nav,
        errors: null,
        accountList
      })
    }
  }

  messageController.deleteMessage = async function(req, res) {
    let deleteResult = await messageModel.deleteMessageById(req.params.message_id)

    if (deleteResult) {
      req.flash(
        "notice",
        `You successfully deleted a message!`
      )
      if (deleteResult.message_archived){
        res.status(201).redirect("/messages/archive")
      } 
      res.status(201).redirect("/messages/")
    } else {
      req.flash("failure", "Sorry, failed to delete message.")
      res.status(501).redirect(`/messages/details/${req.params.message_id}`)
    }
  }


  messageController.archiveMessage = async function(req, res) {
    let archiveResult = await messageModel.archiveMessageById(req.params.message_id)
  
    if (archiveResult) {
      req.flash(
        "notice",
        `You successfully archived a message!`
      )
      res.status(201).redirect("/messages/")
    } else {
      req.flash("notice", "Sorry, failed to archive message.")
      res.status(501).redirect(`/messages/details/${req.params.message_id}`)
    }
  }


  messageController.unarchiveMessage = async function(req, res) {
    let archiveResult = await messageModel.unarchiveMessageById(req.params.message_id)
  
    if (archiveResult) {
      req.flash(
        "notice",
        `You successfully un-archived a message!`
      )
      res.status(201).redirect("/messages/archive")
    } else {
      req.flash("notice", "Sorry, failed to un-archive message.")
      res.status(501).redirect(`/messages/details/${req.params.message_id}`)
    }
  }

  messageController.markMessageAsRead = async function(req, res) {
    let readResult = await messageModel.markMessageAsReadById(req.params.message_id)
  
    if (readResult) {
      req.flash(
        "notice",
        `You successfully marked a message as read!`
      )
      if (readResult.message_archived){
        res.status(201).redirect("/messages/archive")
      } 
      res.status(201).redirect("/messages/")
    } else {
      req.flash("notice", "Sorry, failed to un-archive message.")
      res.status(501).redirect(`/messages/details/${req.params.message_id}`)
    }
  }
module.exports = messageController
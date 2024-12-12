const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.messageRules = () => {
    return [
      // Validate the recipient (accountList select element)
      body("message_to")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Recipient is required.")
        .isNumeric()
        .withMessage("Recipient must be a valid numeric account ID."),
      
      // Validate the message subject
      body("message_subject")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Subject is required.")
        .matches(/^[A-Za-z0-9 :!]+$/)
        .withMessage("Subject must contain only alphanumeric characters and spaces.")
        .isLength({ min: 1, max: 255 })
        .withMessage("Subject must be between 1 and 255 characters long."),
      
      // Validate the message body
      body("message_body")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Message body is required.")
        .isLength({ min: 1 })
        .withMessage("Message body must be at least 1 character long."),
    ];
};


validate.checkMessageData = async (req, res, next) => {
    const { message_to, message_body, message_subject } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let accountsList = await utilities.buildAccountList(message_to)
      res.render("message/messageSend", {
        errors,
        title: "Add Inventory",
        nav,
        accountsList,
        message_body,
        message_to,
        message_subject
      })
      return
    }
    next()
}

validate.checkReplyMessageData = async (req, res, next) => {
    const { message_to, message_body, message_subject, message_from, messageSender } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("message/messageReply", {
        errors,
        title: "Reply",
        nav,
        message_body,
        message_to,
        message_subject,
        message_from,
        messageSender
      })
      return
    }
    next()
}

module.exports = validate
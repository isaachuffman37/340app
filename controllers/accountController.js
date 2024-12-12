const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const messageModel = require('../models/message-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
} 

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body


    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null
      })
    }
  }


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function accountLogout(req, res, next) {
  if (req.cookies.jwt) {
    res.clearCookie("jwt")
    req.flash("notice", "Successfully logged out")
    res.redirect("/")
  } else {
    req.flash("notice", "UNABLE TO LOG OUT CUZ NO COOKIE")
    res.redirect("/")
  }
}

async function buildAccountManagement (req, res) {
  let accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  let message_count = await messageModel.getUnreadMessageCount(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  res.render('account/management', {
    nav,
    title: "Account Management",
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    message_count
  })
}




async function buildAccountUpdateView(req, res) {
  let account_id = parseInt(req.params.id)
  let nav = await utilities.getNav()
  let accountData = await accountModel.getAccountById(account_id)
  res.render('account/update', {
    title: "Account Update",
    nav,
    errors: null,
    account_email: accountData.account_email,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_id,
  })
}


/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email} = req.body
  const account_id = parseInt(req.body.account_id)

  const updateResult = await accountModel.updateAccount(account_id,account_email,account_firstname,account_lastname)

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, You updated your info!`
    )
    res.status(201).redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updatePassword(req, res) {
  const { account_password } = req.body
  const account_id = parseInt(req.body.account_id)

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).redirect(`account/update/${account_id}`)
  }

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, You updated your password!`
    )
    res.status(201).redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).redirect(`account/update/${account_id}`)
  }
}

  
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdateView, updateAccount, updatePassword, accountLogout} 
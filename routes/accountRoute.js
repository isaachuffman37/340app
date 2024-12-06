// Needed Resources 
const express = require("express")
const utilities = require('../utilities/')
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const validate = require("../utilities/inventory-validation")
// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin) 
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

router.get("/update/:id", utilities.handleErrors(accountController.buildAccountUpdateView))

router.post("/update", regValidate.setCurrentEmail, regValidate.updateAccountRules(), regValidate.checkAccountData, utilities.handleErrors(accountController.updateAccount))
router.post("/update-password", regValidate.updatePasswordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))




module.exports = router;
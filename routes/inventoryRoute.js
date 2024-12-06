// Needed Resources 
const express = require("express")
const utilities = require('../utilities/')
const invValidation = require('../utilities/inventory-validation') 
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddClassificationView))
router.get("/add-inventory", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildAddInventoryView))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.editInventoryView))

router.get("/delete/:inv_id", utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildDeleteConfirmationView))


router.post("/add-classification", utilities.checkAdminOrEmployee, invValidation.classificationRules(), invValidation.checkClassData, utilities.handleErrors(invController.addClassification))
router.post("/add-inventory", utilities.checkAdminOrEmployee, invValidation.inventoryRules(), invValidation.checkInventoryData, utilities.handleErrors(invController.addInventory))
router.post("/update/", utilities.checkAdminOrEmployee, invValidation.newInventoryRules(), invValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory))

router.post('/delete', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.deleteInventory))

module.exports = router;
// Needed Resources 
const express = require("express")
const utilities = require('../utilities/')
const invValidation = require('../utilities/inventory-validation') 
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView))

router.post("/add-classification", invValidation.classificationRules(), invValidation.checkClassData, utilities.handleErrors(invController.addClassification))
router.post("/add-inventory", invValidation.inventoryRules(), invValidation.checkInventoryData, utilities.handleErrors(invController.addInventory))
router.post("/update/",invValidation.newInventoryRules(), invValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory))

module.exports = router;
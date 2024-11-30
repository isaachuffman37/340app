const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleByInvId(inv_id);
    const grid = await utilities.buildVehiclePage(data);
    let nav = await utilities.getNav()
    const vehicleName = `${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/vehicle", {
       title: vehicleName,
       nav,
       grid,
    })
}


invCont.buildManagementView = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

invCont.buildAddClassificationView = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors:null,
  })
}

invCont.buildAddInventoryView = async function (req, res, next){
  let nav = await utilities.getNav()
  let classSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classSelect
  })
}


invCont.addClassification = async function(req, res) {
  let oldNav = await utilities.getNav()
  const { classification_name } = req.body


  const classResult = await invModel.addClassificationToTable(
    classification_name
  )

  if (classResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `You successfully added a classification!`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      oldNav,
      errors: null
    })
  }
}

invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_id } = req.body
  const invResult = await invModel.addInventoryToTable(req.body)

  if (invResult) {
    req.flash(
      "notice",
      `You successfully added a vehicle!`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  } else {
    let classSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, failed to add inventory to database.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classSelect
    })
  }
}

module.exports = invCont
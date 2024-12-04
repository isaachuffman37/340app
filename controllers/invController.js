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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemDataRows = await invModel.getVehicleByInvId(inv_id)
  const itemData = itemDataRows[0]
  const classSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont
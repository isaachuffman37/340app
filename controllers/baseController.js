const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.throwError = function (req, res){
  throw new Error("Intentional server error");
}

module.exports = baseController
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='nav-list'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildVehiclePage = async function(data){
    let page;
    let price;
    let miles;
    if(data.length > 0) {
      let vehicleData = data[0];
      if(vehicleData.inv_price){
        price = formatCurrency(vehicleData.inv_price);
      } else {
        price = 'N/A'
      }
      if(vehicleData.inv_miles){
        miles = formatMiles(vehicleData.inv_miles);
      } else {
        miles = 'N/A'
      }
        page = `<div class="vehicle-grid">
                    <div>
                        <img id= "vehicle-full-img" src="${vehicleData.inv_image}">
                    </div>
                    <div class = "vehicle-description">
                        <p><b>Make</b>: ${vehicleData.inv_make}</p>
                        <p><b>Model</b>: ${vehicleData.inv_model}</p> 
                        <p><b>Year</b>: ${vehicleData.inv_year}</p> 
                        <p><b>Color</b>: ${vehicleData.inv_color}</p> 
                        <p><b>Price</b>: ${price}</p>
                        <p><b>Miles</b>: ${miles}</p>
                        <p><b>Description</b>: ${vehicleData.inv_description}</p>
                    </div>
                </div>`
    } else {
        page = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return page
  }


function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(number);
}

function formatMiles(number) {
  return new Intl.NumberFormat('en-US').format(number);
}


  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
validate.inventoryRules = () => {
    return [
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification is required.")
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please select a valid classification."),
  
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make is required.")
        .isAlpha()
        .withMessage("Make must contain only alphabetic characters.")
        .isLength({ min: 1 })
        .withMessage("Make must be at least 1 character long."),
  
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Model is required.")
        .matches(/^[A-Za-z0-9 ]+$/)
        .withMessage("Model must contain only letters, numbers, and spaces.")
        .isLength({ min: 1 })
        .withMessage("Model must be at least 1 character long."),
  
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Year is required.")
        .isNumeric()
        .withMessage("Year must be a numeric value.")
        .isLength({ min: 4, max: 4 })
        .withMessage("Year must be a 4-digit number."),
  
      body("inv_description")
        .trim()
        .escape()
        .customSanitizer(decodeHtmlEntities)
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 1 })
        .withMessage("Description must be at least 1 character long."),
  
      body("inv_image")
        .trim()
        .escape()
        .customSanitizer(decodeHtmlEntities)
        .notEmpty()
        .withMessage("Image link is required."),
  
      body("inv_thumbnail")
        .trim()
        .escape()
        .customSanitizer(decodeHtmlEntities)
        .notEmpty()
        .withMessage("Thumbnail link is required."),
  
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Price is required.")
        .isNumeric()
        .withMessage("Price must be a numeric value.")
        .isLength({ max: 9 })
        .withMessage("Price cannot exceed 9 digits."),
  
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Miles is required.")
        .isNumeric()
        .withMessage("Miles must be a numeric value."),
  
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color is required.")
        .matches(/^[A-Za-z ]+$/)
        .withMessage("Color must contain only alphabetic characters and spaces.")
        .isLength({ min: 1 })
        .withMessage("Color must be at least 1 character long.")
    ];
  };

  function decodeHtmlEntities(value) {
    return value
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#96;/g, "`");
  } 

validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name with only alphabetic characters."), // on error this message is sent.
    ]
  }


  validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classSelect = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classSelect,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      })
      return
    }
    next()
  }

  module.exports = validate
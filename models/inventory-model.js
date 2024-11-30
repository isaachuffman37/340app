const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}


async function getVehicleByInvId(inv_id){
    try {
        const data = await pool.query(
          `SELECT * FROM public.inventory
          WHERE inv_id = $1`,
          [inv_id]
        )
        return data.rows
      } catch (error) {
        console.error("getvehiclebyid error " + error)
      }
}

async function addClassificationToTable(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function addInventoryToTable(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `;
    const values = [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
    ];
    return await pool.query(sql, values);
  } catch (error) {
    return error.message;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInvId, addClassificationToTable, addInventoryToTable}
const pool = require("../database/")

async function getUnreadMessageCount(message_to_id) {
    try {
        const sql = "SELECT COUNT(*) FROM public.message WHERE message_to = $1 AND message_read = FALSE";
        const result = await pool.query(sql, [message_to_id]);
        return parseInt(result.rows[0].count);
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function getArchivedMessageCount(message_to_id) {
    try {
        const sql = "SELECT COUNT(*) FROM public.message WHERE message_to = $1 AND message_archived = TRUE";
        const result = await pool.query(sql, [message_to_id]);
        return parseInt(result.rows[0].count);
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function getNonArchivedMessages(message_to_id) {
    try {
        const sql = `
            SELECT 
                m.message_id, 
                m.message_subject, 
                m.message_read, 
                m.message_created, 
                m.message_from, 
                a.account_firstname, 
                a.account_lastname
            FROM public.message m
            JOIN public.account a ON m.message_from = a.account_id
            WHERE m.message_to = $1 AND m.message_archived = FALSE
            ORDER BY m.message_read ASC, m.message_created DESC
        `;
        const result = await pool.query(sql, [message_to_id]);
        return result.rows; // Return the non-archived messages with sender's name
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function getArchivedMessages(message_to_id) {
    try {
        const sql = `
            SELECT 
                m.message_id, 
                m.message_subject, 
                m.message_read, 
                m.message_created, 
                m.message_from, 
                a.account_firstname, 
                a.account_lastname
            FROM public.message m
            JOIN public.account a ON m.message_from = a.account_id
            WHERE m.message_to = $1 AND m.message_archived = TRUE
            ORDER BY m.message_read ASC, m.message_created DESC
        `;
        const result = await pool.query(sql, [message_to_id]);
        return result.rows; // Return the non-archived messages with sender's name
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function getMessageDetailsById(message_id) {
    try {
        const sql = `
            SELECT 
                m.message_archived,
                m.message_created,
                m.message_to,
                m.message_read, 
                m.message_subject, 
                m.message_body, 
                a.account_firstname, 
                a.account_lastname,
                a.account_id
            FROM public.message m
            JOIN public.account a ON m.message_from = a.account_id
            WHERE m.message_id = $1
        `;
        const result = await pool.query(sql, [message_id]);
        return result.rows[0]; // Return the non-archived messages with sender's name
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function archiveMessageById(message_id) {
    try {
        const sql = `
            UPDATE public.message
            SET message_archived = TRUE
            WHERE message_id = $1
            RETURNING message_id, message_archived
        `;
        const result = await pool.query(sql, [message_id]);
        if (result.rowCount === 0) {
            return `Message with ID ${message_id} not found.`;
        }
        return result.rows[0]; // Return the updated message details
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function unarchiveMessageById(message_id) {
    try {
        const sql = `
            UPDATE public.message
            SET message_archived = FALSE
            WHERE message_id = $1
            RETURNING message_id, message_archived
        `;
        const result = await pool.query(sql, [message_id]);
        if (result.rowCount === 0) {
            return `Message with ID ${message_id} not found.`;
        }
        return result.rows[0]; // Return the updated message details
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function deleteMessageById(message_id) {
    try {
        const sql = `
            DELETE FROM public.message
            WHERE message_id = $1
            RETURNING message_archived
        `;
        const result = await pool.query(sql, [message_id]);
        return result.rows[0]; // Return true if a row was deleted, otherwise false
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function markMessageAsReadById(message_id) {
    try {
        const sql = `
            UPDATE public.message
            SET message_read = TRUE
            WHERE message_id = $1
            RETURNING message_id, message_read, message_archived
        `;
        const result = await pool.query(sql, [message_id]);
        if (result.rowCount === 0) {
            return `Message with ID ${message_id} not found.`;
        }
        return result.rows[0]; // Return the updated message details
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

async function insertMessage(message_to, message_from, message_body, message_subject) {
    try {
        const sql = `
            INSERT INTO public.message (message_to, message_from, message_body, message_subject)
            VALUES ($1, $2, $3, $4)
            RETURNING message_id, message_subject, message_read, message_created, message_from
        `;
        const result = await pool.query(sql, [message_to, message_from, message_body, message_subject]);
        return result.rows[0]; // Return the inserted message details
    } catch (error) {
        return error.message; // Return the error message if an exception occurs
    }
}

module.exports= { getUnreadMessageCount, insertMessage, markMessageAsReadById, archiveMessageById, getMessageDetailsById, getArchivedMessages, getNonArchivedMessages, getArchivedMessageCount, unarchiveMessageById, deleteMessageById}
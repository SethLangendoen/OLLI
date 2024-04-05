const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '53Th1235@',
    database: 'olli',
}).promise();

async function addWaiverSignature(waiverTitle, email, isSigned) {
    try {
        const query = 'INSERT INTO waiver_signatures (waiver_title, email, isSigned) VALUES (?, ?, ?)';
        const values = [waiverTitle, email, isSigned];
        await connection.query(query, values);
        console.log('Waiver signature added successfully.');
    } catch (error) {
        console.error('Error adding waiver signature:', error);
        throw error;
    }
}
async function getAllSignedWaivers() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM waiver_signatures WHERE isSigned = 1', []
        );
        return rows;
    } catch (error) {
        console.error('Error getting all signed waivers:', error);
        throw error;
    }
}

async function deleteWaiverSignature(waiverTitle) {
    try {
        const query = 'DELETE FROM waiver_signatures WHERE waiver_title = ?';
        const values = [waiverTitle];
        await connection.query(query, values);
        console.log('Waiver signature deleted successfully.');
    } catch (error) {
        console.error('Error deleting waiver signature:', error);
        throw error;
    }
}

async function updateWaiverSignature(waiverTitle, email, isSigned) {
    try {
        const query = 'UPDATE waiver_signatures SET isSigned = ? WHERE waiver_title = ? AND email = ?';
        const values = [isSigned, waiverTitle, email];
        await connection.query(query, values);
        console.log('Waiver signature updated successfully.');
    } catch (error) {
        console.error('Error updating waiver signature:', error);
        throw error;
    }
}

async function getWaiverSignature(waiverTitle, email) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM waiver_signatures WHERE waiver_title = ? AND email = ?',
            [waiverTitle, email]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting waiver signature:', error);
        throw error;
    }
}

async function getAllWaiverSignatures() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM waiver_signatures', []
        );
        return rows;
    } catch (error) {
        console.error('Error getting all waiver signatures:', error);
        throw error;
    }
}

module.exports = {
    addWaiverSignature,
    deleteWaiverSignature,
    updateWaiverSignature,
    getWaiverSignature,
    getAllWaiverSignatures,
    getAllSignedWaivers
};

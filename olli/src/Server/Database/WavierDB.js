const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '53Th1235@',
    database: 'olli',
}).promise();

async function addWaiver(title, description, signature, date) {
    try {
        const query = 'INSERT INTO waiver (title, description, signature, date) VALUES (?, ?, ?, ?)';
        const values = [title, description, signature, date];
        await connection.query(query, values);
        console.log('Waiver added successfully.');
    } catch (error) {
        console.error('Error adding waiver:', error);
        throw error;
    }
}
async function setSignature(title, signature) {
    try {
        const query = 'UPDATE waiver SET signature = ? WHERE title = ?';
        const values = [signature, title];
        await connection.query(query, values);
        console.log('Signature updated successfully.');
    } catch (error) {
        console.error('Error updating signature:', error);
        throw error;
    }
}




async function deleteWaiver(title) {
    try {
        const query = 'DELETE FROM waiver WHERE title = ?';
        const values = [title];
        await connection.query(query, values);
        console.log('Waiver deleted successfully.');
    } catch (error) {
        console.error('Error deleting waiver:', error);
        throw error;
    }
}

async function updateWaiver(title, description, signature, date) {
    try {
        const query = 'UPDATE waiver SET description = ?, signature = ?, date = ? WHERE title = ?';
        const values = [description, signature, date, title];
        await connection.query(query, values);
        console.log('Waiver updated successfully.');
    } catch (error) {
        console.error('Error updating waiver:', error);
        throw error;
    }
}

async function getWaiverByTitle(title) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM waiver WHERE title = ?',
            [title]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting waiver by title:', error);
        throw error;
    }
}

async function getAllWaivers() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM waiver', []
        );
        return rows;
    } catch (error) {
        console.error('Error getting all waivers', error);
        throw error;
    }
}

module.exports = {
    addWaiver,
    deleteWaiver,
    updateWaiver,
    getWaiverByTitle,
    getAllWaivers,
    setSignature
};

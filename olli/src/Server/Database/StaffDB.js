const mysql = require('mysql2');
const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    password: '53Th1235@',
    database: 'olli',
}).promise();


async function addStaff(name, email, wage, clockIn, clockOut, isOnline) {
    try {
        const query = 'INSERT INTO staff (email, name, wage, clockIn, clockOut, isOnline) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [email, name, wage, clockIn, clockOut, isOnline];
        await connection.query(query, values);
        console.log('Staff added successfully.');
    } catch (error) {
        console.error('Error adding staff:', error);
        throw error;
    }
}

async function deleteStaff(email) {
    try {
        const query = 'DELETE FROM staff WHERE email = ?';
        const values = [email];
        await connection.query(query, values);
        console.log('Staff deleted successfully.');
    } catch (error) {
        console.error('Error deleting staff:', error);
        throw error;
    }
}

async function updateStaff(name, email, wage, clockIn, clockOut, isOnline) {
    try {
        const query = 'UPDATE staff SET name = ?, wage = ?, clockIn = ?, clockOut = ?, isOnline = ? WHERE email = ?';
        const values = [name, wage, clockIn, clockOut, isOnline, email];
        await connection.query(query, values);
        console.log('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
}
async function updateClockIn(email, ClockIN) {
    try {
        const query = 'UPDATE staff SET clockIn = ? WHERE email = ?';
        const values = [ClockIN, email];
        await connection.query(query, values);
        console.log('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
}
async function updateClockOut(email, ClockOut) {
    try {
        const query = 'UPDATE staff SET clockOut = ? WHERE email = ?';
        const values = [ClockOut, email];
        await connection.query(query, values);
        console.log('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
}
async function updateStatus(email, isOnline) {
    try {
        const query = 'UPDATE staff SET isOnline = ? WHERE email = ?';
        const values = [isOnline, email];
        await connection.query(query, values);
        console.log('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
}

async function getStaffByEmail(email) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM staff WHERE email = ?',
            [email]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting staff by email:', error);
        throw error;
    }
}
async function getAllStaffByOnlineStatus(isOnline) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM staff WHERE isOnline = ?',
            [isOnline]
        );

        return rows;
    } catch (error) {
        console.error('Error getting staff by online status:', error);
        throw error;
    }
}

async function getAllStaff() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM staff', []
        );
        console.log(rows)
        return rows;
    } catch (error) {
        console.error('Error getting all staff', error);
        throw error;
    }
}




module.exports = {
    updateStaff,
    deleteStaff,
    addStaff,
    getAllStaffByOnlineStatus,
    getStaffByEmail,
    getAllStaff,
    updateClockIn,
    updateClockOut,
    updateStatus
}
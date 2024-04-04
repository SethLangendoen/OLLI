/*
  id INT AUTO_INCREMENT PRIMARY KEY,
    image_name VARCHAR(255),
    image LONGBLOB NOT NULL, 
    current_letter Boolean NOT NULL
*/
const mysql = require('mysql2');
const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    password: 'Sabi5437',
    database: 'olli',
}).promise();

async function addNewsletter(image_name, current_letter, path) {
    try {

        const query = 'INSERT INTO newsletter (image_name, current_letter, path) VALUES (?, ?, ?)';
        const values = [image_name, current_letter, path];
        await connection.query(query, values);
        console.log('Newsletter image added successfully.');

    } catch (error) {
        console.error('Error adding newsletter image:', error);
        throw error;
    }
}

async function setCurrentLetter(image_name) {
    try {
        const query = 'UPDATE newsletter SET current_letter = ?'
        await connection.query(query, [0])

        const q2 = 'UPDATE newsletter SET current_letter = ? WHERE image_name = ?'
        await connection.query(q2, [1, image_name]);
    } catch (error) {

    }
}

// Get function
async function getCurrentNewsletterImage() {
    try {
        const query = 'SELECT * FROM newsletter WHERE current_letter = ?';
        const [rows] = await connection.query(query, [1]);

        if (rows.length > 0) {
            return rows[0]; // Return the first row (newsletter image) found
        } else {
            return null; // If no current newsletter image found
        }
    } catch (error) {
        console.error('Error getting current newsletter image:', error);
        throw error;
    }
}
async function getPastNewsletterImage() {
    try {

        const query = 'SELECT * FROM newsletter';
        const [rows] = await connection.query(query);

        if (rows.length > 0) {
            return rows; // Return the first row (newsletter image) found
        } else {
            return null; // If no current newsletter image found
        }
    } catch (error) {
        console.error('Error getting current newsletter image:', error);
        throw error;
    }
}

async function deleteLetter(image_name) {
    try {
        await connection.query("DELETE FROM newsletter WHERE image_name = ? ", [image_name])
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addNewsletter,
    getPastNewsletterImage,
    getCurrentNewsletterImage,
    setCurrentLetter,
    deleteLetter
}
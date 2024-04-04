const fs = require('fs');
const mysql = require('mysql2');



const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    password: 'Sabi5437',
    database: 'olli',
}).promise();


async function addReview(username, review, rating) {
    try {
        console.log("In database: " + username + ' ' + review + " " + rating);
        const query = 'INSERT INTO reviews (username, review, rating) VALUES (?, ?, ?)';
        const values = [username, review, rating];
        await connection.query(query, values);
        console.log('Rating  added successfully.');
    } catch (error) {
        console.error('Error adding rating', error);
        throw error;
    }
}

async function deleteReview(username) {
    try {
        await connection.query("DELETE FROM reviews WHERE username = ? ", [username])
    } catch (error) {
        console.log(error)
    }
}

async function getAllReviews() {
    console.log('in the getAllReviews func');
    try {
        const [rows] = await connection.query(
            'SELECT * FROM reviews', []
        );
        return rows;
    } catch (error) {
        console.error('Error getting all reviews', error);
        throw error;
    }
}



module.exports = {
    addReview,
    deleteReview,
    getAllReviews
}
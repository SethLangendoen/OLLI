const fs = require('fs');
const mysql = require('mysql2');



const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    password: 'Rl87542476!',
    database: 'olli',
}).promise();


async function addReview(username, review, rating) {
    try {
        const query = 'INSERT INTO reviews (username, review, rating) VALUES (?, ?, ?)';
        const values = [username, review, rating];
        await connection.query(query, values);
    } catch (error) {
        console.error('Error adding rating', error);
        throw error;
    }
}

async function deleteReview(username, review) {
    console.log('in the DB!!')
    console.log(username + ' ' + review)
    try {
        await connection.query("DELETE FROM reviews WHERE username = ? AND review = ? ", [username, review])
    } catch (error) {
        console.log("Error deleting review" + error)
    }
}

async function getAllReviews() {
    try {
        const [rows] = await connection.query('SELECT * FROM reviews');
        console.log('Review rows at database: ' + rows); 
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
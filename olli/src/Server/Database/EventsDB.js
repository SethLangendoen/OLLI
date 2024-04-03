/*

participants
    pick_time VARCHAR(255) NOT NULL,
    drop_time VARCHAR(255) NOT NULL,
    title VARCHAR(64) NOT NULL,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (title, username),  
    FOREIGN KEY (title) REFERENCES events(title),  
    FOREIGN KEY (username) REFERENCES sn(username) 

events
     title VARCHAR(64) NOT NULL PRIMARY KEY,
    descrip VARCHAR(3500) NOT NULL, 
    short_descrip VARCHAR(1000) NOT NULL,
    image blob NOT NULL
    start (string) not null
    end (string) not null
*/

const fs = require('fs');
const mysql = require('mysql2');



const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    password: 'Rl87542476!',
    database: 'olli',
}).promise();


async function getEventByTitle(title) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM events WHERE title = ?',
            [title]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting entry:', error);
        throw error;
    }
}


async function insertEvent(title, descrip, shortDescrip, path, start, end) {
    // image should be a blob already (handled on the front end) 
    console.log('Inside insert event');
    try {
        const query = 'INSERT INTO events (title, descrip, short_descrip, path, start, end) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [title, descrip, shortDescrip, path, start, end];
        await connection.query(query, values);
        console.log('Entry inserted successfully.');

    } catch (error) {
        console.error('Error inserting entry:', error);
        throw error;
    }
}

async function deleteEvent(title) {
    try {
        const query = 'DELETE FROM events WHERE title = ?';
        const value = [title]
        await connection.query(query, value);

        console.log('Entry deleted successfully.');
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
}


async function getAllEvents() {
    try {
        const [rows] = await connection.query('SELECT * FROM events');
        return rows;
    } catch (e) {
        console.log("Error fetching all events: " + e);
    }
}

async function updateEventPhoto(title, path) { // using title as it's the PK
    try {
        await connection.query(
            'UPDATE events SET path = ? WHERE title = ? ',
            [path, title]
        );
    } catch (e) {
        console.log("Error fetching all events: " + e);
    }
}


// Insert function
async function EventSignUp(pickTime, dropTime, title, username) {
    try {

        await connection.query(
            'INSERT INTO participants (pick_time, drop_time, title, username) VALUES (?, ?, ?, ?)',
            [pickTime, dropTime, title, username]
        );
        console.log(`${username} has Signed Up For ${title}.`);

    } catch (error) {
        console.error('DB Error cannot Sign Up for Event:', error);
        throw error;
    }
}


async function getAllParticipants() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM participants',
        );
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }

    } catch (e) {
        console.error("Error getting all participants on the backend: ", e);
    }
}





// Get function
async function getParticipant(title, username) {
    try {

        const [rows] = await connection.query(
            'SELECT * FROM participants WHERE title = ? AND username = ?',
            [title, username]
        );

        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('DB Error getting participant:', error);
        throw error;
    }
}



module.exports = {
    insertEvent,
    getEventByTitle,
    EventSignUp,
    getParticipant,
    getAllEvents,
    deleteEvent,
    getAllParticipants,
    updateEventPhoto,

}

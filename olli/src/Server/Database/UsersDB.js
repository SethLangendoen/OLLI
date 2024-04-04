const mysql = require('mysql2');

/*
UserTable
email VARCHAR(100) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    user_type ENUM('parent', 'staff', "admin", "sn") NOT NULL,      user_type must be only those values
    phone_number VARCHAR(20) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP         
*/

/*
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    image1 VARCHAR(255) NOT NULL,
    image2 VARCHAR(255) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email) -- Add the foreign key constraint
*/

// Create a connection to the database
const connection = mysql.createConnection({
    //socketPath: '/cloudsql/se3350-group-40-416518:us-central1:olli',
    host: "localhost",
    user: 'root',
    connectTimeout: 20000,
    password: 'Sabi5437',
    database: 'olli', // Replace 'your_database_name' with the actual database name
}).promise();

async function updateUser(email, username, password, phone_number) {
    try {
        await connection.query(
            'UPDATE users SET username = ?, password = ?, phone_number = ? WHERE email = ?',
            [username, password, phone_number, email]
        );
    } catch (error) {
        // Handle error
        console.error("Error updating user:", error);
        return null
    }
}



async function updateUserUsingAdmin(username, password, phone_number, newEmail, prevEmail) {
    try {
        await connection.query(
            'UPDATE users SET username = ?, password = ?, phone_number = ?, email = ? WHERE email = ?',
            [username, password, phone_number, newEmail, prevEmail]
        );
    } catch (error) {
        // Handle error
        console.error("Error updating user:", error);
        return null
    }
}





async function insertUser(email, username, password, fName, lName, user_type, phone_number, isSubscribed, children) {
    console.log(isSubscribed)
    try {
        await connection.query(
            'INSERT INTO users (email, username, password, fName, lName, user_type, phone_number, isVerified, isSubscribed) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)',
            [email, username, password, fName, lName, user_type, phone_number, 0, isSubscribed]
        );
        if (user_type === "parent") {
            children.forEach(async child => {
                await connection.query(
                    'INSERT INTO sn (username, email, image1, image2, firstNameSN, lastNameSN) VALUES (?, ?, ?, ?, ?, ?)',
                    [child.username, email, child.image1, child.image2, child.firstNameSN, child.lastNameSN]
                );
            });

        }
        return { error: false }


    } catch (error) {
        console.error('Error inserting user:', error);
        return { error: true }
    }
}

async function getUserByEmail(email) {

    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            return rows[0]; // Return the first row (user) found
        } else {
            return null; // If no user found with the given email
        }
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}


// function to get all of the parents. 
async function getAllParents() {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE user_type = "parent"'
        )
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (e) {
        console.log("Error getting all parents: " + e);
    }
}



async function getSNByUsername(username) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM sn WHERE username = ?',
            [username]
        );

        if (rows.length > 0) {
            return rows[0]; // Return the first row (SN) found
        } else {
            return null; // If no SN found with the given username
        }
    } catch (error) {
        return null
    }
}


async function getSNByParentEmail(email) {
    try {
        const [rows] = await connection.query(
            'SELECT * FROM sn WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            return rows; // Return the first row (SN) found
        } else {
            return null; // If no SN found with the given username
        }
    } catch (error) {
        return null
    }
}


async function updateSN(oldUsername, newUserName, email, image1, image2, fName, lName) {
    try {
        // Update query
        console.log(image1)
        console.log(image2)
        const remove = 'DELETE FROM sn WHERE username = ?';
        const add = "INSERT INTO sn (username, email, image1, image2, firstNameSN, lastNameSN) VALUES (?, ?, ?, ?, ?, ?)"
        // Execute the update query
        await connection.query(remove, [oldUsername]);
        await connection.query(add, [newUserName, email, image1, image2, fName, lName])
        return true
    } catch (error) {
        console.log(error)
        return null
    }
}




async function deleteSN(username) {

    try {
        let sql = `DELETE FROM sn WHERE username= ?`;
        await connection.query(sql, [username]);
        return "User deleted"
    } catch (error) {

        console.log(error)
        return null
    }
}





async function deleteUser(email) {

    try {
        let sql = `DELETE FROM users WHERE email= ?`;
        await connection.query(sql, [email]);
        return "User deleted"
    } catch (error) {

        console.log(error)
        return null
    }
}
async function updateVerification(email) {

    try {
        await connection.query('UPDATE users SET isVerified = ? WHERE email = ?', [1, email])
    }
    catch (error) {
        throw new Error('User Status Could not Be Updated')
    }
}

async function getSubscribedEmails() {
    try {
        const [rows] = await connection.query(`SELECT email FROM users WHERE isSubscribed = ?`, [1])
        console.log(rows)
        return rows

    } catch (error) {

    }
}


module.exports = {
    insertUser,
    getUserByEmail,
    getSNByUsername,
    getSNByParentEmail,
    updateSN,
    deleteSN,
    updateUser,
    getAllParents,
    deleteUser,
    updateUserUsingAdmin,
    updateVerification,
    getSubscribedEmails
}
const express = require('express');
require('dotenv').config();
const reviewDB = require("../Database/ReviewDB.js")
const auth = require("../Helpers/JwtAuth.js")
const router = express.Router();
router.use(express.json());


// Route to insert event
router.post('/addRating', async (req, res) => {
    const { username, review, rating } = req.body;
    console.log("Username: " + username + " Review: " + review + " Rating: " + rating);

    try {
        await reviewDB.addReview(username, review, rating);
        return res.status(201).json({ message: "Rating inserted successfully" });
    } catch (error) {
        console.error('Error inserting event:', error);
        return res.status(500).json({ error: "Server Error" });
    }
});


// delete event using event title (primary key)
router.delete('/deleteRating', async (req, res) => {
    const { username } = req.body;
    try {
        await reviewDB.deleteReview(username);
        return res.json({ key: "success" });
    } catch (error) {
        console.error('Error deleting rating:', error);
        return res.json({ key: "failure" })
    }
});


router.get('/getRatings', async (req, res) => {
    try {
        console.log('in the getRatings db');
        res.json(reviewDB.getAllReviews());
    } catch (error) {
        console.error('Error getting ratings:', error);
        return res.json({ key: "failure" })
    }
})


module.exports = router;





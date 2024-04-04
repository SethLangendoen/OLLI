const express = require('express');
const router = express.Router();
const waiverDB = require('../Database/WavierDB.js'); // Import functions to interact with the waiver table

// Route to add a new waiver
router.post('/addWaiver', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const signature = req.body.signature;
    const date = req.body.date;
    try {
        await waiverDB.addWaiver(title, description, signature, date);
        return res.status(201).json({ message: 'Waiver added successfully' });
    } catch (error) {
        console.error('Error adding waiver:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to delete a waiver by title
router.delete('/deleteWaiver/:title', async (req, res) => {
    const { title } = req.params;
    console.log(title)
    try {
        await waiverDB.deleteWaiver(title);
        return res.json({ message: 'Waiver deleted successfully' });
    } catch (error) {
        console.error('Error deleting waiver:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to update a waiver by title
router.put('/updateWaiver/:title', async (req, res) => {
    const { title } = req.params;
    const { description, signature, date } = req.body;
    try {
        await waiverDB.updateWaiver(title, description, signature, date);
        return res.json({ message: 'Waiver updated successfully' });
    } catch (error) {
        console.error('Error updating waiver:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});
// Route to set the signature of a waiver

router.put('/setSignature/:title', async (req, res) => {
    const title = req.params.title
    const signature = req.body.signature
    console.log(signature)
    try {
        await waiverDB.setSignature(title, signature);
        return res.json({ message: 'Signature set successfully' });
    } catch (error) {
        console.error('Error setting signature:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});
// Route to get a waiver by title
router.get('/getWaiver/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const waiver = await waiverDB.getWaiverByTitle(title);
        if (!waiver) {
            return res.status(404).json({ error: 'Waiver not found' });
        }
        return res.json(waiver);
    } catch (error) {
        console.error('Error retrieving waiver:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to get all waivers
router.get('/getAllWaivers', async (req, res) => {
    try {
        const waivers = await waiverDB.getAllWaivers();
        return res.json(waivers);
    } catch (error) {
        console.error('Error getting all waivers:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

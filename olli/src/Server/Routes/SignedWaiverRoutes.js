const express = require('express');
const router = express.Router();
const waiverSignatureDB = require('../Database/SignedWaivers.js'); // Import functions to interact with the waiver_signatures table

// Route to add a new waiver signature
router.post('/addWaiverSignature', async (req, res) => {
    const { waiverTitle, email, isSigned } = req.body;
    try {
        await waiverSignatureDB.addWaiverSignature(waiverTitle, email, isSigned);
        return res.status(201).json({ message: 'Waiver signature added successfully' });
    } catch (error) {
        console.error('Error adding waiver signature:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to delete a waiver signature
router.delete('/deleteWaiverSignature', async (req, res) => {
    const { waiverTitle } = req.body;
    try {
        await waiverSignatureDB.deleteWaiverSignature(waiverTitle);
        return res.json({ message: 'Waiver signature deleted successfully' });
    } catch (error) {
        console.error('Error deleting waiver signature:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to update a waiver signature
router.put('/updateWaiverSignature', async (req, res) => {
    const { waiverTitle, email, isSigned } = req.body;
    try {
        await waiverSignatureDB.updateWaiverSignature(waiverTitle, email, isSigned);
        return res.json({ message: 'Waiver signature updated successfully' });
    } catch (error) {
        console.error('Error updating waiver signature:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});
router.get('/getSignedWaivers', async (req, res) => {
    try {
        const waiverSignatures = await waiverSignatureDB.getAllSignedWaivers()
        return res.json(waiverSignatures);
    } catch (error) {
        console.error('Error getting all waiver signatures:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});
// Route to get a waiver signature
router.get('/getWaiverSignature', async (req, res) => {
    const email = req.body;
    const waiverTitle = req.body
    try {
        const waiverSignature = await waiverSignatureDB.getWaiverSignature(waiverTitle, email);
        if (!waiverSignature) {
            return res.status(404).json({ error: 'Waiver signature not found' });
        }
        return res.json(waiverSignature);
    } catch (error) {
        console.error('Error retrieving waiver signature:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Route to get all waiver signatures
router.get('/getAllWaiverSignatures', async (req, res) => {
    try {
        const waiverSignatures = await waiverSignatureDB.getAllWaiverSignatures();
        return res.json(waiverSignatures);
    } catch (error) {
        console.error('Error getting all waiver signatures:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

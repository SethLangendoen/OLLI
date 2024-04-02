const express = require('express');
const staffDB = require("../Database/StaffDB.js")
const router = express.Router();
const auth = require("../Helpers/JwtAuth.js")

// Add Staff
router.post('/addStaff', auth, async (req, res) => {
    try {


        const name = req.body.name;
        const email = req.body.email;
        const wage = req.body.wage;
        const clockIn = req.body.clockIn;
        const clockOut = req.body.clockOut;
        const isOnline = req.body.isOnline;
        await staffDB.addStaff(name, email, wage, clockIn, clockOut, isOnline);
        res.status(201).send('Staff added successfully.');
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).send('Error adding staff.');
    }
});

router.get('/getAll', auth, async (req, res) => {

    try {
        const data = await staffDB.getAllStaff();

        res.json(data);
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).send('Error Getting All Staff');
    }
});

router.put('/clockIn', auth, async (req, res) => {
    const time = req.body.time;
    const email = req.body.email

    try {
        await staffDB.updateClockIn(email, time);

        res.json();
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).send('Error Getting All Staff');
    }
});
router.put('/clockOut', auth, async (req, res) => {
    const time = req.body.time;
    const email = req.body.email

    try {
        await staffDB.updateClockOut(email, time);

        res.json();
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).send('Error Getting All Staff');
    }
});



// Delete Staff
router.delete('/deleteStaff/:email', auth, async (req, res) => {
    try {
        const email = req.params.email;
        await staffDB.deleteStaff(email);
        res.status(200).send('Staff deleted successfully.');
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).send('Error deleting staff.');
    }
});

// Update Staff
router.put('/updateStaff', auth, async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const wage = req.body.wage;
        const clockIn = req.body.clockIn;
        const clockOut = req.body.clockOut;
        const isOnline = req.body.isOnline;

        await staffDB.updateStaff(name, email, wage, clockIn, clockOut, isOnline);
        res.status(200).send('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).send('Error updating staff.');
    }
});
router.put('/updateStaffStatus', auth, async (req, res) => {
    try {
        const email = req.body.email;
        const isOnline = req.body.isOnline;

        await staffDB.updateStatus(email, isOnline);
        res.status(200).send('Staff updated successfully.');
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).send('Error updating staff.');
    }
});

// Get Staff by Email
router.get('/getStaff/:email', auth, async (req, res) => {
    try {
        const email = req.params.email;
        const staff = await staffDB.getStaffByEmail(email);
        if (staff) {
            res.status(200).json(staff);
        } else {
            res.status(404).send('Staff not found.');
        }
    } catch (error) {
        console.error('Error getting staff by email:', error);
        res.status(500).send('Error getting staff by email.');
    }
});

// Get All Staff Online or Offline
router.get('/staffStatus/:isOnline', auth, async (req, res) => {
    try {
        const isOnline = req.params.isOnline; // Query parameter to specify online status
        const staff = await staffDB.getAllStaffByOnlineStatus(isOnline);
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error getting staff by online status:', error);
        res.status(500).send('Error getting staff by online status.');
    }
});


module.exports = router
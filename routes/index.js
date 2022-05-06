const express = require('express');
const ad = require('../models/adModel');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Call from router');
    next();
});

router.get('/ad', async (req, res) => {
    const cdate = new Date();
    const nad = new ad({
        name: 'test ad',
        endDate: cdate.setDate(cdate.getDate() + 1),
        price: 5000
    });
    await nad.save().then(() => {
        res.send('new ad saved!');
    }).catch((ex) => {
        console.log(ex);
    });
});

module.exports = router;
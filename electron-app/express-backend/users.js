const express = require('express');
const router = express.Router();
const { uIO } = require('./fileIO');

router.get('/', (req, res) => {
    res.status(200).json(uIO.readFile());
});

router.post('/create', (req, res) => {
    return res.sendStatus(uIO.addUser(req.query));
});

module.exports = router;
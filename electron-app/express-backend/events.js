const express = require('express');
const router = express.Router();
const { eIO, rIO } = require('./fileIO');

router.use(express.json());

router.get('/', (req, res) => {
    res.status(200).json(eIO.readFile());
});

router.put('/put', (req, res) => {
    return res.sendStatus(eIO.putEvent(req.body));
});

router.delete('/delete', (req, res) => {
    const eventStatus = eIO.deleteEvent(req.query);
    if (eventStatus === 200) {
        return res.sendStatus(rIO.deleteEvent(req.query));
    }
    return res.sendStatus(eventStatus);
});

router.get('/RSVPs', (req, res) => {
    return res.status(200).json(rIO.readFile());
});

router.get('/getRSVPs', (req, res) => {
    const rsvps = rIO.getRSVPs(req.query);
    if (rsvps == 400) {
        return res.sendStatus(400);
    }
    res.status(200).json(rsvps);
});

router.put('/putRSVP', (req, res) => {
    return res.sendStatus(rIO.putRSVP(req.query));
});

router.delete('/deleteRSVP', (req, res) => {
    return res.sendStatus(rIO.deleteRSVP(req.query));
});

module.exports = router;
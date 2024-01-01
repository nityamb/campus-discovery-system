const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Campus discovery system backend is up and running');
});

const eventsRouter = require('./events');
app.use('/events', eventsRouter);

const usersRouter = require('./users');
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
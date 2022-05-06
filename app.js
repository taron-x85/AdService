const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
//
mongoose.connect('mongodb://localhost:27017/addb',
    { useNewUrlParser: true })
    .then(() => {
        console.log('Db connected!');
    })
    .catch(ex => console.log(ex));
//
const apiRoute = require('./routes/index');

app.use(bodyParser.json());

app.use('/api', apiRoute);

app.get('/', (req, res) => {
    res.end('Ad Server started bulding..');
});

app.listen(3020, () => {
    console.log('Server Started!');
});
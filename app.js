require('dotenv').config();
const express = require('express');
const Routes = require('./routes/index');
const connectToDb = require('./db/db');

const app = express();
connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', Routes);

module.exports = app;

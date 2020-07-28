require('dotenv/config');
const express = require('express');
const router = require('./router');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(router);

app.listen(PORT);


require("dotenv").config();
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Resume API is running on http://localhost:${PORT}`);
});
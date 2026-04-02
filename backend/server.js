const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

//test endpoint
app.get('/', (req,res) => {
    res.send('Backend tira');
});

//iniciar server
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

const car_wash = require("./projects/carwash/server.js")

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended : false }));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(car_wash.app)

app.listen(5000, () => console.log('app is running'));
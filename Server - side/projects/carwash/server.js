const { DbService } = require('./dbService');
const express = require('express');
const axios = require('axios')
const app = express();

//insert_new_appointment 
app.put('/carwash/insert_new_appointment', (req, response) => {
    const { name, number, email, reg, date, time } = req.body

    let editTime = ""
    if(time.length == 1){
        editTime = `0${time}`
    } else {
        editTime = time
    }

    let data = {
        from: "HStvatthall",
        to: `+46${number.substring(1)}`,
        message: `Nu fins det en bokad tid för din bil med REG: ${reg}، den ${date} kl ${editTime}:00 hos oss.`
    }
    const authKey = Buffer.from(process.env.AuthKey).toString("base64");
    const url = process.env.SmsUrl;
    data = new URLSearchParams(data);
    data = data.toString();
    const config = {
        headers: {
            "Authorization": "Basic " + authKey
        }
    };

    axios.post(url,data,config)
    .then(res  => {

        const db = DbService.getDbServiceInstance();
        const result = db.insert_new_appointment(name, number, email, reg, date, time);
        
        result
        .then(data => response.json(data))
        .catch(err => console.log(err));
        
    })
    .catch(err => {
        response.sendStatus(400)
        console.log(err)
    })

})

app.post('/carwash/search_date', (req, res) => {
    const { date } = req.body
    const db = DbService.getDbServiceInstance();
    const result = db.searching_date(date);

    result
        .then(data => res.json(data))
        .catch(err => console.log(err));
})

app.post('/carwash/search_time', (req, res) => {
    const { time, date } = req.body
    const db = DbService.getDbServiceInstance();
    const result = db.searching_time(time, date);

    result
        .then(data => res.json(data))
        .catch(err => console.log(err));
})

module.exports = { app };
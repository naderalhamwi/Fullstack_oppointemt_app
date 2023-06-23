import functions from './functions.js';
let api = process.env.api;

const date_select = document.getElementById('date');
const time_select = document.getElementById('time');

const name = document.getElementById('name');
const nummber = document.getElementById('nummber');
const email = document.getElementById('email');
const reg = document.getElementById('reg');

const reg_validator = document.getElementById('reg_validator');
const nummber_validator = document.getElementById('nummber_validator');
const name_validator = document.getElementById('name_validator');
const email_validator = document.getElementById('email_validator');

const date_list = functions.date_manger();

let oppoitment = {};

function init() {

    for (let i = 0; i < date_list.length; i++) {
        const option = document.createElement('option');
        option.value = date_list[i];
        option.setAttribute('id', date_list[i]);
        date_select.append(option);
    }

    document.getElementById('boka_btn').addEventListener('click', () => {
        if (chek_if_valid()) {
            save_oppoitment();
        }
    })

    date_select.addEventListener('change', (e) => {
        if (e.target.value == "0") {
            time_select.innerHTML = "";
            const defult_option = document.createElement('option');
            defult_option.innerText = "tider";
            defult_option.setAttribute('value', 0);
            time_select.append(defult_option);
        } else {
            time_manger(e.target.value);
        }
    })

    date_select_manger();

} window.onload = init();

function chek_if_valid() {
    let message_err = "";

    const nummber_pattern = /^07\d{8}$/;
    if (nummber_pattern.test(nummber.value) && nummber.value != "0700000000") {
        nummber_validator.style.color = "green";
        oppoitment.number = nummber.value;
    } else {
        if (nummber.value == "") {
            delete oppoitment.number;
        }
        message_err = "mobil nummer";
        nummber_validator.style.color = "#dc2f55";
    }

    const reg_pattern = /[A-Za-z]{3}[0-9]{3}/;
    const reg_pattern2 = /[A-Za-z]{3}[0-9]{2}[A-Za-z]{1}/;
    if (reg_pattern.test(reg.value) || reg_pattern2.test(reg.value)) {
        reg_validator.style.color = "green";
        oppoitment.reg = reg.value.toUpperCase();
    } else {
        if (reg.value == "") {
            delete oppoitment.reg;
        }
        message_err = "reg"
        reg_validator.style.color = "#dc2f55";
    }

    if (date_select.value != 0) {
        date_select.style.color = "green";
        for (let i = 0; i < date_select.children.length; i++) {
            if (date_select.children[i].disabled != true) {
                date_select.children[i].style.color = "white";
            }
        }
        oppoitment.date = date_select.value;
    } else {
        if (date_select.value == "0") {
            delete oppoitment.date;
        }
        message_err = "datum";
        date_select.style.color = "#dc2f55";
    }

    if (time_select.value != 0) {
        time_select.style.color = "green";
        for (let i = 0; i < time_select.children.length; i++) {
            if (time_select.children[i].disabled != true) {
                time_select.children[i].style.color = "white";
            }
        }
        oppoitment.time = time_select.value;
    } else {
        if (time_select.value == "0") {
            delete oppoitment.time;
        }
        message_err = "tid";
        time_select.style.color = "#dc2f55";
    }

    if (Object.keys(oppoitment).length == 4) {
        return true;
    } else {
        document.getElementById('message').innerText = `Dubbel kolla ${message_err} !`;
        return false;
    }
}

function save_oppoitment() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(oppoitment);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(oppoitment),
        redirect: 'follow'
    };

    fetch(`${api}/insert_new_appointment`, requestOptions)
        .then(response => {
            if (response.status == 200) {
                alert("du har boka en tid!");
                name.value = "";
                nummber.value = "";
                email.value = "";
                reg.value = "";
                date_select.value = "0";
                time_select.innerHTML = "";
                reg_validator.style.color = "#65657b";
                nummber_validator.style.color = "#65657b";
                name_validator.style.color = "#65657b";
                email_validator.style.color = "#65657b";
                oppoitment = {};
                location.reload();
            } else {
                document.getElementById('message').innerText = `Dubbel kolla mobil nummer!`;
            }
        })
        .catch(error => console.log('error', error));
}

function date_select_manger() {

    for (let i = 0; i < date_list.length; i++) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "date": date_list[i]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${api}/search_date`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const count = JSON.parse(result)[0].count;
                if (date_list[i] === "0" || date_list[i] === "5" || date_list[i] === "6") {

                } else {
                    if (count != 8) {
                        document.getElementById(date_list[i]).innerText = date_list[i];
                    } else {
                        document.getElementById(date_list[i]).innerText = date_list[i] + " dagen är full bokad !";
                        document.getElementById(date_list[i]).disabled = true;
                    }
                }
            })
            .catch(error => console.log('error', error));
    }
}

function time_manger(date) {
    time_select.innerHTML = "";
    const defult_option = document.createElement('option');
    defult_option.innerText = "Tider";
    defult_option.value = "0";
    const start_time = 9;
    const end_time = 17;

    const length = end_time - start_time;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    for (let i = 0; i < length; i++) {
        let num = `${start_time + i}`;
        let num_formated = "";

        if (num.length == 1) {
            num_formated = `0${num}:00`;

        } else {

            num_formated = `${num}:00`;
        }

        var raw = JSON.stringify({
            "date": date,
            "time": num
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${api}/search_time`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const option = document.createElement('option');
                option.value = num;

                if (result === "false") {
                    option.innerText = num_formated;
                } else {
                    option.innerText = num_formated + " tiden är redan bokad !";
                    option.disabled = true;
                }

                time_select.append(option);
            })
            .catch(error => console.log('error', error));
    }
}
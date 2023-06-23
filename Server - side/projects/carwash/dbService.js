const mysql = require('mysql');
let instance = null;

const connection = mysql.createConnection({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    // CREATE appointment
    async insert_new_appointment(name, number, email, reg, date, time) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                INSERT INTO appointments (name, number, email, reg, date, time) VALUES (?,?,?,?,?,?);
                `;
                connection.query(query, [name, number, email, reg, date, time], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return response.insertId;
                
        } catch (error) {
            console.log(error);
        }
    }

    // GET ALL appointment
    async get_all_appointments() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM appointments;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE appointment
    async delete_appointments(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM appointments WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // UPDATE appointment
    async update_appointment(id, name, number, email, reg, date, time) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE appointments SET name = ?, number = ?, email = ?, reg = ?, date = ?, time = ? WHERE id = ?;";
    
                connection.query(query, [name, number, email, reg, date, time, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searching_date(date) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT COUNT(date) AS count, date FROM appointments WHERE date = ?;";
                connection.query(query, [date],  (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async searching_time(time, date) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT time FROM appointments WHERE time = ? AND date = ?;";
                connection.query(query, [time, date],  (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response.length === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { DbService };
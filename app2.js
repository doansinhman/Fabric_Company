var mysql = require('mysql');
const { exit } = require('process');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "ass",
//     password: "ass2"

// });

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "new_schema",
    password: "ass2"
});

con.connect(function(err) {
    if (err) throw err;
});

// con.query("show tables;", function(err, result, fields) {
//     if (err) throw err;
//     result.forEach(element => {
//         console.log('DROP TABLE `' + element.Tables_in_ass + '`;');
//     });
// });
// con.query("DELETE FROM `group` WHERE name='Normal';", function(err, result, fields) {
//     if (err) throw err;
//     console.log(result);
// });
con.query("SELECT * FROM customer;", function(err, result, fields) {
    if (err) throw err;
    console.log(result);
});
// con.query("CALL usp_customer_insert('Khach hang D', 'ĐHBK', '0123456789', '2001-11-22', null, null, null);", function(err, result, fields) {
//     if (err) throw err;
//     console.log(result);
// });

// const saltRounds = 10;
// const bcrypt = require('bcrypt');
// let hash = bcrypt.hashSync('01248766722', saltRounds);
// console.log(hash);

con.end()
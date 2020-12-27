const mysql = require('mysql');
const utils = require('../controllers/utils')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "ass2",
    password: "ass2"
});
con.connect(function(err) {
    if (err) throw err;
});

module.exports.getCustomerById = async(id) => {
    let query = "SELECT * FROM CUSTOMER WHERE id=" + id;
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.updateCustomer = async(id, cus) => {
    let query = "UPDATE CUSTOMER SET name=?, gender=?, address=?, phoneNum=?, birthdate=? WHERE id=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [cus.name, cus.gender, cus.address, cus.phoneNum, cus.birthdate, id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.updateCustomerPw = async(id, raw) => {
    let query = "UPDATE CUSTOMER SET pw=? WHERE id=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [utils.hashPw(raw), id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}


module.exports.updateEmployeePw = async(id, raw) => {
    let query = "UPDATE EMPLOYEE SET pw=? WHERE id=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [utils.hashPw(raw), id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.updateEmployee = async(id, emp) => {
    let query = "UPDATE EMPLOYEE SET name=?, gender=?, address=?, phoneNum=?, birthdate=? WHERE id=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [emp.name, emp.gender, emp.address, emp.phoneNum, emp.birthdate, id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getCustomerByUsername = async(username) => {
    let query = "SELECT * FROM CUSTOMER WHERE username='" + username + "';";
    console.log(query);
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getEmployeeById = async(id) => {
    let query = "SELECT * FROM EMPLOYEE WHERE id=" + id;
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getEmployeeByUsername = async(username) => {
    let query = "SELECT * FROM EMPLOYEE WHERE username='" + username + "';";
    console.log(query);
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getAllProducts = async() => {
    let query = "SELECT * FROM PRODUCT;";
    console.log(query);
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.insertCustomer = async(cus) => {
    let query = "INSERT INTO CUSTOMER VALUES(null,?,?,?,?,?,0,null,'Default',?,?);";
    let param = [cus.name, cus.gender, cus.address, cus.phoneNum, cus.birthdate, cus.username, utils.hashPw(cus.pw)];
    return new Promise((resolve, reject) => {
        con.query(query, param, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.insertProductAndGetId = async(pro) => {
    let query = "SELECT insertProductAndGetId(?,?,?,?,?,?,?,?,?,?) AS id;"
    let param = [pro.name, pro.description, pro.color, pro.image, pro.type, pro.form, pro.supplier, pro.quantity, pro.unit, pro.unitPrice];
    return new Promise((resolve, reject) => {
        con.query(query, param, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.deleteProductByIdAndImage = async(id, image) => {
    let query = "DELETE FROM PRODUCT WHERE id=? AND image=?";
    return new Promise((resolve, reject) => {
        con.query(query, [id, image], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.updateProductAndGetImage = async(pro) => {
    let query = "SELECT updateProductAndGetImage(?,?,?,?,?,?,?,?,?,?,?) AS image;"
    let param = [pro.id, pro.name, pro.description, pro.color, pro.image, pro.type, pro.form, pro.supplier, pro.quantity, pro.unit, pro.unitPrice];
    return new Promise((resolve, reject) => {
        con.query(query, param, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.insertOrderByCart = async(cart, cusId, address, note) => {
    console.log(cart);
    let query = "SELECT insertOrderAndGetId(?,?,?,?)AS id;"
    let param = [note, address, cusId, null];
    return new Promise((resolve, reject) => {
        con.query(query, param, async function(err, result, fields) {
            if (err) reject(err);
            let orderId = result[0].id;
            for (let productId in cart) {
                let qry = "CALL insertInclude(?,?,?);";
                con.query(qry, [+orderId, +productId, +cart[productId]], function(err, result, fields) {
                    if (err) reject(err);
                });
            }
            resolve(true);
        });
    });
}

module.exports.getAllOrders = async() => {
    let query = "SELECT * FROM `ORDER`;";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.confirmOrder = async(orderId, sellId) => {
    let query = "UPDATE `ORDER` SET sellId=?, status=? WHERE id=? AND sellId IS NULL;";
    return new Promise((resolve, reject) => {
        con.query(query, [sellId, 'Processing', orderId], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.cancelOrder = async(orderId) => {
    let query = "UPDATE `ORDER` SET status=? WHERE id=? AND sellId IS NULL;";
    return new Promise((resolve, reject) => {
        con.query(query, ['Canceled', orderId], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getDetailOfOrder = async(id) => {
    let query = "CALL getDetailOfOrder(?);";
    return new Promise((resolve, reject) => {
        con.query(query, [id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result[0][0]);
        });
    });
}

module.exports.getReleasedOfOrder = async(id) => {
    let query = "CALL getReleasedOfOrder(?);";
    return new Promise((resolve, reject) => {
        con.query(query, [id], function(err, result, fields) {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
}

function checkIfOrderCompleted(releasedOfOrder) {
    for (let i = 0; i < releasedOfOrder.length; i++) {
        if (releasedOfOrder[i].ordered_quantity > releasedOfOrder[i].released_quantity)
            return false;
    }
    return true;
}

module.exports.insertReleasement = async(orderId, sellId, release) => {
    console.log(release);
    let query = "UPDATE `ORDER` SET sellId=?, status=? WHERE id=? AND sellId IS NULL;"
    con.query(query, [sellId, 'Processing', orderId], function(err, result, fields) {
        if (err) console.log(err);
    });
    query = "SELECT insertReleasementAndGetId(?,?) as id;";
    return new Promise((resolve, reject) => {
        con.query(query, [orderId, sellId], async function(err, result, fields) {
            if (err) console.log(err);

            let rlmId = result[0].id;
            for (let productId in release) {
                query = "CALL insertReleaseAndAddOwe(?,?,?);";
                console.log([+productId, rlmId, +release[productId]]);
                con.query(query, [+productId, rlmId, +release[productId]], function(err, result, fields) {
                    if (err) reject(err);
                });
            }

            if (checkIfOrderCompleted(await module.exports.getReleasedOfOrder(orderId))) {
                query = "UPDATE `ORDER` SET status=? WHERE id=?;";
                con.query(query, ['Completed', orderId], async function(err, result, fields) {
                    if (err) console.log(err);
                });
            }
            resolve(true);
        });
    });
}

module.exports.testQuery = async() => {
    let query = "CALL getReleasedOfOrder(269);";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}
async function main() {
    try {
        let ret = await module.exports.getReleasedOfOrder(269);
        console.log(ret);
    } catch (err) {
        console.log(err);
    }

    //con.end();
}
// main();




// module.exports.createMember = async(member) => {
//     let hash = bcrypt.hashSync(member.password, saltRounds);

//     let params = [member.full_name, member.gender == 'male' ? 0 : 1, member.birthday, member.email, member.phone_number,
//         member.user_name, hash
//     ];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO member (full_name, gender, birthday, email, phone_number, \
//             user_name, password) VALUES (?, ?, ?, ?, ?, ? ,?)', params,
//             function(err) {
//                 if (err) {
//                     if (err.errno == 19) {
//                         resolve(false);
//                     }
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createVendor = async(vendor) => {
//     let hash = bcrypt.hashSync(vendor.password, saltRounds);

//     let params = [vendor.full_name, vendor.court_name, vendor.gender == 'male' ? 0 : 1, vendor.birthday, vendor.email, vendor.phone_number,
//         vendor.user_name, hash
//     ];
//     console.log(params);
//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO vendor (full_name, court_name, gender, birthday, email, phone_number, \
//             user_name, password) VALUES (?, ?, ?, ?, ?, ? ,?, ?)', params,
//             function(err) {
//                 if (err) {
//                     if (err.errno == 19) {
//                         resolve(false);
//                     }
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createManager = async(manager) => {
//     let hash = bcrypt.hashSync(manager.password, saltRounds);

//     let params = [manager.user_name, hash];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO manager VALUES (?, ?)', params,
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createScreen = async(screen) => {
//     let hash = bcrypt.hashSync(screen.password, saltRounds);

//     let params = [screen.user_name, hash];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO screen VALUES (?, ?)', params,
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createCashier = async(cashier) => {
//     let hash = bcrypt.hashSync(cashier.password, saltRounds);

//     let params = [cashier.user_name, hash];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO cashier VALUES (?, ?)', params,
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };

// module.exports.createCook = async(cook) => {
//     let hash = bcrypt.hashSync(cook.password, saltRounds);

//     let params = [cook.court_id, cook.user_name, hash];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO cook VALUES (?, ?, ?)', params,
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };

// module.exports.loginMember = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM member WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.loginVendor = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM vendor WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.loginManager = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM manager WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.loginScreen = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM screen WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.loginCashier = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM cashier WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.loginCook = async(user_name, password) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM cook WHERE user_name = "' + user_name + '"', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else if (rows && bcrypt.compareSync(password, rows[0].password))
//                 resolve(rows[0]);
//             resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };

// module.exports.getAllFood = async() => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food', function(err, rows) {
//             if (rows)
//                 resolve(rows);
//             else
//                 resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.getFoodByCourtId = async(court_id) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food WHERE court_id=' + court_id, function(err, rows) {
//             if (rows)
//                 resolve(rows);
//             else
//                 resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.getFoodById = async(id) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food WHERE id=' + id, function(err, rows) {
//             if (rows && rows[0])
//                 resolve(rows[0]);
//             else
//                 resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createFood = async(food, court_id) => {
//     let params = [court_id, food.name, food.price, true, food.type, food.description];

//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO food (court_id, name, price, available, type, description)\
//                 VALUES (?, ?, ?, ?, ?, ?)', params,
//             function(err) {
//                 if (err) {
//                     console.log(err);
//                     resolve(-1 /*, message: "Một nhà cung cấp không được có 2 sản phẩm cùng tên."*/ );
//                 } else {
//                     db.all('SELECT id, court_id FROM food WHERE (name="' + food.name + '")', function(err, rows) {
//                         if (err) {
//                             console.log(err);
//                             resolve(-2 /*, message: "Lỗi không xác định."*/ );
//                         } else {
//                             console.log(('get id successfully'))
//                             if (rows && rows[0]) {
//                                 resolve( /*, message: "Tạo món thành công."*/ rows[0].id);
//                             }
//                         }
//                     });
//                 }
//             }
//         );
//     }).catch((error) => { console.log(error) });
// };
// module.exports.deleteFood = async(id, court_id) => {
//     return new Promise((resolve, reject) => {
//         db.run('DELETE FROM food WHERE (id=' + id + ') AND (court_id=' + court_id + ')',
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// }
// module.exports.updateFood = async(food) => {
//     //let params = [food.name, food.price, food.available, food.type, food.description];
//     return new Promise((resolve, reject) => {
//         db.run('UPDATE food SET name="' + food.name + '", price=' + food.price + ', available=' + food.available + ', type=\'' + food.type + '\', description="' + food.description + '"\
//                 WHERE (id=' + food.id + ') AND (court_id=' + food.court_id + ')',
//             function(err) {
//                 if (err) {
//                     resolve(false);
//                     console.log(err);
//                 } else
//                     resolve(true);
//             }
//         );
//     }).catch((error) => { console.log(error) });
// }
// module.exports.getFoodByFoodName = async(foodName) => {
//     /*
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food WHERE name LIKE "' + foodName + '"', function(err, rows) {
//             if (err) {
//                 console.log(err);
//             } else if (rows)
//                 resolve(rows);
//             else
//                 resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
//     */
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food', function(err, rows) {
//             if (err) {
//                 console.log(err);
//             } else if (rows) {
//                 let upper = foodName.toUpperCase();
//                 resolve(rows.filter((row) => (upper.indexOf(row.name.toUpperCase()) > -1) || (row.name.toUpperCase().indexOf(upper) > -1)));
//             } else
//                 resolve(null);
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.getFoodByCourtName = async(courtName) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT food.id, food.court_id, food.name, food.price, food.available, food.type, food.description \
//         FROM (food INNER JOIN vendor ON food.court_id = vendor.id) WHERE vendor.court_name LIKE "' + courtName + '"',
//             function(err, rows) {
//                 if (err) {
//                     console.log(err);
//                 } else if (rows)
//                     resolve(rows);
//                 else
//                     resolve(null);
//             });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.getFoodByFoodType = async(foodType) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM food', function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve(null);
//             } else resolve(rows.filter((value, index, array) => {
//                 try {
//                     let typeArr = JSON.parse(value.type);
//                     return typeArr.some((value, index, array) => value.toUpperCase() == foodType.toUpperCase());
//                 } catch (e) {
//                     return false;
//                 }
//             }));
//         });
//     }).catch((error) => { console.log(error) });
// };
// module.exports.createOrder = async(cart, date) => {
//     return new Promise((resolve, reject) => {
//         db.run('INSERT INTO "order" (list, paid, date) VALUES(\'' + JSON.stringify(cart) + '\', 0, \'' + date + '\')', function(err) {
//             if (err) {
//                 console.log("err in insert");
//                 console.log(err);
//             } else {
//                 db.all('SELECT id FROM "order" WHERE (list=\'' + JSON.stringify(cart) + '\') AND (date=\'' + date + '\')', function(err, rows) {
//                     if (err) {
//                         console.log(err);
//                         resolve(-1);
//                     } else {
//                         console.log(('get id successfully'))
//                         if (rows && rows[0]) {
//                             resolve(rows[0].id);
//                         } else {
//                             resolve(-1);
//                         }
//                     }
//                 });
//             }
//         });
//     });
// };
// module.exports.getOrderById = async(id) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM "order" WHERE id=' + id, async function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve(null);
//             } else if (rows && rows[0]) {
//                 //id name price count
//                 let cart = {};
//                 try {
//                     cart = JSON.parse(rows[0].list);

//                     for (key in cart) {
//                         let food = await module.exports.getFoodById(key);
//                         cart[key] = {
//                             name: food.name,
//                             price: food.price,
//                             count: cart[key]
//                         }
//                     }
//                     resolve({ cart: cart, date: rows[0].date, paid: rows[0].paid });
//                 } catch (e) {
//                     console.log(e);
//                     resolve(null);
//                 }
//             } else {
//                 resolve(null);
//             }
//         });
//     });
// };
// module.exports.confirmOrder = async(cashier_user_name, order_id, date) => {
//     return new Promise(async(resolve, reject) => {
//         let order = await module.exports.getOrderById(order_id);
//         if (order && order.paid == 0) {
//             let bool1 = await new Promise((resolve2, reject2) => {
//                 db.run('UPDATE "order" SET paid=1 WHERE paid=0 AND id=' + order_id, function(err) {
//                     if (err) {
//                         console.log(err);
//                         resolve2(false);
//                     } else resolve2(true);
//                 });
//             });

//             let bool2 = await new Promise((resolve2, reject2) => {
//                 db.run('INSERT INTO confirm VALUES(?, ?, ?)', [cashier_user_name, order_id, date], function(err) {
//                     if (err) {
//                         console.log(err);
//                         resolve2(false);
//                     } else resolve2(true);
//                 });
//             });

//             //create new service record
//             if (bool1 && bool2) {
//                 let remain = await new Promise((resolve, reject) => {
//                     db.all('SELECT list FROM "order" WHERE id=' + order_id, function(err, rows) {
//                         if (!err && rows && rows[0]) {
//                             resolve(rows[0].list);
//                         } else {
//                             console.log(err);
//                             resolve(null);
//                         }
//                     });
//                 });
//                 db.run('INSERT INTO service VALUES(?, ?)', [order_id, remain], function(err) {
//                     if (err) {
//                         console.log(err);
//                         resolve(false);
//                     } else resolve(true);
//                 });
//             }
//             resolve(bool1 && bool2);
//         } else
//             resolve(false);
//     });
// };
// //get report from database
// module.exports.getReport = async(court_id) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM "order"', async function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve(null);
//             } else {
//                 let report = [];
//                 // report contain id, name, count, date, amount.
//                 let count = 0;
//                 for (let i = 0; i < rows.length; i++) {
//                     if (rows[i].paid == 1) {
//                         let cart = JSON.parse(rows[i].list);
//                         for (const key in cart) {
//                             let food = await module.exports.getFoodById(key);
//                             //if manager getReport, court_id = -1, manager get all item
//                             //else vendor get report, get vendor's items
//                             if (food.court_id != court_id && court_id != -1) continue;
//                             report[count] = {
//                                 id: key,
//                                 name: food.name,
//                                 count: cart[key],
//                                 price: food.price,
//                                 amount: food.price * cart[key],
//                                 date: rows[i].date
//                             }
//                             count++;
//                         }
//                     } else { continue; }
//                 }
//                 resolve(report);
//             }
//         });
//     });
// };

// module.exports.getFoodsNeedToServiceOfVendor = async(court_id) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM service WHERE remain IS NOT NULL AND remain!="{}"', async function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve(null);
//             } else {
//                 if (!rows) {
//                     resolve(null);
//                 }

//                 let arr = {};
//                 let len = rows.length;
//                 for (let i = 0; i < len; i++) {
//                     let remain = JSON.parse(rows[i].remain);
//                     for (foodId in remain) {
//                         let food = await module.exports.getFoodById(foodId);
//                         if (food.court_id == court_id) {
//                             if (arr['' + foodId]) {
//                                 arr['' + foodId].count += remain[foodId];
//                             } else {
//                                 arr['' + foodId] = { name: food.name, count: remain[foodId] };
//                             }
//                         }
//                     }
//                 }
//                 resolve(arr);
//             }
//         });
//     });
// };

// module.exports.submitPreparedFood = async(foodId, count) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM service WHERE remain IS NOT NULL AND remain!="{}"', async function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve(false);
//             } else {
//                 if (!rows) {
//                     resolve(false);
//                 }

//                 let len = rows.length;
//                 for (let i = 0; i < len; i++) {
//                     let remain = JSON.parse(rows[i].remain);
//                     if (remain['' + foodId]) {
//                         if (remain['' + foodId] > count) {
//                             remain['' + foodId] -= count;
//                             count = 0;
//                         } else if (remain['' + foodId] == count) {
//                             delete remain['' + foodId];
//                             count = 0;
//                         } else if (remain['' + foodId] < count) {
//                             count -= remain['' + foodId];
//                             delete remain['' + foodId];
//                         }
//                         //update db
//                         db.run('UPDATE service SET remain=\'' + JSON.stringify(remain) + '\' WHERE order_id=' + rows[i].order_id);

//                         if (count == 0) {
//                             break;
//                         }
//                     }
//                 }
//                 resolve(count == 0);
//             }
//         });
//     });
// };

// module.exports.getOrderStatus = async() => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM service ORDER BY order_id DESC LIMIT 100', function(err, rows) {
//             if (err || !rows || !rows[0]) {
//                 resolve(null);
//             } else {
//                 let len = rows.length;
//                 for (let i = 0; i < len; i++) {
//                     rows[i] = { id: rows[i].order_id, ready: rows[i].remain == '{}' }
//                 }
//                 resolve(rows);
//             }
//         });
//     });
// };

// /////////////////////////////////////////////////////////////////////////////////////////////
// // For manager only
// var genHash = str => bcrypt.hashSync(str, saltRounds);
// const op = '\''
// if (!String.prototype.format) {
//     String.prototype.format = function() {
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, function(match, number) {
//             return typeof args[number] != 'undefined' ?
//                 args[number] :
//                 match;
//         });
//     };
// }

// module.exports.getUsersByType = async(type) => {
//     return new Promise(
//         (resolve, reject) => {
//             db.all('SELECT * FROM ' + type,
//                 (err, rows) => {
//                     if (err || !rows || !rows[0]) {
//                         resolve(null);
//                     } else {
//                         resolve(rows);
//                     }
//                 }
//             )
//         }
//     )
// }
// module.exports.loadMemberData = async(user_name) => {
//     return new Promise((resolve, reject) => {
//         var str = 'SELECT * FROM member WHERE user_name=\'' + user_name + '\'';
//         db.all(str, (err, row) => {
//             if (err || !row || !row[0]) {
//                 console.log(str);
//                 resolve(null);
//             } else {
//                 resolve(row[0]);
//             }
//         })
//     })
// };
// module.exports.updateMemberData = async(user_name, data) => {
//     return new Promise(
//             (resolve, reject) => {
//                 var str = 'SELECT * FROM member WHERE user_name=\'' + user_name + '\'';
//                 db.all(str, (err, row) => {
//                     if (err || !row || !row[0]) {
//                         console.log(str);
//                         resolve(new Error('Cannot find user with that user_name'));
//                     } else {
//                         resolve(row[0]);
//                     }
//                 })
//             })
//         .then(
//             user => {
//                 console.log();
//                 user.full_name = data.full_name;
//                 user.birthday = data.birthday;
//                 user.phone_number = data.phone_number;
//                 user.email = data.email;

//                 var x = () => {
//                     return 'full_name=' + op + user.full_name + op +
//                         ',birthday=' + op + user.birthday + op +
//                         ',phone_number=' + user.phone_number +
//                         ',email=' + op + user.email + op;
//                 }
//                 var str = 'UPDATE member SET ' +
//                     x() +
//                     ' WHERE id = ' + user.id;
//                 db.all(str, (err) => (new Error(err)));
//             }
//         )
//         .catch(reason => console.log(reason));

// }
// module.exports.deleteMember = async(user_name) => {
//     return new Promise((resolve, reject) => {
//         var str = 'SELECT * FROM member WHERE user_name=\'' + user_name + '\'';
//         db.all(str, (err, rows) => {
//             if (err || !rows || !rows[0]) {
//                 resolve(false);
//             } else {
//                 var rem_str = 'DELETE FROM member WHERE id=' + rows[0].id
//                 db.run(rem_str, (err) => {
//                     if (err)
//                         resolve('Error occured when remove ' + user_name + ' from db');
//                     else resolve(true);
//                 });
//             }
//         })
//     })
// }
// module.exports.findMember = async(user_name) => {
//     return new Promise((resolve, reject) => {
//         var str = 'SELECT * FROM member WHERE user_name=\'' + user_name + '\'';
//         db.all(str, (err, rows) => {
//             if (err || !rows || !rows[0]) {
//                 resolve(false);
//             } else {
//                 resolve(true);
//             }
//         })
//     });
// }
// module.exports.changePassword = async(user_name, type, oldpw, newpw) => {
//     var str = "SELECT * FROM " + type + " WHERE user_name= ?";
//     return new Promise((resolve, reject) => {
//         db.all(str, [user_name],
//             (err, rows) => {
//                 if (err || !rows || !rows[0]) {
//                     resolve('Cannot find user with that user_name : ' + user_name);
//                 } else {
//                     var checkOldHAsh = genHash(oldpw) == rows[0].password;
//                     if (checkOldHAsh) {
//                         var updateStr = 'UPDATE ? SET password = ? WHERE user_name = ?';
//                         db.run(updateStr, type, genHash(newpw), user_name);
//                         resolve(true);
//                     } else
//                         resolve("wrong_pass");
//                 }
//             }
//         )
//     })
// }

// module.exports.forceChangePass = async(user_name, type, new_pass) => {
//     return new Promise((resolve, reject) => {
//         var str = "SELECT * FROM " + type + " WHERE user_name=?"
//         db.all(str, [user_name],
//             (err, rows) => {
//                 if (err || !rows || !rows[0]) {
//                     resolve('Cannot find user with that user_name :' + user_name);
//                     console.log(err);
//                     console.log(str);
//                 } else {
//                     if (new_pass.length < 6) {
//                         return resolve("Password length must longer or equal to 6")
//                     }
//                     var updateStr = 'UPDATE {0} SET password = ? WHERE user_name = ?'.format(type);
//                     db.run(updateStr, [genHash(new_pass), user_name]);
//                     resolve(true);
//                 }
//             }
//         );
//     });
// }
// module.exports.deleteStaff = async(user_name, type) => {
//     return new Promise((resolve, reject) => {
//         var str = 'SELECT * FROM {0} WHERE user_name= ?'.format(type);
//         db.all(str, user_name, (err, rows) => {
//             if (err || !rows || !rows[0]) {
//                 resolve(false);
//             } else {
//                 var rem_str = 'DELETE FROM {0} WHERE user_name= ?'.format(type);
//                 db.run(rem_str, rows[0].user_name, (err) => {
//                     if (err)
//                         resolve('Error occured when remove ' + user_name + ' from db');
//                     else resolve(true)
//                 });
//             }
//         })
//     })
// }

// module.exports.updateInformation = async(type, user_name, info) => {
//     return new Promise((resolve, reject) => {
//         let query = 'UPDATE "' + type + '" SET ';
//         let params = [];
//         for (key in info) {
//             if (key == "id" || key == "court_id" || key == "password") {
//                 delete info[key];
//                 continue;
//             }

//             query += key + '=?,';
//             params.push(info[key]);
//         }
//         query = query.substr(0, query.length - 1) + ' WHERE user_name="' + user_name + '"';

//         //console.log(query);
//         //console.log(params);
//         db.run(query, params, function(err) {
//             if (err) {
//                 console.log(err);
//                 resolve(false);
//             } else resolve(true);
//         })
//     })
// }

// module.exports.getUserByUsername = async(user_name, type) => {
//     return new Promise(
//         (resolve, reject) => {
//             db.all('SELECT * FROM ' + type + ' WHERE user_name="' + user_name + '"',
//                 (err, rows) => {
//                     if (err || !rows || !rows[0]) {
//                         resolve(null);
//                     } else {
//                         resolve(rows[0]);
//                     }
//                 }
//             )
//         }
//     )
// }
// module.exports.changePw = async(user_name, type, oldpw, newpw) => {
//     return new Promise(async(resolve, reject) => {
//         let user = await module.exports.getUserByUsername(user_name, type);
//         if (!user || !bcrypt.compareSync(oldpw, user.password)) {
//             resolve(false);
//         } else {
//             db.run('UPDATE ' + type + ' SET password=? WHERE user_name="' + user_name + '"', [genHash(newpw)], function(err) {
//                 if (err) {
//                     resolve(false);
//                 } else {
//                     resolve(true);
//                 }
//             })
//         }
//     });
// }

// module.exports.getVendorsName = async() => {

//     return new Promise((resolve, reject) => {
//         db.all('SELECT id, court_name FROM vendor', function(err, rows) {
//             if (err) {
//                 console.log(err);
//                 resolve({});
//             } else {
//                 let obj = {};
//                 rows.forEach(vendor => {
//                     obj["" + vendor.id] = vendor.court_name;
//                 });
//                 resolve(obj);
//             }
//         });
//     });
// }
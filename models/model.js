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

module.exports.initSession = async() => {
    let query = "CALL initSession();"
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            console.log('Initialized session.')
            resolve(result);
        })
    });
}

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

module.exports.getShipDeptByUsername = async(username) => {
    let query = "SELECT * FROM SHIP_DEPARTMENT WHERE username='" + username + "';";
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

module.exports.getProductsByName = async(name) => {
    let query = "SELECT * FROM PRODUCT WHERE REGEXP_LIKE(name, ?);";
    return new Promise((resolve, reject) => {
        con.query(query, [name], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getProductsByColor = async(color) => {
    let query = "SELECT * FROM PRODUCT WHERE REGEXP_LIKE(color, ?);";
    return new Promise((resolve, reject) => {
        con.query(query, [color], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getProductsByForm = async(form) => {
    let query = "SELECT * FROM PRODUCT WHERE REGEXP_LIKE(form, ?);";
    return new Promise((resolve, reject) => {
        con.query(query, [form], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getProductsByType = async(type) => {
    let query = "SELECT * FROM PRODUCT WHERE REGEXP_LIKE(type, ?);";
    return new Promise((resolve, reject) => {
        con.query(query, [type], function(err, result, fields) {
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

module.exports.getAllOrdersOfCustomer = async(cusId) => {
    let query = "SELECT * FROM `ORDER` WHERE cusId=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [cusId], function(err, result, fields) {
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

            // if (checkIfOrderCompleted(await module.exports.getReleasedOfOrder(orderId))) {
            //     query = "UPDATE `ORDER` SET status=? WHERE id=?;";
            //     con.query(query, ['Completed', orderId], async function(err, result, fields) {
            //         if (err) console.log(err);
            //     });
            // }
            resolve(true);
        });
    });
}

module.exports.insertShipment = async(ship, whid, sdid) => {
    let getOrderId = id => +id.split('_')[0];
    let getProductId = id => +id.split('_')[1];

    query = "SELECT insertShipmentAndGetId(?,?) as id;";
    return new Promise((resolve, reject) => {
        con.query(query, [whid, sdid], async function(err, result, fields) {
            if (err) console.log(err);

            let shipmentId = result[0].id;
            for (let pairId in ship) {
                query = "INSERT INTO SHIP VALUES(?, ?, ?, ?);";
                console.log([getOrderId(pairId), getProductId(pairId), shipmentId, +ship[pairId]]);
                con.query(query, [getOrderId(pairId), getProductId(pairId), shipmentId, +ship[pairId]], function(err, result, fields) {
                    if (err) reject(err);
                });
            }
            resolve(true);
        });
    });
}



module.exports.getAllUnships = async() => {
    let query = "CALL getAllUnships();";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
}

module.exports.getAllShipDepts = async() => {
    let query = "SELECT id, vehicle FROM INTERNAL_SHIP UNION SELECT id, vehicle FROM EXTERNAL_SHIP;";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getAllShipmentsOfWarehouse = async(whid) => {
    let query = "SELECT * FROM SHIPMENT WHERE warehouseId=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [whid], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getDetailsOfShipment = async(shipmentId) => {
    let query = "CALL getDetailsOfShipment(?);";
    return new Promise((resolve, reject) => {
        con.query(query, [shipmentId], function(err, result, fields) {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
}

module.exports.getAllShipmentsOfShipDept = async(sdid) => {
    let query = "SELECT * FROM SHIPMENT WHERE shipDeptId=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [sdid], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.triggerStartShipment = async(shipmentId, sdid) => {
    let query = "UPDATE SHIPMENT SET status=? WHERE id=? AND shipDeptId=? AND status!=?;";
    return new Promise((resolve, reject) => {
        con.query(query, ['Shipping', shipmentId, sdid, 'Completed'], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.triggerFinishShipment = async(shipmentId, sdid) => {
    let query = "UPDATE SHIPMENT SET status=? WHERE id=? AND shipDeptId=? AND status!=?;";
    checkOrderStatusAfterFinishShipment(shipmentId);
    return new Promise((resolve, reject) => {
        con.query(query, ['Completed', shipmentId, sdid, 'Preparing'], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.triggerLocateShipment = async(shipmentId, position, sdid) => {
    let query = "UPDATE SHIPMENT SET position=? WHERE id=? AND shipDeptId=? AND status!=?;";
    return new Promise((resolve, reject) => {
        con.query(query, [position, shipmentId, sdid, 'Completed'], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getAllReceipts = async() => {
    let query = "SELECT * FROM RECEIPT;";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.getAllPayments = async() => {
    let query = "SELECT * FROM PAYMENT;";
    return new Promise((resolve, reject) => {
        con.query(query, function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports.insertReceipt = async(amount, cusId, cashierId) => {
    let query = "INSERT INTO RECEIPT VALUES(null,?,?,?,?);"
    return new Promise((resolve, reject) => {
        con.query(query, [amount, new Date(), cusId, cashierId], function(err, result, fields) {
            if (err) reject(err);
            query = "UPDATE CUSTOMER SET owe=owe-? WHERE id=?;";
            con.query(query, [amount, cusId], function(err, result, fields) {
                if (err) reject(err);
                resolve(result);
            });
        })
    });
}

module.exports.insertPayment = async(amount, goal, cashierId) => {
    let query = "INSERT INTO PAYMENT VALUES(null,?,?,?,?);"
    return new Promise((resolve, reject) => {
        con.query(query, [amount, new Date(), goal, cashierId], function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        })
    });
}

async function checkOrderStatusAfterFinishShipment(shipmentId) {
    let checkIfOrderCompleted = releasedOfOrder => {
        for (let i = 0; i < releasedOfOrder.length; i++) {
            if (releasedOfOrder[i].ordered_quantity > releasedOfOrder[i].shipped_quantity)
                return false;
        }
        return true;
    }

    let query = "SELECT DISTINCT orderId FROM SHIP WHERE shipmentId=?;";
    con.query(query, [shipmentId], async function(err, result, fields) {
        if (err) console.log(err);
        result.forEach(row => {
            module.exports.getReleasedOfOrder(row.orderId).then(released => {
                if (checkIfOrderCompleted(released)) {
                    let q = "UPDATE `ORDER` SET status=? WHERE id=?;";
                    con.query(q, ['Completed', row.orderId], async function(err, result, fields) {
                        if (err) console.log(err);
                    });
                }
            }, err => {
                console.log(err);
            });
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

module.exports.initSession();

async function main() {
    try {
        let ret = await module.exports.triggerFinishShipment(3, 1);
        console.log(ret);
    } catch (err) {
        console.log(err);
    }

    //con.end();
}
// main();
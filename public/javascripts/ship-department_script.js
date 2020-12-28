var modal = null;
var UNSHIP = {};

function checkCreateInput() {
    return true;
}

function checkUpdateInput() {
    return true;
}

function createId(orderId, productId) {
    return orderId + '_' + productId;
}

function getOrderId(id) {
    return +id.split('_')[0];
}

function getProductId(id) {
    return +id.split('_')[1];
}

class TableRow {
    constructor() {
        this.htmlCode = '';
    }
    addTableData(innerHtml) {
        this.htmlCode += '\t<td>' + innerHtml + '</td>\n';
    }
    getHtmlCode() {
        return '<tr>\n' + this.htmlCode + '</tr>'
    }
}

function closeModal() {
    // When the user clicks on <span> (x), close the modal
    modal.style.display = "none";
}

function openModal() {
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showModal() {
    let ship = {};
    try {
        ship = JSON.parse(localStorage.getItem('ship'));
    } catch (e) {
        ship = {};
    }
    if (ship == null)
        ship = {};
    tbody = $('#ship-body');
    sd = $('#ship_dept');
    tbody.empty();
    sd.empty();
    $.post("/api/ship/ship_department", {},
        function(data, status) {
            console.log(data);
            if (status == 'success' && data) {
                data.forEach(dept => {
                    sd.append('<option>[' + dept.id + '] ' + dept.vehicle + '</option>');
                })
            }
        });
    for (let pairId in ship) {
        let ele = UNSHIP[pairId];
        console.log(ele);
        tr = new TableRow();
        tr.addTableData(ele.orderId);
        tr.addTableData(ele.address);
        tr.addTableData(ele.productId);
        tr.addTableData(ele.name);
        tr.addTableData(ele.unit);
        tr.addTableData(ship[pairId]);
        tbody.append(tr.getHtmlCode());
    }
    openModal();
}

function getAllShipments() {
    $.post("/api/ship", {},
        function(data, status) {
            if (status == 'success' && data) {
                console.log(data);
                tbody = $('#table-body');
                data.forEach(row => {
                    let tr = new TableRow();
                    tr.addTableData(row.id);
                    tr.addTableData(row.status);
                    tr.addTableData(row.position);
                    tr.addTableData(row.shipDeptId);
                    if (row.status == 'Preparing')
                        tr.addTableData('<button type="button" onclick="detailsShipment(' + row.id + ');"class="btn btn-outline-primary">Chi tiết</button>\n\
                                        <button type="button" onclick="startShipment(' + row.id + ');"class="btn btn-outline-warning">Khởi hành</button>');
                    else if (row.status == 'Shipping')
                        tr.addTableData('<button type="button" onclick="detailsShipment(' + row.id + ');"class="btn btn-outline-primary">Chi tiết</button>\n\
                                        <button type="button" onclick="locateShipment(' + row.id + ');"class="btn btn-outline-info">Báo vị trí</button>\n\
                                        <button type="button" onclick="finishShipment(' + row.id + ');"class="btn btn-outline-success">Hoàn thành</button>');
                    else
                        tr.addTableData('<button type="button" onclick="detailsShipment(' + row.id + ');"class="btn btn-outline-primary">Chi tiết</button>');
                    tbody.append(tr.getHtmlCode());
                });
            }
        });
}

function detailsShipment(id) {
    $.post("/api/ship/details", { id: id },
        function(data, status) {
            if (status == 'success' && data) {
                console.log(data);
                tbody = $('#ship-body');
                tbody.empty();
                data.forEach(row => {
                    let tr = new TableRow();
                    tr.addTableData(row.orderId);
                    tr.addTableData(row.productId);
                    tr.addTableData(row.name);
                    tr.addTableData(row.unit);
                    tr.addTableData(row.quantity);
                    tr.addTableData(row.cusName);
                    tr.addTableData(row.address);
                    tbody.append(tr.getHtmlCode());
                });
                openModal();
            }
        });
}

function startShipment(id) {
    $.post("/api/ship/start", { id: id },
        function(data, status) {
            if (status == 'success' && data) {
                new swal('Thành công', 'Bắt đầu khởi hành chuyến giao hàng.', 'success');
                timeOutReload(1000);
            }
        });
}

function finishShipment(id) {
    $.post("/api/ship/finish", { id: id },
        function(data, status) {
            if (status == 'success' && data) {
                new swal('Thành công', 'Đã báo hoàn thành chuyến giao hàng.', 'success');
                timeOutReload(1000);
            }
        });
}

function locateShipment(id) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            $.post("/api/ship/locate", {
                    id: id,
                    position: JSON.stringify([position.coords.latitude, position.coords.longitude])
                },
                function(data, status) {
                    if (status == 'success' && data) {
                        new swal('Thành công', 'Đã báo vị trí thành công.', 'success');
                        timeOutReload(1000);
                    }
                });
        });
    } else {
        new swal("Thất bại", "Không thể định vị được vị trí của bạn.", 'error');
    }
}
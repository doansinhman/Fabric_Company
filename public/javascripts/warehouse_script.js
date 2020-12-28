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

function getAllReleasements() {
    $.post("/api/ship/unship", {},
        function(data, status) {
            //console.log(data, status);
            if (status == 'success' && data) {
                let tbody = $('#table-body');
                data.forEach(ele => {
                    let tr = new TableRow();
                    tr.addTableData(ele.orderId);
                    tr.addTableData(ele.address);
                    tr.addTableData(ele.productId);
                    tr.addTableData(ele.name);
                    tr.addTableData(ele.unit);
                    tr.addTableData(ele.released_quantity);
                    tr.addTableData(ele.shipped_quantity);
                    let pairId = createId(ele.orderId, ele.productId);
                    UNSHIP[pairId] = ele;
                    let remain = (ele.released_quantity - ele.shipped_quantity);
                    tr.addTableData('<input id="' + pairId + '" type="number" onfocusout="updateShip(this);" value=' + getShip(pairId) + ' min=0 max=' + remain + '></input>');
                    tbody.append(tr.getHtmlCode());
                });
            }
        });
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

function updateShip(ele) {
    if (+ele.value > +ele.max)
        ele.value = ele.max;
    if (+ele.value < 0)
        ele.value = 0;
    let ship = {};
    try {
        ship = JSON.parse(localStorage.getItem('ship'));
    } catch (e) {
        ship = {};
    }
    if (ship == null)
        ship = {};
    let id = ele.id;
    let quan = ele.value;
    if (quan > 0)
        ship[id] = quan;
    else
        delete ship[id];

    localStorage.setItem('ship', JSON.stringify(ship));
}

function getShip(id) {
    let ship = {};
    try {
        ship = JSON.parse(localStorage.getItem('ship'));
    } catch (e) {
        ship = {};
    }
    if (ship == null)
        ship = {};
    if (ship[id])
        return ship[id];
    return 0;
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

function insertShipment() {
    if (localStorage.getItem('ship') == '{}')
        return new swal('Thất bại', 'Danh sách giao hàng đang rỗng.', 'error');
    $.post("/api/ship/insert", {
            ship: localStorage.getItem('ship'),
            sdid: +document.getElementById('ship_dept').value.slice(1).split(']')[0]
        },
        function(data, status) {
            if (status == 'success' && data) {
                new swal("Tạo chuyến giao hàng thành công!", {
                    icon: "success",
                });
                UNSHIP = {};
                localStorage.removeItem('ship');
                closeModal()
                timeOutReload(1000);
            }
        });
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
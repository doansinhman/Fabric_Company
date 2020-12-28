var PRODUCT = {};
var ORDER = {};
var modal = null;
var RELEASE = {};
var PROCESSING_ID = null;

function checkCreateInput() {
    return true;
}

function checkUpdateInput() {
    return true;
}

function getAllOrders() {
    $.post("/api/order", {
            target: 'cusId'
        },
        function(data, status) {
            //console.log(data, status);
            if (status == 'success' && data) {
                let tbody = $('#table-body');
                data.forEach(ord => {
                    ORDER[ord.id] = ord;
                    let tr = new TableRow();
                    tr.addTableData(ord.id);
                    tr.addTableData(new Date(ORDER[ord.id].createDate).toLocaleString());
                    tr.addTableData(ord.status);
                    tr.addTableData(ord.note);
                    tr.addTableData(ord.address);
                    tr.addTableData(ord.cusId);
                    tr.addTableData(ord.sellId);
                    tr.addTableData('<button type="button" class="btn btn-outline-primary" onclick="detailOrder(' + ord.id + ');">Chi tiết</button>')
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

function cancelOrder(id) {
    new swal({
            title: "Bạn đã chắc chắn?",
            text: "Bạn có muốn huỷ đơn hàng [" + id + "]?",
            icon: "error",
            buttons: true,
            dangerMode: true,
        })
        .then((cancel) => {
            if (cancel) {
                $.post("/api/order/cancel", {
                        id: id
                    },
                    function(data, status) {
                        if (status == 'success' && data) {
                            new swal("Huỷ đơn hàng thành công!", {
                                icon: "success",
                            });
                            timeOutReload(500);
                        }
                    });
            }
        });
}

function detailOrder(id) {
    $.post("/api/order/", {
            target: 'detail',
            value: id
        },
        function(data, status) {
            if (status == 'success' && data) {
                // console.log(data);
                $('#orderId').text(data.orderId);
                $('#cusId').text(data.cusId);
                $('#cusName').text(data.name);
                $('#cusAddress').text(data.cusAddress);
                $('#phoneNum').text(data.phoneNum);
            }
        });
    $.post("/api/order/", {
            target: 'released',
            value: id
        },
        function(data, status) {
            if (status == 'success' && data) {
                let match = false;
                if (PROCESSING_ID != id)
                    RELEASE = {};
                else
                    match = true;
                PROCESSING_ID = id;
                // console.log(data);
                tbody = $('#released-body');
                tbody.empty();
                data.forEach(row => {
                    let tr = new TableRow();
                    tr.addTableData(row.id);
                    tr.addTableData(row.name);
                    tr.addTableData(row.unit);
                    tr.addTableData(row.ordered_quantity);
                    tr.addTableData(row.released_quantity);
                    tr.addTableData(row.shipped_quantity);
                    tbody.append(tr.getHtmlCode());
                });
                openModal();
            }
        });
}
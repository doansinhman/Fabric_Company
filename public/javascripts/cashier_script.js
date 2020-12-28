function checkCreateInput() {
    return true;
}

function checkUpdateInput() {
    return true;
}

function getAllReceipts() {
    $.post("/cashier/receipt",
        function(data, status) {
            //console.log(data, status);
            if (status == 'success' && data) {
                let tbody = $('#table-body');
                let tr = new TableRow();
                tr.addTableData('<button type="button" class="btn btn-outline-primary" onclick="openModal();">Thêm</button>');
                tbody.append(tr.getHtmlCode());
                data.forEach(receipt => {
                    let tr = new TableRow();
                    tr.addTableData(receipt.id);
                    tr.addTableData(receipt.amount);
                    tr.addTableData(new Date(receipt.time).toLocaleString());
                    tr.addTableData(receipt.cusId);
                    tr.addTableData(receipt.cashierId);
                    tbody.append(tr.getHtmlCode());
                });
            }
        });
}

function getAllPayments() {
    $.post("/cashier/payment",
        function(data, status) {
            //console.log(data, status);
            if (status == 'success' && data) {
                let tbody = $('#table-body');
                let tr = new TableRow();
                tr.addTableData('<button type="button" class="btn btn-outline-primary" onclick="openModal();">Thêm</button>');
                tbody.append(tr.getHtmlCode());
                data.forEach(receipt => {
                    let tr = new TableRow();
                    tr.addTableData(receipt.id);
                    tr.addTableData(receipt.amount);
                    tr.addTableData(new Date(receipt.time).toLocaleString());
                    tr.addTableData(receipt.goal);
                    tr.addTableData(receipt.cashierId);
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

function insertReceipt() {
    new swal({
            title: "Bạn đã chắc chắn?",
            text: "Bạn có muốn tạo phiếu thu này?",
            icon: "info",
            buttons: true,
        })
        .then((confirm) => {
            if (confirm) {
                $.post("/cashier/receipt/insert", {
                        amount: document.getElementById('amount').value,
                        cusId: document.getElementById('cusId').value
                    },
                    function(data, status) {
                        if (status == 'success' && data) {
                            new swal("Tạo phiếu thu thành công!", {
                                icon: "success",
                            });
                            timeOutReload(1000);
                        }
                    });
            }
        });
}

function insertPayment() {
    new swal({
            title: "Bạn đã chắc chắn?",
            text: "Bạn có muốn tạo phiếu chi này?",
            icon: "info",
            buttons: true,
        })
        .then((confirm) => {
            if (confirm) {
                $.post("/cashier/payment/insert", {
                        amount: document.getElementById('amount').value,
                        goal: document.getElementById('goal').value
                    },
                    function(data, status) {
                        if (status == 'success' && data) {
                            new swal("Tạo phiếu chi thành công!", {
                                icon: "success",
                            });
                            timeOutReload(1000);
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
                    tr.addTableData(row.quantity);
                    tr.addTableData(row.ordered_quantity);
                    tr.addTableData(row.released_quantity);
                    if (row.released_quantity >= row.ordered_quantity)
                        tr.addTableData('❌');
                    else
                        tr.addTableData('<input id="product' + row.id + '" type="number" onfocusout="updateRelease(this);" value=' + (match ? RELEASE[row.id] : 0) + ' min=0 max=' + (row.ordered_quantity - row.released_quantity) + '></input>');
                    tbody.append(tr.getHtmlCode());
                });
                openModal();
            }
        });
}

function updateRelease(ele) {
    if (ele.value > 0)
        RELEASE[ele.id.slice(7)] = +ele.value;
    else
        delete RELEASE[ele.id.slice(7)];
}

function insertReleasement() {
    $.post("/api/order/release", {
            id: PROCESSING_ID,
            release: JSON.stringify(RELEASE)
        },
        function(data, status) {
            if (status == 'success' && data) {
                new swal("Xuất bán thành công!", {
                    icon: "success",
                });
                PROCESSING_ID = null;
                RELEASE = {};
                closeModal()
            }
        });
}
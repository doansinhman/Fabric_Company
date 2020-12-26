var PRODUCT = {};
var ORDER = {};
var modal = null;

function checkCreateInput() {
    return true;
}

function checkUpdateInput() {
    return true;
}

function getAllOrders() {
    $.post("/api/order", {
            target: 'all'
        },
        function(data, status) {
            console.log(data, status);
            if (status == 'success' && data) {
                let tbody = $('#table-body');
                data.forEach(ord => {
                    ORDER[ord.id] = ord;
                    let tr = new TableRow();
                    tr.addTableData(ord.id);
                    tr.addTableData(new Date(ORDER[264].createDate).toDateString());
                    tr.addTableData(ord.status);
                    tr.addTableData(ord.note);
                    tr.addTableData(ord.address);
                    tr.addTableData(ord.cusId);
                    tr.addTableData(ord.sellId);
                    if (ord.status != 'Pending') {
                        tr.addTableData('<button type="button" class="btn btn-outline-primary" onclick="detailOrder(' + ord.id + ');">Chi tiết</button>');
                    } else if (ord.status == 'Pending') {
                        tr.addTableData('<button type="button" class="btn btn-outline-primary" onclick="detailOrder(' + ord.id + ');">Chi tiết</button>\
                                        <button type="button" class="btn btn-outline-success" onclick="confirmOrder(' + ord.id + ');">Duyệt</button>\
                                        <button type="button" class="btn btn-outline-danger" onclick="cancelOrder(' + ord.id + ');">Huỷ</button>');
                    }
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

function confirmOrder(id) {
    new swal({
            title: "Bạn đã chắc chắn?",
            text: "Bạn có muốn duyệt đơn hàng [" + id + "]?",
            icon: "info",
            buttons: true,
        })
        .then((confirm) => {
            if (confirm) {
                $.post("/api/order/confirm", {
                        id: id
                    },
                    function(data, status) {
                        if (status == 'success' && data) {
                            new swal("Duyệt đơn hàng thành công!", {
                                icon: "success",
                            });
                            timeOutReload(500);
                        }
                    });
            }
        });
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

// var compatibleSwal = swal.mixin({
//     heightAuto: false
// })
// var allUser = []

// async function showChangePassDialog() {
//     const { value: password } = await compatibleSwal.fire({
//         title: 'Nhập mật khẩu mới',
//         input: 'text',
//         inputPlaceholder: 'Enter your password',
//     })
//     return password;
// };

// function cpw() {
//     showChangePassDialog().then(
//         newpass => {
//             if (newpass.length < 6) {
//                 compatibleSwal.fire("Độ dài mật khẩu phải từ 6 kí tự trở lên")
//                 return;
//             }
//             $.post('./api/ForceChangePass', {
//                     user_name: user.user_name,
//                     type: type,
//                     new_pass: newpass
//                 },
//                 result => {
//                     if (result == true) {
//                         compatibleSwal.fire("Đổi mật khẩu thành công");
//                     } else compatibleSwal.fire(result);
//                 });
//         }
//     )
// }
// async function deleteStaff(c) {
//     var user = c.data[0];
//     var type = c.data[1];
//     var f = function(user, type) {
//         $.post('./api/DeleteStaff', { 'user_name': user.user_name, 'type': type },
//             result => {
//                 if (result == true) {
//                     compatibleSwal.fire("Xoá thành công " + user.user_name)
//                         .then(() => location.reload());
//                 }
//             });
//     }

//     compatibleSwal.fire({
//         title: "Xác nhận xoá " + user.user_name,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes',
//         cancelButtonText: 'No',
//         heightAuto: false
//     }).then(result => { result.value ? f(user, type) : 0 })
// }

// function deleteMember(c) {
//     var user = c.data;
//     var f = function(user) {
//         $.post('./api/DeleteMember', { 'user_name': user.user_name },
//             result => {
//                 if (result) {
//                     compatibleSwal.fire({
//                             title: "Xoá thành công thành viên " + user.user_name,

//                         })
//                         .then(() => location.reload());
//                 }
//             });
//     }
//     compatibleSwal.fire({
//         title: "Xác nhận xoá " + user.user_name,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes',
//         cancelButtonText: 'No',
//     }).then(result => { result.value ? f(user) : 0 })
// }

// function queryMember(ty) {
//     var apiPath = './api/GetMember';

//     var count = 1;
//     var usertable = document.getElementById('user-table');
//     $.get(apiPath, data => {
//         data.forEach(user => {
//             allUser.push(user.user_name);
//             var row = usertable.insertRow(count++);
//             row.insertCell().innerHTML = user.id;
//             row.insertCell().innerHTML = user.full_name;
//             row.insertCell().innerHTML = user.gender == 0 ? 'Nam' : 'Nữ';
//             row.insertCell().innerHTML = user.birthday;
//             row.insertCell().innerHTML = user.email;
//             row.insertCell().innerHTML = user.phone_number;
//             row.insertCell().innerHTML = user.user_name;
//             row.insertCell().outerHTML =
//                 '<td>' +
//                 '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                 '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                 '</td>';
//             $('#del-usr' + count).click(user, deleteMember);
//             $('#ch-pass' + count).click(cpw);
//         });
//     });
// }

// function queryStaff(type) {
//     var apiPath = './api/GetStaffs';

//     var count = 1;
//     var usertable = document.getElementById('user-table');
//     $.get(apiPath, { ty: type }, data => {
//         data.forEach(user => {
//             allUser.push(user.user_name);
//             var row = usertable.insertRow(count++);
//             switch (type) {
//                 case 'cook': // court_id | user_name
//                     row.insertCell().innerHTML = user.court_id;
//                     row.insertCell().innerHTML = user.user_name;
//                     row.insertCell().outerHTML =
//                         '<td>' +
//                         // '<button type=\'button\' id=\'check-order' + count + '\' class=\'btn-cp\'> Orders </button>'+
//                         '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                         '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                         '</td>';
//                     break
//                 case 'vendor':
//                     row.insertCell().innerHTML = user.id;
//                     row.insertCell().innerHTML = user.full_name;
//                     row.insertCell().innerHTML = user.court_name;
//                     row.insertCell().innerHTML = user.gender == 0 ? 'Nam' : 'Nữ';
//                     row.insertCell().innerHTML = user.birthday;
//                     row.insertCell().innerHTML = user.email;
//                     row.insertCell().innerHTML = user.phone_number;
//                     row.insertCell().innerHTML = user.user_name;
//                     row.insertCell().outerHTML =
//                         '<td>' +
//                         '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                         '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                         '</td>';
//                     break
//                 case 'screen':
//                     row.insertCell().innerHTML = user.user_name;
//                     row.insertCell().outerHTML =
//                         '<td>' +
//                         '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                         '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                         '</td>';
//                     break
//                 case 'cashier':
//                     row.insertCell().innerHTML = user.user_name;
//                     row.insertCell().outerHTML =
//                         '<td>' +
//                         '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                         '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                         '</td>';
//                     break
//                 case 'screen':
//                     row.insertCell().innerHTML = user.user_name;
//                     row.insertCell().outerHTML =
//                         '<td>' +
//                         '<button type=\'button\' id=\'ch-pass' + count + '\' class=\'btn-cp\'> Ch. Password </button>' +
//                         '<button type=\'button\' id=\'del-usr' + count + '\' class=\'btn-cp\'> Delete </button>' +
//                         '</td>';
//                 default:
//                     row.innerHTML = "Default"
//             }
//             $('#del-usr' + count).click([user, type], deleteStaff);
//             $('#ch-pass' + count).click(cpw);
//         })
//     })
// }
// async function addStaff(eobj) {
//     var apiPath = './api/AddStaff';
//     var customswal = swal.mixin({
//         heightAuto: false,
//         customClass: {
//             input: 'custom-input'
//         }
//     })
//     var type = eobj.data;
//     console.log(type);
//     var inputHtml = '<input id="swal-input_username" class="swal2-input" placeholder="Tên đăng nhập">' +
//         '<input id="swal-input_password" class="swal2-input" type="password" placeholder="Mật khẩu">';
//     switch (type) {
//         case "cook":
//             inputHtml = '<input id="swal-input_courtid" class="swal2-input" placeholder="Mã quầy hàng">' + inputHtml;
//             break
//         case "vendor":
//             inputHtml = '<input id="swal-input_courtname" class="swal2-input" placeholder="Tên quầy hàng">' +
//                 '<input id="swal-input_fullname" class="swal2-input" placeholder="Họ và Tên">' +
//                 '<label class="radio-inline">' +
//                 '<input class="swal2-radio" type="radio" value="male" name="gender" checked>' + ' Nam ' +
//                 '</label>' +
//                 '<label class="radio-inline">' +
//                 '<input class="swal2-radio" type="radio" value="female" name=gender>' + ' Nữ ' +
//                 '</label>' +
//                 '<input id="swal-input_phone" class="swal2-input" placeholder="Số điện thoại">' +
//                 '<input id="swal-input_birthday" class="swal2-input" type="date" placeholder="Ngày sinh">' +
//                 '<input id="swal-input_email" class="swal2-input" type="email" placeholder="Email">' +
//                 inputHtml;
//             break
//         case "cashier":

//         case "screen":

//         default:

//     }
//     var data = await customswal.fire({
//         title: "Đăng ký cho nhân viên mới",
//         html: inputHtml,
//         focusConfirm: false,
//         showCancelButton: true,
//         reverseButtons: true,
//         preConfirm: () => {
//             let metReq = true;
//             let preval = {
//                     user_name: document.getElementById('swal-input_username').value,
//                     password: document.getElementById('swal-input_password').value
//                 }
//                 // test
//             if (allUser.includes(preval.user_name)) {
//                 document.getElementById('swal-input_username').style.outline = 'dashed red 2pt';
//                 metReq = false;
//             } else document.getElementById('swal-input_username').style.outline = 'unset'

//             if (typeof(preval.password) == 'undefined' || preval.password.length < 6) {
//                 document.getElementById('swal-input_password').style.outline = 'dashed red 2pt';
//                 metReq = false;
//             } else document.getElementById('swal-input_password').style.outline = 'unset';

//             if (!metReq) return false;

//             switch (type) {
//                 case "cook":
//                     preval.court_id = document.getElementById('swal-input_courtid').value
//                     break
//                 case "vendor":
//                     preval.court_name = document.getElementById('swal-input_courtname').value
//                     preval.gender = $("input:radio[name=gender]:checked").val()
//                     preval.full_name = document.getElementById('swal-input_fullname').value
//                     preval.phone_number = document.getElementById('swal-input_phone').value
//                     preval.birthday = document.getElementById('swal-input_birthday').value
//                     preval.email = document.getElementById('swal-input_email').value
//                     break
//                 case "cashier":

//                 case "screen":

//                 default:
//             }
//             return preval;
//         }
//     });
//     $.post(apiPath, { type: type, data: JSON.stringify(data.value) },
//         (msg) => {
//             if (msg == true) compatibleSwal.fire("Tạo thành công")
//             else compatibleSwal.fire("Tạo thất bại: " + msg)
//         }, 'json'
//     )

// }
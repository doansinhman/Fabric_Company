$(document).ready(function() {
    let navLock = $('#nav-lock');
    let navReal = $('#nav-real');
    let imgLock = $('#img-lock');
    let imgReal = $('#img-real');
    navReal.hide();
    imgReal.click(function() {
        navReal.hide();
        navLock.show();
    });
    imgLock.click(function() {
        navLock.hide();
        navReal.show();
    });
});
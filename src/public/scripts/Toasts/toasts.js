function toastSuccess (msg) {
    $('.successToast').append(msg);
    $('.successToast').fadeIn().delay(2000).fadeOut(function() {
        $('.successToast').empty();
    });
}

function toastFailure (msg) {
    $('.failToast').append(msg);
    $('.failToast').fadeIn().delay(2000).fadeOut(function() {
        $('.failToast').empty();
    });
}

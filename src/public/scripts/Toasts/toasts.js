function toastSuccess (msg) {
    $('.successToast').append(msg);
    $('.successToast').fadeIn().delay(2000).fadeOut(function() {
        $('.successToast').empty();
    });
}

function toastFail (msg) {
    $('.failToast').append(msg);
    $('.failToast').fadeIn().delay(2000).fadeOut(function() {
        $('.failToast').empty();
    });
}

function toastInfo (msg) {
    $('.infoToast').append(msg);
    $('.infoToast').fadeIn().delay(2000).fadeOut(function() {
        $('.infoToast').empty();
    });
}

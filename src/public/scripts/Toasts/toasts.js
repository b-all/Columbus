function toastSuccess (msg) {
    $('.successToast').empty();
    $('.successToast').append(msg);
    if ($('.successToast').css('display') === 'none') {
        $('.successToast').fadeIn().delay(2000).fadeOut(function() {
            $('.successToast').empty();
        });
    } else {
        $('.successToast').stop(true,true).css({'display':'none'}).append(msg)
        .fadeIn().delay(2000).fadeOut(function() {
            $('.successToast').empty();
        });
    }

}

function toastFail (msg) {
    $('.failToast').empty();
    $('.failToast').append(msg);
    if ($('.failToast').css('display') === 'none') {
        $('.failToast').fadeIn().delay(2000).fadeOut(function() {
            $('.failToast').empty();
        });
    } else {
        $('.failToast').stop(true,true).css({'display':'none'}).append(msg)
        .fadeIn().delay(2000).fadeOut(function() {
            $('.failToast').empty();
        });
    }
}

function toastInfo (msg) {
    $('.infoToast').empty();
    if ($('.infoToast').css('display') === 'none') {
        $('.infoToast').append(msg);
        $('.infoToast').fadeIn().delay(2000).fadeOut(function() {
            $('.infoToast').empty();
        });
    } else {
        $('.infoToast').stop(true,true).css({'display':'none'}).append(msg)
        .fadeIn().delay(2000).fadeOut(function() {
            $('.infoToast').empty();
        });
    }
}

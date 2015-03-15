$(function () {
    $('#alertBox').draggable({'containment':'parent'});
});

function Alert () {
    this.choice = false;
};

Alert.prototype.confirm = function (msg, callback) {
    $('#alertMessage').html(msg);
    $('#noBtn').off('click');
    $('#yesBtn').off('click');
    $('#noBtn').on('click', function () {
        this.choice = false;
        $('#alertBox').hide();
        callback(this.choice);
    });
    $('#yesBtn').on('click', function () {
        this.choice = true;
        $('#alertBox').hide();
        callback(this.choice);
    });
    $('#alertBox').show();
}

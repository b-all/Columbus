var showingPrefs = false;
function showSideMenuPrefs () {
    $('#searchTable').remove();
    killSearch();
    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    $('.deleteBtn').hide();

    //slide open edit view
    if (!showingSideMenu) {
       $('#sideMenu').css({'right': '-365px'});
       $('#sideMenu').animate({'right': '0px'}, 100);
    }
    showingSideMenu = true;
    showingPrefs = true;

    //show preferences menu header
    var header = $('.sideMenuHeader');
    header.text("Preferences");
    var fixedProps = $('#fixedProperties');
    var editableProps = $('#editableProperties');
    fixedProps.empty();
    editableProps.empty();


    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    $('.saveBtn').show();
}

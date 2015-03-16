function showFilterSideMenu() {
    // clear any previous menu items
    $('#fixedProperties').empty();
    $('#editableProperties').empty();

    //hide save button
    $('.saveBtn').hide();
    $('.deleteBtn').hide();
    $('.submitBtn').hide();

    if (!showingSideMenu) {
        $('#sideMenu').css({'right': '-365px', 'left':''});
        $('#sideMenu').animate({'right': '0px'}, 100);
    }
    $('.sideMenuHeader').text('Filter');
    $('#searchTable').remove();
    $('#filterTable').remove();
    $('#sideMenu').append(
        '<table id="filterTable">' +
            '<tr>' +
                '<td>' +
                    '<input id=\"filterInput\" class=\"form-control filter\"></input>' +
                '</td>' +
                '<td style="padding-left:6px">' +
                    '<button class="btn btn-default filterBtn">Filter</button>' +
                '</td>' +
            '</tr>' +
            '<tr>' +
                '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                    '<div class=\"searchDesc\">This filter will highlight nodes currently present on the screen that match your filter term.</div>' +
                '</td>' +
            '</tr>' +
        '</table>'
    );

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    $('#filterInput').unbind();
    $('.filterBtn').off('click');

    $('.filterBtn').on('click', function () {
        filterRequest();
    });

    $("#filterInput").keyup(function (e) {
        if (e.keyCode === 13) {
            filterRequest();
        }
    });

    showingSideMenu = true;
}

function filterRequest() {
    var target = $('#filterInput').val();
    var matches = graph.filter(target);
    var matchText = (matches === 1) ? 'match' : 'matches';
    $('#filterMatchesRow').remove();
    $('#filterTable').append(
        '<tr id="filterMatchesRow">' +
            '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                '<br/>' +
                '<div class=\"resultsDesc\">Found <span style="color:green">' +
                matches + ' </span>'+ matchText + '...</div>' +
            '</td>' +
        '</tr>'
    );
}

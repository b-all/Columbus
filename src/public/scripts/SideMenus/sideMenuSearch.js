function showSearchSideMenu() {
    // clear any previous menu items
    $('#fixedProperties').empty();
    $('#editableProperties').empty();

    //hide save button
    $('.saveBtn').hide();
    $('.deleteBtn').hide();

    if (!showingSideMenu) {
        $('#sideMenu').css({'right': '-365px', 'left':''});
        $('#sideMenu').animate({'right': '0px'}, 100);
    }
    $('.sideMenuHeader').text('Search');
    $('#searchTable').remove();
    $('#sideMenu').append(
        '<table id="searchTable">' +
            '<tr>' +
                '<td>' +
                    '<input id=\"searchInput\" class=\"form-control search\"></input>' +
                '</td>' +
                '<td style="padding-left:6px">' +
                    '<button class="btn btn-default searchBtn">Search</button>' +
                '</td>' +
            '</tr>' +
            '<tr>' +
                '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                    '<div class=\"searchDesc\">This search will query the database for property values matching your search term.</div>' +
                '</td>' +
            '</tr>' +
        '</table>'
    );

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    $('#searchInput').unbind();
    $('.searchBtn').off('click');

    $('.searchBtn').on('click', function () {
        var target = $('#searchInput').val();
        search(target, function () {

        });
    });

    $("#searchInput").keyup(function (e) {
        if (e.keyCode === 13) {
            var target = $('#searchInput').val();
            search(target, function () {

            });
        }
    });

    showingSideMenu = true;
}
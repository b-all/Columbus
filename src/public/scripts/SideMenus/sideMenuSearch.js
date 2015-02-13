function showSearchSideMenu() {
    // clear any previous menu items
    $('#fixedProperties').empty();
    $('#editableProperties').empty();

    //hide save button
    $('.saveBtn').hide();

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
        '</table>'
    );

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    showingSideMenu = true;
}

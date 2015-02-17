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


    $('#sideMenu').append('<span id="loader" style="position:absolute"><img src="images/loader.gif"></img></span>');


    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    $('#searchInput').unbind();
    $('.searchBtn').off('click');

    $('.searchBtn').on('click', function () {
        sendSearchRequest();
    });

    $("#searchInput").keyup(function (e) {
        if (e.keyCode === 13) {
            sendSearchRequest();
        }
    });

    showingSideMenu = true;
}

function sendSearchRequest() {
    var target = $('#searchInput').val();
    $('#loader').show();
    search(target, function (matches) {
        var matchText = (matches === 1) ? 'match' : 'matches';

        $('#loader').hide();
        $('#searchTable').append(
            '<tr>' +
                '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                    '<br/>' +
                    '<div class=\"resultsDesc\">Found <span style="color:green">' +
                    matches + ' </span>'+ matchText + '...</div>' +
                '</td>' +
            '</tr>'
        );
    });
}

function killSearch() {
    $('#loader').hide();
    currentRequest.abort();
}

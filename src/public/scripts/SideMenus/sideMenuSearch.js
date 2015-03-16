var showingSearch = false;
var showingSearchSideMenu = false;
function toggleSearch() {
    showingSearch = !showingSearch;
    if (showingSearch) {
        $('#searchBtn').removeClass('btn-success');
        $('#searchBtn').addClass('btn-primary');
        showSearchSideMenu();
    } else {
        $('#searchBtn').removeClass('btn-primary');
        $('#searchBtn').addClass('btn-success');
        if (showingSearchSideMenu) {
            showingSearchSideMenu = false;
            hideDefaultMenu();
        }
        $('#searchTable').remove();
        $('#loader').hide();
    }
}

function showSearchSideMenu() {
    if (!showingSideMenu) {
        showingSearchSideMenu = true;

        $('#sideMenu').css({'right': '-365px', 'left':''});
        $('#sideMenu').animate({'right': '0px'}, 100);
        $('.sideMenuHeader').text('Search');
        // clear any previous menu items
        $('#searchTable').remove();
        $('#filterTable').remove();
        $('#fixedProperties').empty();
        $('#editableProperties').empty();
        //hide buttons
        $('.saveBtn').hide();
        $('.submitBtn').hide();
        $('.deleteBtn').hide();

        $('#searchSpace').prepend(
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
    } else {
        $('#searchTable').remove();
        $('#searchSpace').prepend(
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
                        '<br/>' +
                    '</td>' +
                '</tr>' +
            '</table>'
        );
    }

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
        $('#searchMatchesRow').remove();
        $('#searchTable').append(
            '<tr id="searchMatchesRow">' +
                '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                    '<br/>' +
                    '<div class=\"resultsDesc\">Search returned <span style="color:green">' +
                    matches + ' </span>'+ matchText + '...</div>' +
                '</td>' +
            '</tr>'
        );
    });
}

function killSearch() {
    $('#loader').hide();
    if (typeof currentRequest !== 'undefined') {
        currentRequest.abort();
    }
}

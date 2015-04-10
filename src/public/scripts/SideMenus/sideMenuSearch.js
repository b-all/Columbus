var showingSearch = false;
var showingSearchSideMenu = false;
function toggleSearch() {
    showingSearch = !showingSearch;
    if (showingSearch) {
        $('#searchBtn').removeClass('btn-success');
        $('#searchBtn').addClass('btn-primary');
        flipMenuArrow();
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
        $('.propertyEditBtn').hide();

        createSearchSpace();
    } else {
        $('#searchTable').remove();
        createSearchSpace();
    }

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    showingSideMenu = true;
}

function sendSearchRequest() {
    var target = $('#searchInput').val();
    $('#loader').show();

    if ($('#searchByPropRadio').prop('checked')) {
        var prop = $('#searchPropKeySelect').val();
        searchWhere(prop, target, function (matches){
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
    } else {
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
}

function killSearch() {
    $('#loader').hide();
    if (typeof currentRequest !== 'undefined') {
        currentRequest.abort();
    }
}

function createSearchSpace () {
    getPropertyKeys(function (propKeys) {
        propKeys = propKeys.sort();
        $('#searchSpace').prepend(
            '<table id="searchTable">' +
                '<tr>' +
                    '<td class="searchCheckLabelTd" colspan="2">Retain Currently Visualized Data:' +
                    '<input id="additiveSearchCheckbox" type="checkbox" checked></input></td>' +
                '</tr>'+
                '<tr>' +
                    '<td colspan="2">' +
                        '<div class="radio"><label><input type="radio" id="searchByPropRadio" name="searchRadio" onchange="toggleSearchType()" checked> &nbsp; Search by Property Key</label></div>' +
                        '<div class="radio"><label><input type="radio" id="searchAllPropsRadio" name="searchRadio" onchange="toggleSearchType()"> &nbsp; Search All Properties</label></div>' +
                    '</td>' +
                '</tr>'+
                '<tr id="searchPropKeyRow">' +
                    '<td colspan="2">' +
                        '<span> Property &nbsp;</span>' +
                            '<span><select style="width:150px;display:inline-block;" class="form-control" id="searchPropKeySelect"></select></span>' +
                        '<span> &nbsp; contains </span>' +
                    '</td>' +
                '</tr>'+
                '<tr>' +
                    '<td>' +
                        '<input id=\"searchInput\" class=\"form-control search\"></input>' +
                    '</td>' +
                    '<td style="padding-left:6px">' +
                        '<button class="btn btn-default searchBtn" id="searchBtnSubmit">Search</button>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td colspan=\"2\" style="padding:6px;padding-right:20px">' +
                        '<div class=\"searchDesc\">This search will query the database for property values matching your search term.</div>' +
                    '</td>' +
                '</tr>' +
            '</table>'
        );
        propKeys.forEach(function (val, i, array) {
            $('#searchPropKeySelect').append(
                '<option>' + val + '</option>'
            );
        });

        $('#searchBtnSubmit').off('click');

        $('#searchBtnSubmit').on('click', function () {
            sendSearchRequest();
        });

        $('#searchInput').unbind();

        $("#searchInput").keyup(function (e) {
            if (e.keyCode === 13) {
                sendSearchRequest();
            }
        });

    });
}

function toggleSearchType () {
    if ($('#searchByPropRadio').prop('checked')) {
        $('#searchPropKeyRow').show();
    } else {
        $('#searchPropKeyRow').hide();
    }
}

var showingFilter = false;
var showingFilterSideMenu = false;
function toggleFilter() {
    showingFilter = !showingFilter;
    if (showingFilter) {
        $('#filterBtn').removeClass('btn-success');
        $('#filterBtn').addClass('btn-primary');
        showFilterSideMenu();
    } else {
        $('#filterBtn').removeClass('btn-primary');
        $('#filterBtn').addClass('btn-success');
        if (showingFilterSideMenu) {
            showingFilterSideMenu = false;
            hideDefaultMenu();
        }
        $('#filterTable').remove();
        $('#loader').hide();
    }
}

function showFilterSideMenu() {
    if (!showingSideMenu) {
        showingFilterSideMenu = true;

        $('#sideMenu').css({'right': '-365px', 'left':''});
        $('#sideMenu').animate({'right': '0px'}, 100);
        $('.sideMenuHeader').text('Filter');
        // clear any previous menu items
        $('#searchTable').remove();
        $('#filterTable').remove();
        $('#fixedProperties').empty();
        $('#editableProperties').empty();

        //hide save button
        $('.saveBtn').hide();
        $('.deleteBtn').hide();
        $('.propertyEditBtn').hide();
        $('.submitBtn').hide();

        $('#filterSpace').append(
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
    } else {
        $('#filterTable').remove();
        $('#filterSpace').append(
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
                        '<br/>' +
                    '</td>' +
                '</tr>' +
            '</table>'
        );
    }


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
                '<div class=\"resultsDesc\">Filtered on <span style="color:green">' +
                matches + ' </span>'+ matchText + '...</div>' +
            '</td>' +
        '</tr>'
    );
}

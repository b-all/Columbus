function showShortestPathSideMenu () {
    killSearch();
    $('.deleteBtn').hide();
    $('.saveBtn').hide();

    // get page dimensions
    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    //slide open edit view
    if (!showingSideMenu) {
        $('#sideMenu').css({'right': '-365px'});
        $('#sideMenu').animate({'right': '0px'}, 100);
    }

    showingSideMenu = true;

    //show Create Node menu header
    var header = $('.sideMenuHeader');
    header.text("Shortest Path");
    var fixedProps = $('#fixedProperties');
    fixedProps.empty();

    var newProps = [];

    var editableProps = $('#editableProperties');
    editableProps.empty();
    var labelInput = "<table class=\"createLabelInput\">" +
                            "<tr>" +
                                "<td><button class=\"btn btn-default selectStartNodeBtn\" type=\"button\" data-toggle=\"tooltip\"" +
                                "title=\"Click to Select Start Node\" data-delay=\"2000\">From Node</button></td>" +
                                "<td>" +
                                    ":" +
                                "</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control startNodeInput\"></input>"+
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td><button class=\"btn btn-default selectEndNodeBtn\" type=\"button\" data-toggle=\"tooltip\"" +
                                "title=\"Click to Select End Node\" data-delay=\"2000\">To Node</button></td>" +
                                "<td>" +
                                    ":" +
                                "</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control endNodeInput\"></input>"+
                                "</td>" +
                            "</tr>" +
                        "</table><br/>";
    editableProps.append(labelInput);
    $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
    setSelectEndNodeBtnOnClick();
    setSelectStartNodeBtnOnClick();

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    $('.submitBtn').show();
    setShortestPathSubmitBtnOnClick();
}

function setShortestPathSubmitBtnOnClick () {
    $('.submitBtn').off('click');
    $('.submitBtn').on('click', function () {
        var startNode = $('.startNodeInput').val();
        var endNode = $('.endNodeInput').val();
        getShortestPath(startNode, endNode, function () {
        });
    });
}


function setSelectEndNodeBtnOnClick () {
    $('.selectEndNodeBtn').off('click');
    $('.selectEndNodeBtn').on('click', function () {
        $('body').css({'cursor' : 'nw-resize'});
        selectingEndNode = true;
        if (!hoverInfoOn) {
            toggleInfoOnHover();
        }
    });
}

function setSelectStartNodeBtnOnClick () {
    $('.selectStartNodeBtn').off('click');
    $('.selectStartNodeBtn').on('click', function () {
        $('body').css({'cursor' : 'nw-resize'});
        selectingStartNode = true;
        if (!hoverInfoOn) {
            toggleInfoOnHover();
        }
    });
}

function loadSelectedEndNode (id) {
    if (hoverInfoOn) {
        toggleInfoOnHover();
    }
    selectingEndNode = false;
    $('.endNodeInput').val(id);
    $('body').css({'cursor' : 'default'});
}

function loadSelectedStartNode (id) {
    if (hoverInfoOn) {
        toggleInfoOnHover();
    }
    selectingStartNode = false;
    $('.startNodeInput').val(id);
    $('body').css({'cursor' : 'default'});
}

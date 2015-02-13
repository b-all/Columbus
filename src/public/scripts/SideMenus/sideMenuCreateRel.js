var selectingEndNode = false;
var selectingStartNode = false;

function showCreateRelSideMenu (d) {
    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    $('.deleteBtn').hide();

    //slide open edit view
    if (!showingSideMenu) {
       if (d.x * zoomRatio + translateDelta[0] < width - 400) {
           if (!showingSideMenu) {
               $('#sideMenu').css({'right': '-365px'});
               $('#sideMenu').animate({'right': '0px'}, 100);
           }
       } else {
           if (!showingSideMenu) {
               $('#sideMenu').css({'right': '-365px'});
               $('#graphContainer').animate({'left': '-365px'}, 500);
               $('#sideMenu').animate({'right': '0px'}, 100);
           }
       }
    }
    showingSideMenu = true;
    showingCreateRel = true;

    //show Create Node menu header
    var header = $('.sideMenuHeader');
    header.text("Create Relationship");
    var fixedProps = $('#fixedProperties');
    fixedProps.empty();

    var newProps = [];

    var editableProps = $('#editableProperties');
    editableProps.empty();
    var labelInput = "<table class=\"createLabelInput\">" +
                            "<tr>" +
                                "<td>Type</td>" +
                                "<td>" +
                                    ":" +
                                "</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control labelInput\"></input>"+
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td>From Node</td>" +
                                "<td>" +
                                    ":" +
                                "</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control startNodeInput\" value=\"" + d.id + "\" disabled></input>"+
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

    var ePropsString = "<table class=\"propertyTable\">";
        ePropsString += "<tr>" +
                            "<td>" +
                                "Property" +
                            "</td>" +
                            "<td>" +
                            "</td>" +
                            "<td>" +
                                "Value" +
                            "</td>" +
                        "</tr>";
    ePropsString += "</table>";
    editableProps.append(ePropsString);

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    addProperty();
    $('.saveBtn').show();
    setCreateRelSaveBtnOnClick(d);
}

function showCreateRelSideMenuFromBtn () {
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
    showingCreateRel = true;

    //show Create Node menu header
    var header = $('.sideMenuHeader');
    header.text("Create Relationship");
    var fixedProps = $('#fixedProperties');
    fixedProps.empty();

    var newProps = [];

    var editableProps = $('#editableProperties');
    editableProps.empty();
    var labelInput = "<table class=\"createLabelInput\">" +
                            "<tr>" +
                                "<td>Type</td>" +
                                "<td>" +
                                    ":" +
                                "</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control labelInput\"></input>"+
                                "</td>" +
                            "</tr>" +
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

    var ePropsString = "<table class=\"propertyTable\">";
        ePropsString += "<tr>" +
                            "<td>" +
                                "Property" +
                            "</td>" +
                            "<td>" +
                            "</td>" +
                            "<td>" +
                                "Value" +
                            "</td>" +
                        "</tr>";
    ePropsString += "</table>";
    editableProps.append(ePropsString);

    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    addProperty();
    $('.saveBtn').show();
    setCreateRelSaveBtnOnClick();
}

function cancelCreateRel () {

}

function setCreateRelSaveBtnOnClick (d) {
    $('.saveBtn').off('click');
    $('.saveBtn').on('click', function () {
        var props = gatherPropsForReq();
        var type = $('.labelInput').val();
        var startNode;
        if (typeof d === 'undefined') {
            startNode = $('.startNodeInput').val();
        } else {
            startNode = d.id;
        }
        var endNode = $('.endNodeInput').val();
        createRel(props, type, startNode, endNode, function (id) {
            //add node to graph here
            showingSideMenu = false;
            showingCreateRel = false;
            $('#sideMenu').animate({'right': '-365px'}, 100);
            getSingleRel(id, function (newRel) {
                newRel[0].source = graph.getNodeIndexById(newRel[0].source);
                newRel[0].target = graph.getNodeIndexById(newRel[0].target);
                graph.addRel(newRel[0]);
                graph.updateGraph();
                editingProperties = false;
            });
        });
    });
}


function setSelectEndNodeBtnOnClick () {
    $('.selectEndNodeBtn').off('click');
    $('.selectEndNodeBtn').on('click', function () {
        $('body').css({'cursor' : 'nw-resize'});
        selectingEndNode = true;
    });
}

function setSelectStartNodeBtnOnClick () {
    $('.selectStartNodeBtn').off('click');
    $('.selectStartNodeBtn').on('click', function () {
        $('body').css({'cursor' : 'nw-resize'});
        selectingStartNode = true;
    });
}

function loadSelectedEndNode (id) {
    selectingEndNode = false;
    $('.endNodeInput').val(id);
    $('body').css({'cursor' : 'default'});
}

function loadSelectedStartNode (id) {
    selectingStartNode = false;
    $('.startNodeInput').val(id);
    $('body').css({'cursor' : 'default'});
}

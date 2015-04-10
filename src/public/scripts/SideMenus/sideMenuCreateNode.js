function showCreateNodeSideMenu(xycoords) {
    $('.submitBtn').hide();
    $('.deleteBtn').hide();
    $('.propertyEditBtn').hide();
    killSearch();

    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight,
        x = xycoords[0],
        y = xycoords[1];

    //slide open edit view
    if (!showingSideMenu) {
       if (x * zoomRatio + translateDelta[0] < width - 400) {
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
    showingCreateNode = true;

    //show Create Node menu header
    var header = $('.sideMenuHeader');
    header.text("Create Node");
    var fixedProps = $('#fixedProperties');
    fixedProps.empty();

    var newProps = [];

    var editableProps = $('#editableProperties');
    editableProps.empty();
    var labelInput = "<table class=\"createLabelInput\">" +
                            "<tr>" +
                                "<td>Label&nbsp;&nbsp;</td>" +
                                "<td>:</td>" +
                                "<td>" +
                                    "<input type=\"text\" class=\"form-control labelInput\"></input>"+
                                "</td>" +
                        "</table><br/>";
    editableProps.append(labelInput);

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
    setCreateNodeSaveBtnOnClick(x, y);

}

function addProperty (index) {
    //remove add button
    var editablePropertiesTable = $('#editableProperties > .propertyTable');
    var newRow = "<tr>" +
                    "<td>" +
                        "<input type=\"text\" class=\"form-control pNameInput\"></input>" +
                    "</td>" +
                    "<td>" +
                        ":" +
                    "</td>" +
                    "<td>" +
                        "<input type=\"text\" class=\"form-control pValueInput\"></input>" +
                    "</td>" +
                    "<td>" +
                        "<span class=\"addPropBtn\" title=\"Add another property field\">"+
                            "<i class=\"glyphicon glyphicon-plus\"></i>" +
                        "</span>"+
                    "</td>" +
                    "<td>" +
                        "<span class=\"deletePropBtn\" title=\"Delete this property field\">" +
                        "<svg width=\"16px\" height=\"16px\">" +
                            "<use xlink:href=\"#deleteSVG\">" +
                        "</svg></span>" +
                    "</td>" +
                "</tr>";

    var justAddedRow;
    if (typeof index === 'undefined') {
        editablePropertiesTable.append(newRow);
        justAddedRow = $('tr', editablePropertiesTable).last();
    } else {
        $('tr:nth-child('+ (index + 1) +')', editablePropertiesTable).after(newRow);
        justAddedRow = $('tr:nth-child('+ (index + 2) +')', editablePropertiesTable);
    }
    $('.deletePropBtn').hide();

    $('.deletePropBtn', justAddedRow).on('click', function() {
        if ($('tr', editablePropertiesTable).length > 2) {
            justAddedRow.remove();
        }
        if ($('tr', editablePropertiesTable).length <= 2) {
            $('.deletePropBtn').hide();
        }
    });
    $('.addPropBtn', justAddedRow).on('click', function() {
        var index = $('tr', editablePropertiesTable).index(justAddedRow);
        addProperty(index);
        if($('tr', editablePropertiesTable).length > 2) {
            $('.deletePropBtn').show();
        }
    });

}

function gatherPropsForReq() {
    var propTable = $('#editableProperties > .propertyTable');
    var rows = $('tr', propTable);
    var properties = {};
    rows.each(function() {
        // remove trailing ':' from property name
        var s = $('.pNameInput', this).val();
        // add inputs to update object
        if (typeof s !== 'undefined') {
            properties[s] = $('.pValueInput', this).val();
        }
    });
    return properties;
}


function setCreateNodeSaveBtnOnClick (x, y) {
    $('.saveBtn').off('click');
    $('.saveBtn').on('click', function () {
        var props = gatherPropsForReq();
        var label = $('.labelInput').val();
        createNode(props, label, function (id) {
            //add node to graph here
            showingSideMenu = false;
            showingCreateNode = false;
            $('#sideMenu').animate({'right': '-365px'}, 100);
            getSingleNode(id, function (newNode) {
                if (!labels.hasOwnProperty(newNode[0].labels[0])) {
                    var colorIndex = Math.floor(Math.random() * c.length);
                    var randColor = c[colorIndex];
                    labels[newNode[0].labels] = { count: 1, x_center : 0, y_center: 0 };
                    labels[newNode[0].labels[0]].color = randColor;
                    c.splice(colorIndex, 1);
                } else {
                    labels[newNode[0].labels[0]].count++;
                }
                newNode[0].x = x;
                newNode[0].y = y;
                newNode[0].color = labels[newNode[0].labels[0]].color;
                createLabelKey();
                graph.addNode(newNode[0]);
                graph.updateGraph();
                editingProperties = false;
            });
        });
    });
}

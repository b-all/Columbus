
function showCreateNodeSideMenu(xycoords) {
    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight,
        x = xycoords[0],
        y = xycoords[1];

    //slide open edit view
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
    var ePropsString = "<table class=\"propertyTable\">";
        ePropsString += "<tr>" +
                            "<td>" +
                                "Property" +
                            "</td>" +
                            "<td>" +
                                "Value" +
                            "</td>" +
                        "</tr>";
    ePropsString += "</table>";
    editableProps.append(ePropsString);

    addProperty();

}

function NewProp (name, value) {
    this.name = name;
    this.value = value;
}

function addProperty () {
    //remove add button
    $('.addPropBtn').remove();
    var editablePropertiesTable = $('#editableProperties > .propertyTable');
    var newRow = "<tr>" +
                    "<td>" +
                        "<input type=\"text\" class=\"form-control pNameInput\"></input>" +
                    "</td>" +
                    "<td>" +
                        "<input type=\"text\" class=\"form-control pValueInput\"></input>" +
                    "</td>" +
                    "<td>" +
                        "<svg width=\"16px\" height=\"16px\" class=\"deletePropBtn\">" +
                            "<use xlink:href=\"#deleteSVG\">" +
                        "</svg>" +
                    "</td>" +
                "</tr>";

    editablePropertiesTable.append(newRow);
    var justAddedRow = $('tr', editablePropertiesTable).last();

    $('.deletePropBtn', justAddedRow).on('click', function() {
        justAddedRow.remove();
    });

    //attach add button below table
    $('#editableProperties').append("<button class=\"btn btn-default addPropBtn\">Add</button>");
    $('.addPropBtn').show();
    $('.addPropBtn').on('click', function () {
        addProperty();
    });

}

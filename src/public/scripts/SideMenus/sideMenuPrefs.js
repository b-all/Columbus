var showingPrefs = false;
var labelNames = [];
var numPriorities = 0;
function showSideMenuPrefs () {
    numPriorities = 0;
    $('#searchTable').remove();
    killSearch();
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
    showingPrefs = true;

    //show preferences menu header
    var header = $('.sideMenuHeader');
    header.text("Preferences");
    var fixedProps = $('#fixedProperties');
    var editableProps = $('#editableProperties');

    // empty property tables of all content
    fixedProps.empty();
    editableProps.empty();

    // make sure the browser supports local storage
    if(typeof(Storage) === "undefined") {
        editableProps.append('<h4>Your browser doesn\'t support local storage.</h4>');
        editableProps.append('<br /><h4>Preferences can\'t be saved...</h4>');
        return;
    }
    //localStorage.removeItem("columbusPreferences");
    // check if preferences have been stored
    if(typeof localStorage.columbusPreferences !== 'undefined') {
        var prefs = JSON.parse(localStorage.getItem('columbusPreferences'));
        loadUserPreferences(prefs);
        return;
    }


    //build hover priorities section
    editableProps.append('<h4>Hover Priorities</h4>');
    editableProps.append("<button class=\"btn btn-default addPropBtn\">Add</button>");
    $('.addPropBtn').show();
    $('.addPropBtn').on('click', function () {
        addHoverPriority();
    });

    $('#sideMenu').on('click', function () {
        // tells delete key listener to ignore
        editingProperties = true;
    });

    setPreferencesSaveBtnOnClick();
}

/** makes an row for adding a hover priority by label **/
function addHoverPriority () {
    //load all labels from database
    if (labelNames.length === 0) {
        $('#loader').show();
        getAllLabels(function (data) {
            labelNames = data;
            $('#loader').hide();
            $('#editableProperties').append(
                '<table class="priorityPrefTable">' +
                    '<tr>'+
                        '<td>Label : </td>' +
                        '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                        '<td rowspan="2">' +
                            "<svg width=\"16px\" height=\"16px\" class=\"deletePropBtn\">" +
                                "<use xlink:href=\"#deleteSVG\">" +
                            "</svg>" +
                        "</td>" +
                    '</tr>' +
                    '<tr>' +
                        '<td>' +
                            'Property : ' +
                        '</td>' +
                        '<td>' +
                            '<input class="form-control" type="text" id="priorityRule' + numPriorities + '"/>' +
                            '<br />' +
                        '</td>' +
                    '</tr>' +
                '</table>'
            );
            for (var i = 0; i < data.length; i++) {
                $('#labelSelect' + numPriorities).append(
                    '<option>' + data[i] + '</option>'
                );
            }

            // set click listeners for delete buttons
            $('tr', '.priorityPrefTable').each(function (){
                var table = $(this).parent();
                $('.deletePropBtn', table).off('click');
                $('.deletePropBtn', table).on('click', function() {
                    $(table).remove();
                    numPriorities--;
                });
            });

            numPriorities++;
            $('.addPropBtn').remove();
            $('#editableProperties').append("<button class=\"btn btn-default addPropBtn\">Add</button>");
            $('.addPropBtn').show();
            $('.addPropBtn').on('click', function () {
                addHoverPriority();
            });
        });
    } else {
        // build drop down menu
        $('#editableProperties').append(
            '<table class="priorityPrefTable">' +
                '<tr>'+
                    '<td>Label : </td>' +
                    '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                    '<td rowspan="2">' +
                        "<svg width=\"16px\" height=\"16px\" class=\"deletePropBtn\">" +
                            "<use xlink:href=\"#deleteSVG\">" +
                        "</svg>" +
                    "</td>" +
                '</tr>' +
                '<tr>' +
                    '<td>' +
                        'Property : ' +
                    '</td>' +
                    '<td>' +
                        '<input class="form-control" type="text" id="priorityRule' + numPriorities + '"/>' +
                        '<br />' +
                    '</td>' +
                '</tr>' +
            '</table>'
        );
        for (var i = 0; i < labelNames.length; i++) {
            $('#labelSelect' + numPriorities).append(
                '<option>' + labelNames[i] + '</option>'
            );
        }

        // set click listeners for delete buttons
        $('tr', '.priorityPrefTable').each(function (){
            var table = $(this).parent();
            $('.deletePropBtn', table).off('click');
            $('.deletePropBtn', table).on('click', function() {
                $(table).remove();
                numPriorities--;
            });
        });


        numPriorities++;

        // reposition add button
        $('.addPropBtn').remove();
        $('#editableProperties').append("<button class=\"btn btn-default addPropBtn\">Add</button>");
        $('.addPropBtn').show();
        $('.addPropBtn').on('click', function () {
            addHoverPriority();
        });
    }
}

function setPreferencesSaveBtnOnClick () {
    $('.saveBtn').show();
    $('.saveBtn').off('click');
    $('.saveBtn').on('click', function () {
        parsePreferencesForm(function (prefs){
            localStorage.removeItem('columbusPreferences');
            localStorage.setItem('columbusPreferences', JSON.stringify(prefs));
            toastSuccess("Preferences Saved");
        });
    });
}

function parsePreferencesForm(callback) {
    console.log(numPriorities);
    var prefs = {
        hoverPriorities : []
    };
    // get hover priority preferences from inputs
    for (var i = 0; i < numPriorities; i++) {
        prefs.hoverPriorities.push({
            label: $('#labelSelect' + i).val(),
            property: $('#priorityRule' + i).val()
        });
    }
    callback(prefs);
}

function loadUserPreferences (prefs) {
    //build hover priorities section
    $('#editableProperties').append('<h4>Hover Priorities</h4>');

    $('#loader').show();
    getAllLabels(function(data) {
        $('#loader').hide();
        labelNames = data;
        if (prefs.hoverPriorities.length === 0 || typeof prefs.hoverPriorities === 'undefined') {
            $('#editableProperties').append("<button class=\"btn btn-default addPropBtn\">Add</button>");
            $('.addPropBtn').show();
            $('.addPropBtn').on('click', function () {
                addHoverPriority();
            });
        }
        for (var i = 0; i < prefs.hoverPriorities.length; i++) {
            loadUserPriorities(prefs.hoverPriorities[i]);
        }
    });




    $('#sideMenu').on('click', function () {
        editingProperties = true;
    });

    setPreferencesSaveBtnOnClick();
}

function loadUserPriorities (hoverPriority) {
    //load all labels from database
    // build drop down menu
    $('#editableProperties').append(
        '<table class="priorityPrefTable">' +
            '<tr>'+
                '<td>Label : </td>' +
                '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                '<td rowspan="2">' +
                    "<svg width=\"16px\" height=\"16px\" class=\"deletePropBtn\">" +
                        "<use xlink:href=\"#deleteSVG\">" +
                    "</svg>" +
                "</td>" +
            '</tr>' +
            '<tr>' +
                '<td>' +
                    'Property : ' +
                '</td>' +
                '<td>' +
                    '<input class="form-control" type="text" id="priorityRule' +
                    numPriorities + '" value="' + hoverPriority.property +'"/>' +
                    '<br />' +
                '</td>' +
            '</tr>' +
        '</table>'
    );
    for (var i = 0; i < labelNames.length; i++) {
        var element;
        if (hoverPriority.label === labelNames[i]) {
            element = '<option selected>' + labelNames[i] + '</option>';
        } else {
            element = '<option>' + labelNames[i] + '</option>';
        }
        $('#labelSelect' + numPriorities).append(element);
    }

    // set click listeners for delete buttons
    $('tr', '.priorityPrefTable').each(function (){
        var table = $(this).parent();
        $('.deletePropBtn', table).off('click');
        $('.deletePropBtn', table).on('click', function() {
            $(table).remove();
            numPriorities--;
        });
    });


    numPriorities++;

    // reposition add button
    $('.addPropBtn').remove();
    $('#editableProperties').append("<button class=\"btn btn-default addPropBtn\">Add</button>");
    $('.addPropBtn').show();
    $('.addPropBtn').on('click', function () {
        addHoverPriority();
    });
}

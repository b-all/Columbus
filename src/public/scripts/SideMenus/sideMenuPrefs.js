var showingPrefs = false;
var labelNames = [];
var graphVisTypes = ["Dynamic Force Graph", "Stationary Force Graph"];
var numPriorities = 0;
var currentGraphVis = "";
var requesting = false;
function showSideMenuPrefs () {
    if (requesting) {
        /* if a user double clicks on Preferences button,
         * this function will run before the last request completes and
         * result in a jumbled display
         */
        return;
    }
    numPriorities = 0;
    killSearch();
    var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    $('.deleteBtn').hide();
    $('.submitBtn').hide();
    $('.propertyEditBtn').hide();

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

    fixedProps.append(
        '<p id="neo4jSettingsLink">Neo4j Server Settings</p><br />'
    );
    setNeo4jSettingsOnClick();

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

    editableProps.append(('<h4>Graph Visualization</h4>'));
    editableProps.append(
        '<select id="selectGraphVis" class="form-control selectGraphVis">' +
         '</select>'
    );

    currentGraphVis = graphVisTypes[0];

    for (var i = 0; i < graphVisTypes.length; i++) {
        $('#selectGraphVis').append('<option>' + graphVisTypes[i] + '</option>');
    }

    //build Node Text section
    editableProps.append('<h4>Node Displayed Properties</h4>');
    $('#loader').show();
    requesting = true;
    getAllLabels(function(data) {
        requesting = false;
        $('#loader').hide();
        labelNames = data;
        editableProps.append('<table id="nodeTextPropTable" class="propertyTable"></table>')
        labelNames.forEach(function(val, i, array) {
            $('#nodeTextPropTable').append(
                '<tr>' +
                    '<td>' +
                        val +
                    '</td>' +
                    '<td>' +
                        ':' +
                    '</td>' +
                    '<td>' +
                        '<input type="text" id="nodeTextInput' + i +'" value="id" class="form-control">' +
                    '</td>' +
                '</tr>'
            );
        });

        //build hover priorities section
        editableProps.append('<h4>Hover Priorities</h4>');
        addHoverPriority();
    });

    $('#sideMenu').on('click', function () {
        // tells delete key listener to ignore
        editingProperties = true;
    });

    setPreferencesSaveBtnOnClick();
}

/** makes an row for adding a hover priority by label **/
function addHoverPriority (index) {
    //load all labels from database
    var index = index || 0;
    if (labelNames.length === 0) {
        $('#loader').show();
        requesting = true;
        getAllLabels(function (data) {
            requesting = false;
            labelNames = data;
            $('#loader').hide();
            var newTable =
                '<table class="priorityPrefTable">' +
                    '<tr>'+
                        '<td>Label : </td>' +
                        '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                        '<td rowspan="2">' +
                            '<span class=\"addPropBtn\" title="Add another hover priority">' +
                            '<i class=\"glyphicon glyphicon-plus\"></i>' +
                            '</span>' +
                        '</td>' +
                        '<td rowspan="2">' +
                            "<span class=\"deletePropBtn\" title=\"Delete this hover priority\">" +
                            "<svg width=\"16px\" height=\"16px\" >" +
                                "<use xlink:href=\"#deleteSVG\">" +
                            "</svg></span>" +
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
                '</table>';
            if ($('.priorityPrefTable').length > 1) {
                $('.priorityPrefTable:eq('+index+')').after(newTable);
            } else {
                $('#editableProperties').append(newTable);
            }
            for (var i = 0; i < data.length; i++) {
                $('#labelSelect' + numPriorities).append(
                    '<option>' + data[i] + '</option>'
                );
            }

            // set click listeners for delete and add buttons
            $('tr', '.priorityPrefTable').each(function (){
                var table = $(this).parent().parent();
                $('.deletePropBtn', table).off('click');
                $('.deletePropBtn', table).on('click', function() {
                    $(table).remove();
                    numPriorities--;
                    var i = 0;
                    $('.priorityPrefTable').each(function () {
                        $('select', this).attr('id', 'labelSelect' + i);
                        $('input', this).attr('id', 'priorityRule' + i);
                        i++;
                    });
                    $('.deletePropBtn').hide();
                    if($('.priorityPrefTable').length > 1) {
                        $('.deletePropBtn').show();
                    }
                });
                $('.addPropBtn', table).off('click');
                $('.addPropBtn', table).on('click', function() {
                    var index = $('.priorityPrefTable').index(table);
                    addHoverPriority(index);
                    var i = 0;
                    $('.priorityPrefTable').each(function () {
                        $('select', this).attr('id', 'labelSelect' + i);
                        $('input', this).attr('id', 'priorityRule' + i);
                        i++;
                    });
                });
            });

            $('.deletePropBtn').hide();
            if($('.priorityPrefTable').length > 1) {
                $('.deletePropBtn').show();
            }
            numPriorities++;
        });
    } else {
        // build drop down menu
        var newTable =
            '<table class="priorityPrefTable">' +
                '<tr>'+
                    '<td>Label : </td>' +
                    '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                    '<td rowspan="2">' +
                        '<span class=\"addPropBtn\" title="Add another hover priority">' +
                        '<i class=\"glyphicon glyphicon-plus\"></i>' +
                        '</span>' +
                    '</td>' +
                    '<td rowspan="2">' +
                    "<span class=\"deletePropBtn\" title=\"Delete this hover priority\">" +
                    "<svg width=\"16px\" height=\"16px\" >" +
                        "<use xlink:href=\"#deleteSVG\">" +
                    "</svg></span>" +
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
            '</table>';
        if ($('.priorityPrefTable').length > 1) {
            $('.priorityPrefTable:eq('+index+')').after(newTable);
        } else {
            $('#editableProperties').append(newTable);
        }

        for (var i = 0; i < labelNames.length; i++) {
            $('#labelSelect' + numPriorities).append(
                '<option>' + labelNames[i] + '</option>'
            );
        }

        // set click listeners for delete and add buttons
        $('tr', '.priorityPrefTable').each(function (){
            var table = $(this).parent().parent();
            $('.deletePropBtn', table).off('click');
            $('.deletePropBtn', table).on('click', function() {
                $(table).remove();
                numPriorities--;
                var i = 0;
                $('.priorityPrefTable').each(function () {
                    $('select', this).attr('id', 'labelSelect' + i);
                    $('input', this).attr('id', 'priorityRule' + i);
                    i++;
                });
                $('.deletePropBtn').hide();
                if($('.priorityPrefTable').length > 1) {
                    $('.deletePropBtn').show();
                }
            });
            $('.addPropBtn', table).off('click');
            $('.addPropBtn', table).on('click', function() {
                var index = $('.priorityPrefTable').index(table);
                addHoverPriority(index);
                var i = 0;
                $('.priorityPrefTable').each(function () {
                    $('select', this).attr('id', 'labelSelect' + i);
                    $('input', this).attr('id', 'priorityRule' + i);
                    i++;
                });
            });
        });

        $('.deletePropBtn').hide();
        if($('.priorityPrefTable').length > 1) {
            $('.deletePropBtn').show();
        }
        numPriorities++;
    }
}

function setPreferencesSaveBtnOnClick () {
    $('.saveBtn').show();
    $('.saveBtn').off('click');
    $('.saveBtn').on('click', function () {
        parsePreferencesForm(function (prefs){
            localStorage.removeItem('columbusPreferences');
            localStorage.setItem('columbusPreferences', JSON.stringify(prefs));
            //console.log(localStorage.getItem('columbusPreferences'));
            toastSuccess("Preferences Saved");
            refreshGraphWithDifferentVis();
            graph.updateGraph();
        });
    });
}

function parsePreferencesForm(callback) {
    var prefs = {
        graphVis : "",
        hoverPriorities : [],
        nodeTextProps: []
    };

    prefs.graphVis = $('#selectGraphVis').val();
    // get hover priority preferences from inputs
    for (var i = 0; i < numPriorities; i++) {
        prefs.hoverPriorities.push({
            label: $('#labelSelect' + i).val(),
            property: $('#priorityRule' + i).val()
        });
    }

    labelNames.forEach(function(val, i, array) {
        prefs.nodeTextProps.push({
            label: val,
            property: $('#nodeTextInput' + i).val()
        });
    });

    callback(prefs);
}

function loadUserPreferences (prefs) {
    $('#editableProperties').append(('<h4>Graph Visualization</h4>'));
    $('#editableProperties').append( '<br/>' +
        '<select id="selectGraphVis" class="form-control selectGraphVis">' +
         '</select><br/>'
    );

    for (var i = 0; i < graphVisTypes.length; i++) {
        if (prefs.graphVis === graphVisTypes[i]) {
            currentGraphVis = graphVisTypes[i];
            $('#selectGraphVis').append('<option selected>' + graphVisTypes[i] + '</option>');
        } else {
            $('#selectGraphVis').append('<option>' + graphVisTypes[i] + '</option>');
        }
    }

    var editableProps = $('#editableProperties');

    $('#loader').show();
    requesting = true;
    getAllLabels(function(data) {
        requesting = false;
        $('#loader').hide();
        labelNames = data;

        //build table for Node Text Properties
        editableProps.append('<h4>Node Displayed Properties</h4>');
        editableProps.append('<table id="nodeTextPropTable" class="propertyTable"></table>')
        labelNames.forEach(function(val, i, array) {
            $('#nodeTextPropTable').append(
                '<tr>' +
                    '<td class="nodeTextPropLabel">' +
                        val +
                    '</td>' +
                    '<td>' +
                        ':' +
                    '</td>' +
                    '<td>' +
                        '<input type="text" id="nodeTextInput' + i +'" class="form-control">' +
                    '</td>' +
                '</tr>'
            );
        });

        //load user Node Displayed Properties settings
        prefs.nodeTextProps.forEach(function(val, i, array) {
            var count = 0;
            $('#nodeTextPropTable tr > .nodeTextPropLabel').each(function () {
                if ($(this).html() === val.label) {
                    $('#nodeTextInput' + count).val(val.property);
                }
                count++;
            });
        });

        //build hover priorities section
        editableProps.append('<h4>Hover Priorities</h4>');
        if (prefs.hoverPriorities.length === 0 || typeof prefs.hoverPriorities === 'undefined') {
            editableProps.append("<button class=\"btn btn-default addPropBtn\">Add</button>");
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
    var newTable =
        '<table class="priorityPrefTable">' +
            '<tr>'+
                '<td>Label : </td>' +
                '<td><select id="labelSelect'+ numPriorities+ '" class="form-control selectLabel"></select></td>' +
                '<td rowspan="2">' +
                    '<span class=\"addPropBtn\" title="Add another hover priority">' +
                        '<i class=\"glyphicon glyphicon-plus\"></i>' +
                    '</span>' +
                '</td>' +
                '<td rowspan="2">' +
                "<span class=\"deletePropBtn\" title=\"Delete this hover priority\">" +
                "<svg width=\"16px\" height=\"16px\" >" +
                    "<use xlink:href=\"#deleteSVG\">" +
                "</svg></span>" +
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
        '</table>';
    $('#editableProperties').append(newTable);
    for (var i = 0; i < labelNames.length; i++) {
        var element;
        if (hoverPriority.label === labelNames[i]) {
            element = '<option selected>' + labelNames[i] + '</option>';
        } else {
            element = '<option>' + labelNames[i] + '</option>';
        }
        $('#labelSelect' + numPriorities).append(element);
    }

    // set click listeners for delete and add buttons
    $('tr', '.priorityPrefTable').each(function (){
        var table = $(this).parent().parent();
        $('.deletePropBtn', table).off('click');
        $('.deletePropBtn', table).on('click', function() {
            $(table).remove();
            var i = 0;
            $('.priorityPrefTable').each(function () {
                $('select', this).attr('id', 'labelSelect' + i);
                $('input', this).attr('id', 'priorityRule' + i);
                i++;
            });
            $('.deletePropBtn').hide();
            if($('.priorityPrefTable').length > 1) {
                $('.deletePropBtn').show();
            }
            numPriorities--;
        });
        $('.addPropBtn', table).off('click');
        $('.addPropBtn', table).on('click', function() {
            var index = $('.priorityPrefTable').index(table);
            addHoverPriority(index);
            var i = 0;
            $('.priorityPrefTable').each(function () {
                $('select', this).attr('id', 'labelSelect' + i);
                $('input', this).attr('id', 'priorityRule' + i);
                i++;
            });
        });
    });

    $('.deletePropBtn').hide();
    if($('.priorityPrefTable').length > 1) {
        $('.deletePropBtn').show();
    }


    numPriorities++;
}

function refreshGraphWithDifferentVis () {
    var viz = $('#selectGraphVis').val();

    displayData(currentData);
}

function setNeo4jSettingsOnClick() {
    $('#neo4jSettingsLink').off('click');
    $('#neo4jSettingsLink').on('click', function () {
        $('#neo4jSettingsModal').modal('show');
        if(typeof localStorage.columbusNeo4jSettings !== 'undefined') {
    		var prefs = JSON.parse(localStorage.getItem('columbusNeo4jSettings'));
            if (typeof prefs.auth !== 'undefined') {
                $('#hostInput').val(prefs.auth.host);
                $('#portInput').val(prefs.auth.port);
                var creds = atob(auth.pw);
                console.log(creds);
                creds = creds.split(':');
                var username = creds[0], pass = creds[1];
                $('#userNameInput').val(username);
                $('#passwordInput').val(pass);
            }
    	}
        $('#neo4jModalSaveBtn').off('click');
        $('#neo4jModalSaveBtn').on('click', function () {
            loadAuthInputs();
        });
    });
}

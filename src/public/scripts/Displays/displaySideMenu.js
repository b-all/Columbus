var showingSideMenu = false;
var editingProperties = false;

var showSideMenu = function (type, d) {
	$('#searchTable').remove();
	if (type === 'node') {
		showNodeData(d);
	} else if (type === 'relationship'){
		showRelData(d);
	} else if (type === 'default') {
		showDefaultMenu();
	}
	$('.navArrowContainer').css({'transform':'rotate(180deg)'});

};

var hideSideMenu = function (type) {
	if (type === 'node') {
		hideNodeData();
	} else if (type === 'relationship'){
		hideRelData();
	} else if (type === 'default') {
		hideDefaultMenu();
	}

	$('#searchTable').remove();

	$('.navArrowContainer').css({'transform':'rotate(0deg)'});
};

var showDefaultMenu = function () {
	// clear any previous menu items
	$('#fixedProperties').empty();
	$('#editableProperties').empty();

	//hide save button
	$('.saveBtn').hide();

	$('#sideMenu').css({'right': '-365px', 'left':''});
	$('#sideMenu').animate({'right': '0px'}, 100);
	$('.sideMenuHeader').text('Welcome to Columbus');

	showingSideMenu = true;
};

var hideDefaultMenu = function () {
	$('#sideMenu').animate({'right':'-365px'}, 100);
	//bring graphContainer back to initial position
	$('#graphContainer').animate({'left': '0px'}, 400, function () {
		$('#graphContainer').css({'left': ''});
		showingSideMenu = false;
		editingProperties = false;
	});
};

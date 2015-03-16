var showingSideMenu = false;
var editingProperties = false;

var showSideMenu = function (type, d) {
	killSearch();
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

	killSearch();

	$('.navArrowContainer').css({'transform':'rotate(0deg)'});
};

var showDefaultMenu = function () {
	// clear any previous menu items
	$('#fixedProperties').empty();
	$('#editableProperties').empty();

	//hide save button
	$('.saveBtn').hide();
	$('.submitBtn').hide();

	$('#sideMenu').css({'right': '-365px', 'left':''});
	$('#sideMenu').animate({'right': '0px'}, 100);
	$('.sideMenuHeader').text('Welcome to Columbus');

	showingSideMenu = true;
};

var hideDefaultMenu = function () {
	if ((selectingStartNode || selectingEndNode) && hoverInfoOn) {
		selectingStartNode = false;
		selectingEndNode = false;
		toggleInfoOnHover();
	}
	$('#sideMenu').animate({'right':'-365px'}, 100);
	//bring graphContainer back to initial position
	$('#graphContainer').animate({'left': '0px'}, 400, function () {
		$('#graphContainer').css({'left': ''});
		if (showingSearchSideMenu) {
			showingSearchSideMenu = false;
			toggleSearch();
		}
		if (showingFilterSideMenu) {
			showingFilterSideMenu = false;
			toggleFilter();
		}
		showingSideMenu = false;
		editingProperties = false;
	});
};

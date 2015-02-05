var showingNodeProps = false; 
var showingRelProps = false; 

var showNodeData = function (d) {
	var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    //slide open edit view
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
	showingSideMenu = true;
	showingNodeProps = true; 

	//show node's properties
	var header = $('.sideMenuHeader');
	header.text("Node Properties");
	var fixedProps = $('#fixedProperties');
	fixedProps.empty();
	fixedProps.append(	"<table class=\"propertyTable\">" +
							"<tr>" + 
								"<td>Label:</td>" + 
								"<td>" + d.labels[0] + "</td>" +
							"</tr>" + 
							"<tr>" + 
								"<td>id:</td>" + 
								"<td>" + d.id + "</td>" +
							"</tr>" + 
						"</table><br/>");


	var editableProps = $('#editableProperties');
	editableProps.empty();
	var ePropsString = "<table class=\"propertyTable\">";
	for (var i in d.data) {
		ePropsString += "<tr>" + 
							"<td class=\"propertyName\">" + i + ":</td>" +
							"<td><input type=\"text\" class=\"form-control\" value=\"" + d.data[i] + "\"></input></td>" +
						"</tr>";
	}
	ePropsString += "</table>";
	editableProps.append(ePropsString);

	$('#sideMenu').on('click', function () {
		editingProperties = true;
	});

	//show save button
	$('.saveBtn').show();

	// set save button onclick function
	$('.saveBtn').off('click');
	$('.saveBtn').on('click', function () {
		var updatedProps = {
			id: d.id,
			data: {}
		};
		var propRows = $('tr', '#editableProperties');
		console.log(propRows);
		propRows.each(function() {
			// remove trailing ':' from property name
			var s = $('.propertyName', this).html();
			s = s.substring(0, s.length - 1);
			// add inputs to update object
			updatedProps.data[s] = $('input', this).val();
		});

		updatedProps = {
			node: JSON.stringify(updatedProps)
		};
		updateNodeProperties(updatedProps, function () {
			console.log(d);
			d.data = JSON.parse(updatedProps.node).data;
		});
	});
};

var hideNodeData = function () {
	if (showingSideMenu) {
		$('#sideMenu').animate({'right' :'-365px'}, 100, function () {
			$('#graphContainer').css({'right' : ''});
			$('#graphContainer').animate({'left': '0px'}, 400, function () {
				$('#graphContainer').css({'left': ''});
	   		});
		});
	}
	showingSideMenu = false; 
	editingProperties = false; 

	//hide save button
	$('.saveBtn').hide();
	$('.saveBtn').off('click');

	$('#sideMenu').off('click');
};


var showRelData = function (d) {
	var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    var rel_center = (d.source.x + d.target.x) / 2;
    
    //slide open edit view
   	if (rel_center * zoomRatio + translateDelta[0] < width - 400) {
   		if (!showingSideMenu) {
   			$('#sideMenu').css({'right': '-365px'});
   			$('#sideMenu').animate({'right': '0px'}, 100);
   		} 
   	} else {
   		if (!showingSideMenu) {
   			$('#sideMenu').css({'right': '-365px', 'left':''});
   			$('#graphContainer').animate({'left': '-365px'}, 400);
   			$('#sideMenu').animate({'right': '0px'}, 100);
   		}
	}

	showingSideMenu = true; 
	showingRelProps = true; 

	//show relationship's properties
	var header = $('.sideMenuHeader');
	header.text('Relationship Properties');
	var fixedProps = $('#fixedProperties');
	fixedProps.empty();
	fixedProps.append(	"<table class=\"propertyTable\">" +
							"<tr>" + 
								"<td>type:</td>" + 
								"<td>" + d.type + "</td>" +
							"</tr>" + 
							"<tr>" + 
								"<td>id:</td>" + 
								"<td>" + d.id + "</td>" +
							"</tr>" + 
						"</table><br/>");


	var editableProps = $('#editableProperties');
	editableProps.empty();
	var ePropsString = "<table class=\"propertyTable\">";
	for (var i in d.data) {
		ePropsString += "<tr>" + 
							"<td>" + i + ":</td>" +
							"<td><input type=\"text\" class=\"form-control\" value=\"" + d.data[i] + "\"></input></td>" +
						"</tr>";
	}
	ePropsString += "</table>";
	editableProps.append(ePropsString);

	$('#sideMenu').on('click', function () {
		editingProperties = true;
	});

	//show save button
	$('.saveBtn').show();
};

var hideRelData = function () {
	//$('.navigationBar').animate({'top':'0'}, 200);
	if (showingSideMenu) {
		$('#sideMenu').animate({'right' :'-365px'}, 100, function () {
			$('#graphContainer').css({'right' : ''});
			$('#graphContainer').animate({'left': '0px'}, 400, function () {
				$('#graphContainer').css({'left': ''});
	   		});
		});
	}
	showingSideMenu = false; 
	editingProperties = false; 
	showingRelProps = false;
	$('#sideMenu').off('click');

	//hide save button
	$('.saveBtn').hide();
};
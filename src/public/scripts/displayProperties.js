var showingPropertiesLeft = false; 
var showingPropertiesRight = false; 
var editingProperties = false; 

var showNodeData = function (d) {
	var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

    //slide open edit view
    $('.navigationBar').animate({'top':'-100'}, 200);
   	if (d.x * zoomRatio + translateDelta[0] < width / 2) {
   		if (showingPropertiesRight) {
   			$('#nodePropertiesPane').css({'left': '-400px', 'right':''});
   			$('#graphContainer').animate({'left': '0px'}, 100, function () {
   				$('#graphContainer').css({'left': ''});
   				$('#graphContainer').animate({'right': '-400px'}, 100);
   				$('#nodePropertiesPane').animate({'left': '0px'}, 100);
   				showingPropertiesRight = false; 
   			});
   		} else if (!showingPropertiesLeft) {
   			$('#nodePropertiesPane').css({'left': '-400px', 'right':''});
   			$('#graphContainer').animate({'right': '-400px'}, 100);
   			$('#nodePropertiesPane').animate({'left': '0px'}, 100);
   		}
		showingPropertiesLeft = true;
   	} else {
   		if (showingPropertiesLeft) {
   			$('#nodePropertiesPane').css({'right': '-400px', 'left':''});
   			$('#graphContainer').animate({'right': '0px'}, 100, function () {
   				$('#graphContainer').css({'right': ''});
   				$('#graphContainer').animate({'left': '-400px'}, 100);
   				$('#nodePropertiesPane').animate({'right': '0px'}, 100);
   				showingPropertiesLeft = false; 
   			});
   		} else if (!showingPropertiesRight) {
   			$('#nodePropertiesPane').css({'right': '-400px', 'left':''});
   			$('#graphContainer').animate({'left': '-400px'}, 100);
   			$('#nodePropertiesPane').animate({'right': '0px'}, 100);
   		}
   		showingPropertiesRight = true; 
	}

	//show node's properties
	var fixedProps = $('#nodeFixedProperties');
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
						"</table>");
	fixedProps.append("<br />")
	var editableProps = $('#nodeEditableProperties');
	editableProps.empty();
	for (var i in d.data) {
		editableProps.append(	"<table class=\"propertyTable\">" + 
									"<tr>" + 
										"<td>" + i + ":</td>" +
										"<td><input type=\"text\" class=\"form-control\" value=\"" + d.data[i] + "\"></input></td>" +
									"</tr>" +
								"</table>");
	}

	$('#nodePropertiesPane').on('click', function () {
		editingProperties = true;
	});
};

var hideNodeData = function () {
	$('.navigationBar').animate({'top':'0'}, 200);
	if (showingPropertiesLeft) {
		$('#nodePropertiesPane').animate({'left' : '-400px'}, 100, function () {
			$('#graphContainer').css({'left' : ''});
			$('#graphContainer').animate({'right': '0px'}, 100, function () {
				$('#graphContainer').css({'left': '', 'right' : '0'});
				showingPropertiesLeft = false; 
	   		});
		});
	} else if (showingPropertiesRight) {
		$('#nodePropertiesPane').animate({'right' :'-400px'}, 100, function () {
			$('#graphContainer').css({'right' : ''});
			$('#graphContainer').animate({'left': '0px'}, 100, function () {
				$('#graphContainer').css({'left': ''});
				showingPropertiesRight = false; 
	   		});
		});
	}
	editingProperties = false; 
	$('#nodePropertiesPane').off('click');
};
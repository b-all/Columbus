var showingNodeProps = false;
var showingRelProps = false;

var showNodeData = function (d) {
	var docEl = document.documentElement,
        bodyEl = document.getElementsByTagName('body')[0];
    var width =  docEl.clientWidth,
        height =  docEl.clientHeight;

	$('.submitBtn').hide();

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
	var props = [];
    var data = [];
    for (var i in d.data) {
        var obj = {};
        obj[i] = d.data[i];
        data.push(obj);
    }
    if (typeof localStorage.columbusPreferences !== 'undefined') {
        var lsProps = JSON.parse(localStorage.columbusPreferences).hoverPriorities;
        for (var i = 0; i < lsProps.length; i++) {
            if (d.labels[0] === lsProps[i].label) {
                props.push(lsProps[i].property);
            }
        }
    }
    for (var i = 0; i < props.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].hasOwnProperty(props[i])) {
                var dataToMove = data[j];
                data.splice(j, 1);
                data.unshift(dataToMove);
            }
        }
    }
	var ePropsString = "<table class=\"propertyTable\">";
	for (var i in data) {
		if (Object.getOwnPropertyNames(data[i])[0] === 'prototype' ||
			Object.getOwnPropertyNames(data[i])[0] === 'length') {
				continue;
		}
		ePropsString += "<tr>" +
							"<td><input type=\"text\" class=\"form-control pNameInput\" value=\"" + escapeHtml(Object.getOwnPropertyNames(data[i])[0]) + "\"></input></td>" +
							"<td> : </td>" +
							"<td><input type=\"text\" class=\"form-control pValueInput\" value=\"" + escapeHtml(data[i][Object.getOwnPropertyNames(data[i])[0]]) + "\"></input></td>" +
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
	}
	if (Object.keys(d.data).length === 0) {
		ePropsString += "<tr>" +
							"<td><input type=\"text\" class=\"form-control pNameInput\"></input></td>" +
							"<td> : </td>" +
							"<td><input type=\"text\" class=\"form-control pValueInput\"></input></td>" +
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
	}
	ePropsString += "</table>";
	editableProps.append(ePropsString);
	if ($('tr', '#editableProperties > .propertyTable').length <= 1) {
		$('.deletePropBtn').hide();
	}
	$('tr', editableProps).each(function (){
		var row = this;
		$('.deletePropBtn', row).on('click', function() {
			if ($('tr', '#editableProperties > .propertyTable').length > 1) {
	            $(row).remove();
	        }
	        if ($('tr', '#editableProperties > .propertyTable').length <= 1) {
	            $('.deletePropBtn').hide();
	        }
		});
		$('.addPropBtn', row).on('click', function() {
	        var index = $('tr', '#editableProperties > .propertyTable').index(row);
	        addPropertyUpdate(index);
	        if($('tr', '#editableProperties > .propertyTable').length > 1) {
	            $('.deletePropBtn').show();
	        }
	    });
	});

	$('#sideMenu').on('click', function () {
		editingProperties = true;
	});

	//show save button
	$('.saveBtn').show();
	$('.deleteBtn').attr("data-original-title","Delete selected node");
	$('.deleteBtn').show();
	$('.propertyEditBtn').show();

	// set save button onclick function
	setNodeSaveBtnOnClick(d);
	// set delete button onclick function
	setNodeDeleteBtnOnClick(d);
	setNodePropertyEditBtnOnClick(d)
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
	$('.deleteBtn').hide();
	$('.propertyEditBtn').show();

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
							"<td><input type=\"text\" class=\"form-control pNameInput\" value=\"" + i + "\"></input></td>" +
							"<td> : </td>" +
							"<td><input type=\"text\" class=\"form-control pValueInput\" value=\"" + escapeHtml(d.data[i]) + "\"></input></td>" +
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
	}
	if (Object.keys(d.data).length === 0) {
		ePropsString += "<tr>" +
							"<td><input type=\"text\" class=\"form-control pNameInput\" value=\"\"></input></td>" +
							"<td> : </td>" +
							"<td><input type=\"text\" class=\"form-control pValueInput\" value=\"\"></input></td>" +
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
	}
	ePropsString += "</table>";

	editableProps.append(ePropsString);
	if ($('tr', '#editableProperties > .propertyTable').length <= 1) {
		$('.deletePropBtn').hide();
	}

	//set delete button on click
	$('tr', editableProps).each(function (){
		var row = this;
		$('.deletePropBtn', row).on('click', function() {
			if ($('tr', '#editableProperties > .propertyTable').length > 1) {
				$(row).remove();
			}
			if ($('tr', '#editableProperties > .propertyTable').length <= 1) {
				$('.deletePropBtn').hide();
			}
		});
		$('.addPropBtn', row).on('click', function() {
	        var index = $('tr', '#editableProperties > .propertyTable').index(row);
	        addPropertyUpdate(index);
	        if($('tr', '#editableProperties > .propertyTable').length > 1) {
	            $('.deletePropBtn').show();
	        }
	    });
	});

	$('#sideMenu').on('click', function () {
		editingProperties = true;
	});

	//show save button
	$('.saveBtn').show();
	$('.deleteBtn').attr("data-original-title","Delete selected relationship");
	$('.deleteBtn').show();
	$('.propertyEditBtn').show();
	setRelSaveBtnOnClick(d);
	// set delete button onclick function
	setRelDeleteBtnOnClick(d);
	setRelEditPropertyBtnOnClick(d);

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
	$('.deleteBtn').hide();
	$('.propertyEditBtn').hide();
};

function setNodeSaveBtnOnClick (d) {
	$('.saveBtn').off('click');
	$('.saveBtn').on('click', function () {
		var updatedProps = {
			id: d.id,
			data: {}
		};
		var propRows = $('tr', '#editableProperties');
		propRows.each(function() {
			var s = $('.pNameInput', this).val();
			// add inputs to update object
			if (typeof s !== 'undefined') {
				updatedProps.data[s] = $('.pValueInput', this).val();
			}
		});

		updatedProps.data = cleanData(updatedProps.data);
		updatedProps = {
			node: JSON.stringify(updatedProps)
		};
		updateNodeProperties(updatedProps, function () {
			d.data = JSON.parse(updatedProps.node).data;
		});
	});
}

function setRelSaveBtnOnClick (d) {
	$('.saveBtn').off('click');
	$('.saveBtn').on('click', function () {
		var updatedProps = {
			id: d.id,
			data: {}
		};
		var propRows = $('tr', '#editableProperties');
		propRows.each(function() {
			var s = $('.pNameInput', this).val();
			// add inputs to update object
			if (typeof s !== 'undefined') {
				updatedProps.data[s] = $('.pValueInput', this).val();
			}
		});

		updatedProps.data = cleanData(updatedProps.data);
		updatedProps = {
			rel: JSON.stringify(updatedProps)
		};
		updateRelProperties(updatedProps, function () {
			d.data = JSON.parse(updatedProps.rel).data;
		});
	});
}

function setNodeDeleteBtnOnClick (d) {
	$('.deleteBtn').off('click');
	$('.deleteBtn').on('click', function () {
		requestDeleteNode(graph.state.selectedNode, graph.deleteNode);
		hideSideMenu('node');
	});
}

function setRelDeleteBtnOnClick (d) {
	$('.deleteBtn').off('click');
	$('.deleteBtn').on('click', function () {
		requestDeleteRelationship(graph.state.selectedEdge, graph.deleteRel);
		hideSideMenu('relationship');
	});
}

function setNodePropertyEditBtnOnClick(d) {
	$('.propertyEditBtn').off('click');
	$('.propertyEditBtn').on('click', function () {
		$('#editPropertiesModalTable').empty();
		var j = 0;
		for (i in d.data) {
			$('#editPropertiesModalTable').append(
				'<tr>' +
					'<td class="pNameInput">' +
						i +
					'</td>' +
					'<td width="5px">' +
						':' +
					'</td>' +
					'<td><textarea id="ta'+ j + '" class="form-control pValueInput">' +
						d.data[i] +
					'</textarea></td>' +
				'</tr>'
			);
			j++;
		}

		$('#editPropertiesModal').modal('show');
		setTimeout(function(){
			$('textarea').each(function (){
				$(this).height($(this)[0].scrollHeight);
			});
			$('.modal-backdrop').css({
		        height: $('#editPropertiesModal')[0].scrollHeight
		    });
		},200);

		//set Modal save button on-click
		$('#modalSaveBtn').off('click');
		$('#modalSaveBtn').on('click', function () {
			var updatedProps = {
				id: d.id,
				data: {}
			};
			var propRows = $('tr', '#editPropertiesModalTable');
			propRows.each(function() {
				var s = $('.pNameInput', this).html();
				// add inputs to update object
				if (typeof s !== 'undefined') {
					updatedProps.data[s] = $('.pValueInput', this).val();
				}
			});

			updatedProps = {
				node: JSON.stringify(updatedProps)
			};
			updateNodeProperties(updatedProps, function () {
				d.data = JSON.parse(updatedProps.node).data;
				hideSideMenu('node');
			});

		});

	});
}

function setRelEditPropertyBtnOnClick(d) {
	$('.propertyEditBtn').off('click');
	$('.propertyEditBtn').on('click', function () {
		$('#editPropertiesModalTable').empty();
		var j = 0;
		for (i in d.data) {
			$('#editPropertiesModalTable').append(
				'<tr>' +
					'<td class="pNameInput">' +
						i +
					'</td>' +
					'<td width="5px">' +
						':' +
					'</td>' +
					'<td><textarea id="ta'+ j + '" class="form-control pValueInput">' +
						d.data[i] +
					'</textarea></td>' +
				'</tr>'
			);
			j++;
		}

		$('#editPropertiesModal').modal('show');
		setTimeout(function(){
			$('textarea').each(function (){
				$(this).height($(this)[0].scrollHeight);
			});
			$('.modal-backdrop').css({
		        height: $('#editPropertiesModal')[0].scrollHeight
		    });
		},200);

		//set Modal save button on-click
		$('#modalSaveBtn').off('click');
		$('#modalSaveBtn').on('click', function () {
			var updatedProps = {
				id: d.id,
				data: {}
			};
			var propRows = $('tr', '#editPropertiesModalTable');
			propRows.each(function() {
				var s = $('.pNameInput', this).html();
				// add inputs to update object
				if (typeof s !== 'undefined') {
					updatedProps.data[s] = $('.pValueInput', this).val();
				}
			});

			updatedProps = {
				rel: JSON.stringify(updatedProps)
			};
			updateRelProperties(updatedProps, function () {
				d.data = JSON.parse(updatedProps.rel).data;
				hideSideMenu('relationship');
			});

		});

	});
}

function escapeHtml(unsafe) {
	if (unsafe !== null) {
		return unsafe.toString()
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}

function addPropertyUpdate (index) {
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
        if ($('tr', editablePropertiesTable).length > 1) {
            justAddedRow.remove();
        }
        if ($('tr', editablePropertiesTable).length <= 1) {
            $('.deletePropBtn').hide();
        }
    });
    $('.addPropBtn', justAddedRow).on('click', function() {
        var index = $('tr', editablePropertiesTable).index(justAddedRow);
        addPropertyUpdate(index);
        if($('tr', editablePropertiesTable).length > 1) {
            $('.deletePropBtn').show();
        }
    });

}

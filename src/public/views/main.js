function pullGraph() {
	$.get('graph').done(function (data) {
		console.log(data);
	});
}

function addNode() {
	$.post('addNode', {name: 'Test1'}).done(function (data) {
		console.log(data)
	});
}
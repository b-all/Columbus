// routes requested urls
function route(handle, pathname, req, res) {
	console.log("About to route a request for " + pathname);

	//if the pathname exists in the handle array, run the function
	if (typeof handle[pathname] === 'function') {
		handle[pathname](req, res);
	} else { // try to retrieve a file @ pathname from the webroot directory
		handle["/webroot"](req, res, pathname);
	}
} 

// export route function so that other modules can use it
exports.route = route;
function hasProperties(data) {
    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key !== "") {
                return true;
            }
        }
    }
    return false;
}

function validateRelationship(type, startNode, endNode) {
    if (typeof type === 'undefined' || type === '') {
        toastFail("Please enter a relationship type.");
        return false;
    } else if (typeof startNode === 'undefined' || startNode === '') {
        toastFail("Please enter a starting node.");
        return false;
    } else if (typeof endNode === 'undefined' || endNode === '') {
        toastFail("Please enter an ending node.");
        return false;
    }

    if (!graph.hasNode(parseInt(endNode))) {
        toastFail("There is no node with that id");
        return false;
    }
    return true;
}

// define ForceGraphCreator object
var ForceGraphCreator = function(svg, nodes, edges){
    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
        height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var thisGraph = this;

    ForceGraphCreator.prototype.consts = {
        selectedClass: "selected",
        connectClass: "connect-node",
        circleGClass: "conceptG",
        graphClass: "graph",
        activeEditId: "active-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        nodeRadius: 50
    };

    ForceGraphCreator.prototype.dragmove = function(d) {
        var thisGraph = this;
        if (thisGraph.state.shiftNodeDrag){
            thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(thisGraph.svgG.node())[1]);
        } else{
            d.x += d3.event.dx;
            d.y +=  d3.event.dy;
            thisGraph.updateGraph();
        }
    };

    //drag graph behavior
    thisGraph.drag = d3.behavior.drag()
        .origin(function(d){
            return {x: d.x, y: d.y};
        })
        .on("drag", function(args){
            console.log("here")
            thisGraph.state.justDragged = true;
            thisGraph.dragmove.call(thisGraph, args);
        })
        .on("dragend", function() {
            // todo check if edge-mode is selected
        });

    
    thisGraph.state = {
        selectedNode: null,
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownLink: null,
        justDragged: false,
        justScaleTransGraph: false,
        lastKeyDown: -1,
        shiftNodeDrag: false,
        selectedText: null
    };
    thisGraph.svg = svg;
    thisGraph.svgG = svg.append("g")
        .classed(thisGraph.consts.graphClass, true);

    // listen for resize
    window.onresize = function(){updateWindow(svg);};


    svg.on("mousedown", function(d){svgMouseDown(thisGraph, d);});
    svg.on("mouseup", function(d){svgMouseUp(thisGraph, d);});

    
    var svgG = thisGraph.svgG;

    function svgMouseUp (d) {
        state = thisGraph.state;
        if (state.justScaleTransGraph) {
            // dragged not clicked
            state.justScaleTransGraph = false;
        } else if (state.graphMouseDown && d3.event.shiftKey){
            // clicked not dragged from svg
            var xycoords = d3.mouse(thisGraph.svgG.node()),
            d = {id: thisGraph.idct++, title: "new concept", x: xycoords[0], y: xycoords[1]};
            thisGraph.nodes.push(d);
            thisGraph.updateGraph();
            // make title of text immediently editable
            var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
                return dval.id === d.id;
            }), d),
            txtNode = d3txt.node();
            thisGraph.selectElementContents(txtNode);
            txtNode.focus();
        } else if (state.shiftNodeDrag){
            // dragged from node
            state.shiftNodeDrag = false;
            thisGraph.dragLine.classed("hidden", true);
        }
        state.graphMouseDown = false;
    }

    function svgMouseDown(d){
        /*var prevNode = this.state.selectedNode;
        if (prevNode) {
            this.removeSelectFromNode();
        }
        var prevRel = this.state.selectedEdge; 
        if (prevRel) {
            this.removeSelectFromEdge();
        }*/
        hideSideMenu('relationship');
        hideSideMenu('node');
        d3.selectAll('.node').attr('selected',false)
            .select('circle')
            .attr('fill', function(d){return d.color;});
        d3.selectAll('.link').attr('selected',false)
            .select('path')
            .attr('stroke', function(d){return 'black'});
    }

    function zoomed () {
        thisGraph.state.justScaleTransGraph = true;
        d3.select("." + thisGraph.consts.graphClass)
            .attr("transform", "translate(" + (translateDelta = d3.event.translate) + ") scale(" + (zoomRatio = d3.event.scale) + ")"); 
    }

    function updateWindow (svg){
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    };

    // listen for dragging
    var dragSvg = d3.behavior.zoom()
        .on("zoom", function(){
            if (d3.event.sourceEvent.shiftKey){
                // TODO  the internal d3 state is still changing
                return false;
            } else{
                zoomed(thisGraph);
            }
            return true;
        })
        .on("zoomstart", function(){
            if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
        })
        .on("zoomend", function(){
            d3.select('body').style("cursor", "auto");
        });

    svg.call(dragSvg).on("dblclick.zoom", null);

    

    ForceGraphCreator.prototype.updateGraph = function () {
        var force = d3.layout.force()
            .size([width, height])
            .charge(-400)
            .linkDistance(100)
            .on("tick", tick);

        var drag = force.drag()
            .on("dragstart", dragstart)
            .on("dragend", dragend);

        var container = d3.select('.graph');
        var link = container.selectAll(".link"),
            node = container.selectAll(".node");

        // build the arrow.
        var defs = container.append('svg:defs');
        defs.append('svg:marker')
            .attr('id', 'end')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', "32")
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        force
            .nodes(nodes)
            .links(edges)
            .start();

        link = link.data(edges)
            .enter().append("svg:g")
            .attr("class", "link")
            .on('mousedown', function(d) {
                d3.event.stopPropagation();
                var allNodes = d3.selectAll('.node')
                    .attr('selected', 'false')
                    .select('circle')
                    .attr('fill', function(d){return d.color;});
                var allLinks = d3.selectAll('.link')
                    .attr('selected', 'false')
                    .select('path')
                    .attr('stroke', function(d){return 'black'});
                d3.select(this)
                    .attr('selected', 'true')
                    .select('path')
                    .attr("stroke", "rgb(255, 214, 168)");
                showSideMenu('relationship', d);
            })
            .append("svg:path")
            .attr("marker-end", "url(#end)");

        node = node.data(nodes)
            .enter().append("g")
            .on('mousedown', function(d) {
                d3.event.stopPropagation();
                var allNodes = d3.selectAll('.node')
                    .attr('selected', 'false')
                    .select('circle')
                    .attr('fill', function(d){return d.color;});
                var allLinks = d3.selectAll('.link')
                    .attr('selected', 'false')
                    .select('path')
                    .attr('stroke', function(d){return 'black'});
                d3.select(this).attr('selected', 'true')
                    .select('circle')
                    .attr("fill", "rgb(255, 214, 168)");
                showSideMenu('node', d);
                
            })
            .call(drag)
            .attr("class", "node")
            .append("circle")
            .attr("r", 30);
            

        // place text on each node
        var labels = d3.select(".graph").selectAll(".node").append("text");

        function tick() {
            link.attr("d", function(d){
                return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
            });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            //color lines
            d3.selectAll('.link').select('path')
                .attr("stroke", function(d) {
                    return (d3.select(this.parentNode).attr('selected') === 'true') ? "rgb(255,214,168)" : 'black';
                });

            //color nodes
            d3.selectAll('.node').select('circle')
                .attr("fill", function(d) {
                    return (d3.select(this.parentNode).attr('selected') === 'true') ? "rgb(255,214,168)" : d.color;
                });

            labels.attr("x", function(d){ return isNaN(d.x) ?  d.x : parseFloat(d.x) - 10;  })
                .attr("y", function(d){ return isNaN(d.y) ?  d.y : parseFloat(d.y) + 3; })
                .attr("fill", "black")
                .attr("font-size", "10")
                .style("cursor", 'default')
                .text(function(d){return d.id});
        }


        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

        function dragend(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }
    }  
};

var zoomRatio = 1;
var translateDelta = [0,0];
var clickedOnNodeOrRelationship = true;
(function() {
  var arrowPath, nodeCaption, nodeOutline, nodeRing, noop, relationshipOverlay, relationshipType;
  noop = function() {};
  nodeOutline = new neo.Renderer({
    onGraphChange: function(selection, viz) {
      var circles;
      circles = selection.selectAll('circle.outline').data(function(node) {
        return [node];
      });
      circles.enter().append('circle').classed('outline', true).attr({
        cx: 0,
        cy: 0
      });
      circles.attr({
        r: function(node) {
          return node.radius;
        },
        fill: function(node) {
          return viz.style.forNode(node).get('color');
        },
        stroke: function(node) {
          return viz.style.forNode(node).get('border-color');
        },
        'stroke-width': function(node) {
          return viz.style.forNode(node).get('border-width');
        }
      });
      return circles.exit().remove();
    },
    onTick: noop
  });
  nodeCaption = new neo.Renderer({
    onGraphChange: function(selection, viz) {
      var text;
      text = selection.selectAll('text').data(function(node) {
        return node.caption;
      });
      text.enter().append('text').attr({
        'text-anchor': 'middle'
      });
      text.text(function(line) {
        return line.text;
      }).attr('y', function(line) {
        return line.baseline;
      }).attr('font-size', function(line) {
        return viz.style.forNode(line.node).get('font-size');
      }).attr({
        'fill': function(line) {
          return viz.style.forNode(line.node).get('text-color-internal');
        }
      });
      return text.exit().remove();
    },
    onTick: noop
  });
  nodeRing = new neo.Renderer({
    onGraphChange: function(selection) {
      var circles;
      circles = selection.selectAll('circle.ring').data(function(node) {
        return [node];
      });
      circles.enter().insert('circle', '.outline').classed('ring', true).attr({
        cx: 0,
        cy: 0,
        'stroke-width': '8px'
      });
      circles.attr({
        r: function(node) {
          return node.radius + 4;
        }
      });
      return circles.exit().remove();
    },
    onTick: noop
  });
  arrowPath = new neo.Renderer({
    name: 'arrowPath',
    onGraphChange: function(selection, viz) {
      var paths;
      paths = selection.selectAll('path.outline').data(function(rel) {
        return [rel];
      });
      paths.enter().append('path').classed('outline', true);
      paths.attr('fill', function(rel) {
        return viz.style.forRelationship(rel).get('color');
      }).attr('stroke', 'none');
      return paths.exit().remove();
    },
    onTick: function(selection) {
      return selection.selectAll('path').attr('d', function(d) {
        return d.arrow.outline(d.shortCaptionLength);
      });
    }
  });
  relationshipType = new neo.Renderer({
    name: 'relationshipType',
    onGraphChange: function(selection, viz) {
      var texts;
      texts = selection.selectAll("text").data(function(rel) {
        return [rel];
      });
      texts.enter().append("text").attr({
        "text-anchor": "middle"
      });
      texts.attr('font-size', function(rel) {
        return viz.style.forRelationship(rel).get('font-size');
      }).attr('fill', function(rel) {
        return viz.style.forRelationship(rel).get('text-color-' + rel.captionLayout);
      });
      return texts.exit().remove();
    },
    onTick: function(selection, viz) {
      return selection.selectAll('text').attr('x', function(rel) {
        return rel.arrow.midShaftPoint.x;
      }).attr('y', function(rel) {
        return rel.arrow.midShaftPoint.y + parseFloat(viz.style.forRelationship(rel).get('font-size')) / 2 - 1;
      }).attr('transform', function(rel) {
        if (rel.naturalAngle < 90 || rel.naturalAngle > 270) {
          return "rotate(180 " + rel.arrow.midShaftPoint.x + " " + rel.arrow.midShaftPoint.y + ")";
        } else {
          return null;
        }
      }).text(function(rel) {
        return rel.shortCaption;
      });
    }
  });
  relationshipOverlay = new neo.Renderer({
    name: 'relationshipOverlay',
    onGraphChange: function(selection) {
      var rects;
      rects = selection.selectAll('path.overlay').data(function(rel) {
        return [rel];
      });
      rects.enter().append('path').classed('overlay', true);
      return rects.exit().remove();
    },
    onTick: function(selection) {
      var band;
      band = 16;
      return selection.selectAll('path.overlay').attr('d', function(d) {
        return d.arrow.overlay(band);
      });
    }
  });
  neo.renderers.node.push(nodeOutline);
  neo.renderers.node.push(nodeCaption);
  neo.renderers.node.push(nodeRing);
  neo.renderers.relationship.push(arrowPath);
  neo.renderers.relationship.push(relationshipType);
  return neo.renderers.relationship.push(relationshipOverlay);
})();

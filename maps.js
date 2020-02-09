// Author:
// Jin Yan, from School of Management and Engineering, 
// Capital University of Economics and Business, Beijing, China
// Copyright @ 2019-2020
// All Right Reserved
// GAREMP: Graphical Attribute and Relationship Explorer for Map Projections
// http://garemp.github.io/

var s;
var loaded = 0;
var mobile_dev = false;

drawcvco = true;
uselent = false;

sigma.utils.pkg('sigma.canvas.nodes');
sigma.canvas.nodes.image = (function () {
  var _cache = {},
    _loading = {},
    _callbacks = {};

  // Return the renderer itself:
  var renderer = function (node, context, settings) {
    var args = arguments,
      prefix = settings('prefix') || '',
      size = node[prefix + 'size'],
      color = node.color || settings('defaultNodeColor'),
      url = node.url;

    if (_cache[url]) {
      context.save();

      // Draw the clipping disc:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.clip();

      // Draw the image
      context.drawImage(
        _cache[url],
        node[prefix + 'x'] - size,
        node[prefix + 'y'] - size,
        2 * size,
        2 * size
      );

      // Quit the "clipping mode":
      context.restore();

      // Draw the border:
      // context.beginPath();
      // context.arc(
      //   node[prefix + 'x'],
      //   node[prefix + 'y'],
      //   node[prefix + 'size'],
      //   0,
      //   Math.PI * 2,
      //   true
      // );
      // context.lineWidth = size / 5;
      // context.strokeStyle = node.color || settings('defaultNodeColor');
      // context.stroke();
    } else {
      sigma.canvas.nodes.image.cache(url);
      sigma.canvas.nodes.def.apply(
        sigma.canvas.nodes,
        args
      );
    }
  };

  // Let's add a public method to cache images, to make it possible to
  // preload images before the initial rendering:
  renderer.cache = function (url, callback) {
    if (callback)
      _callbacks[url] = callback;

    if (_loading[url])
      return;

    var img = new Image();

    img.onload = function () {
      _loading[url] = false;
      _cache[url] = img;

      if (_callbacks[url]) {
        _callbacks[url].call(this, img);
        delete _callbacks[url];
      }
    };

    _loading[url] = true;
    img.src = url;
  };

  return renderer;
})();

var filter;

urls = [
  'img/gpb-g.png',
  'img/gpb,g.png',
  'img/gpb-m.png',
  'img/gpb,m.png',
  'img/gpg-b.png',
  'img/gpg,b.png',
  'img/gpg-m.png',
  'img/gpg,m.png',
  'img/gpm-b.png',
  'img/gpm,b.png',
  'img/gpm-g.png',
  'img/gpm,g.png',
  'img/gpr,m.png',
  'img/gpr-y.png',
  'img/gpm,c.png',
  'img/gpc-m.png',
  'img/r,m.png',
  'img/r,y.png',
  'img/g,y.png',
  'img/c,m.png',
  'img/y,m.png',
  'img/g-r.png',
  'img/g-rk.png',
  'img/gray-r.png',
  'img/gray-rk.png',
  'img/gray-o.png',
  'img/gray-ok.png',
  'img/m-o.png',
  'img/mby.png',
  'img/moby.png',
  'img/b,o.png',
  'img/mbo.png',
  'img/bok.png',
  'img/mbok.png',
  'img/r,c.png',
  'img/c,r.png',
  'img/ryk.png',
  'img/icosa.png'
];

function updateColorinfo(sel, cat_l2) {
  $("#colorinfo-pane").empty();
  if (mobile_dev)
    $("#color-count-info-pane").css({ 'bottom': parseInt($('#drawcvco').css('height')) + 20 + 'px' });
  $("#colorinfo-pane").append("<div id='legend-title'><b>Legends</b></div>");
  var offset = 0;
  if (sel == "developable surfaces") {
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[0] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;cylindrical</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[1] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;conic</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[2] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;azimuthal (partial blue disc </div><br>");
    $("#colorinfo-pane").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;means <span title='modifiedazimuthal in some references&#10;or ralated to azimuthal in CSISS'><u>azimuthal related</u></span>)<br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[5] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;pseudo-(cylindrical or <span title='some pseudoconic map projections&#10;are classified as conic in some references,&#10;e.g., Bonne, Werner, etc.'><u>conic</u></span>)</div><br>");
    if (uselent)
      $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[3] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;lenticular</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + "#f88018" + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;polyconic</div><br>");
    $("#colorinfo-pane").append("<image src='img/icosa.png' height='20px' width='20px'><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;polyhedral</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + "#000" + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;miscellaneous</div><br>");
    return;
  }
  if (sel == "similar shape") {
    $("#colorinfo-pane").append("<image src='img/gray-r.png' height='20px' width='20px'><image src='img/g-r.png' height='20px' width='20px'><image src='img/g-rk.png' height='20px' width='20px'><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;similar shape</div><br>");
    $("#colorinfo-pane").append("<image src='img/gray-o.png' height='20px' width='20px'><image src='img/gray-ok.png' height='20px' width='20px'><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;similar shape</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[1] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;(may be) interrupted</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[2] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;Bonne group</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[3] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;cylindrical equal-area family</div><br>");
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[4] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;stretching</div><br>");
    return;
  }
  if (sel == "combinations") {
    $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[0] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;source</div><br>");
    offset = 1;
  }
  else {
    offset = 0;
  }
  Object.values(cat_l2).forEach(function (c, idx) {
    if (c == "McBryde or McBT")
      $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[idx + offset] + "''></div><div title = 'McBT denotes McBryde-Thomas' class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;" + c + "</div><br>")
    else if (c == "other same shapes") {
      $("#colorinfo-pane").append("<image src='img/qmark.png' height='20px' width='20px'><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;bi-color discs represent</div><br>");
      $("#colorinfo-pane").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;other cases of the same shape")
    }
    else
      $("#colorinfo-pane").append("<div class='circle' style='display:inline-block;background-color:" + colormap[idx + offset] + "''></div><div class='legend-text' style='display:inline-block'>&nbsp;&nbsp;&nbsp;" + c + "</div><br>")
  })
}

function updateCountinfo(nodecount) {
  eds = s.renderers[0].edgesOnScreen;
  var countdi = 0;
  var countudi = 0;
  for (var i = 0; i < eds.length; i++) {
    if (eds[i].type == "curvedArrow")
      countdi++;
    else
      countudi++;
  }
  // console.log(eds);
  if (nodecount == 0)
    $("#countinfo-pane").empty().append("<p class='countfont'>No node on screen.</p > ");
  else if (nodecount == 1) {
    if (countdi + countudi == 0)
      $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and no edges on screen.</p > ");
    else if (countdi + countudi == 1) {
      if (countdi == 1)
        $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and " + (countdi + countudi) + " edge (" + countdi + " directed) on screen.</p > ");
      else
        $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and " + (countdi + countudi) + " edge (" + countudi + " undirected) on screen.</p > ");
    }
    else {
      if (countudi == 0)
        $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and " + (countdi + countudi) + " edges (" + countdi + " directed) on screen.</p > ");
      else if (countdi == 0)
        $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and " + (countdi + countudi) + " edges (" + countudi + " undirected) on screen.</p > ");
      else
        $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " node and " + (countdi + countudi) + " edges (" + countdi + " directed and " + countudi + " undirected) on screen.</p > ");
    }
  }
  else {
    $("#countinfo-pane").empty().append("<p class='countfont'>" + nodecount + " nodes and " + (countdi + countudi) + " edges (" + countdi + " directed and " + countudi + " undirected) on screen.</p > ");
  }
}

function genarray(arr, a, b, step) {
  for (var i = a; i < b; i = i + step)
    arr.push(i);
  return arr;
};

$(function () {
  var arr = [];
  genarray(arr, -300, 1500, 50);
  genarray(arr, 1500, 1800, 15);
  genarray(arr, 1800, 1900, 2);
  genarray(arr, 1900, 2021, 1);
  $("#reset-year").click(function () {
    nodes = s.graph.nodes();
    edges = s.graph.edges();
    for (i = 0; i < nodes.length; i++) {
      nodes[i].yearviz = true;
    }
    filter.undo('yearrange').apply();
    $("#slider-range").slider("values", 0, 0);
    $("#slider-range").slider("values", 1, arr.length - 1);
    var v0 = arr[$("#slider-range").slider("values", 0)];
    var v1 = arr[$("#slider-range").slider("values", 1)];
    if (v1 < 0)
      $("#amount").val(-v0 + "BC - " + -v1 + "BC");
    else if (v0 < 0)
      $("#amount").val(-v0 + "BC - " + v1);
    else
      $("#amount").val(v0 + " - " + v1);
  });
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: arr.length - 1,
    values: [0, arr.length - 1],
    slide: function (event, ui) {
      nodes = s.graph.nodes();
      edges = s.graph.edges();
      for (i = 0; i < nodes.length; i++) {
        nodes[i].yearviz = true;
      }
      $("#main-pane").empty();
      $("#minor-pane").empty();
      var v0 = arr[ui.values[0]];
      var v1 = arr[ui.values[1]];
      if (v1 < 0)
        $("#amount").val(-v0 + "BC - " + -v1 + "BC");
      else if (v0 < 0)
        $("#amount").val(-v0 + "BC - " + v1);
      else
        $("#amount").val(v0 + " - " + v1);
      var count_year = 0;
      filter
        .undo('yearrange')
        .nodesBy(function (n) {
          var found = false;
          //for (i = 0; i < Object.values(n.attributes).length; i++) {
          year = n.year;
          var reg = new RegExp("c.a.", 'i');
          if (reg.test(year))
            year = year.replace("c.a.", "");
          year = parseInt(year);

          reg = new RegExp("BC", 'i');
          if (reg.test(n.year))
            year = -year;

          reg = new RegExp("and", 'i');
          if (reg.test(n.year)) {
            split = n.year.split(" and ");
            y0 = parseInt(split[0]);
            y1 = parseInt(split[1]);
            if (y0 >= v0)
              if (y0 <= v1)
                found = true;
            if (y1 >= v0)
              if (y1 <= v1)
                found = true;
          }
          else {
            if (year >= v0)
              if (year <= v1)
                found = true;
          }
          if (found) {
            count_year++;
            // break;
          }
          // }
          if (!found)
            n.yearviz = false
          return found;
        }, 'yearrange')
        .apply();
      updateCountinfo(count_year);
    }
  });
  var v0 = arr[$("#slider-range").slider("values", 0)];
  var v1 = arr[$("#slider-range").slider("values", 1)];
  if (v1 < 0)
    $("#amount").val(-v0 + "BC - " + -v1 + "BC");
  else if (v0 < 0)
    $("#amount").val(-v0 + "BC - " + v1);
  else
    $("#amount").val(v0 + " - " + v1);
});

var _ = {
  $: function (id) {
    return document.getElementById(id);
  },

  all: function (selectors) {
    return document.querySelectorAll(selectors);
  },

  removeClass: function (selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for (i = 0; i < l; i++) {
      var el = nodes[i];
      // Bootstrap compatibility
      el.className = el.className.replace(cssClass, '');
    }
  },

  addClass: function (selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for (i = 0; i < l; i++) {
      var el = nodes[i];
      // Bootstrap compatibility
      if (-1 == el.className.indexOf(cssClass)) {
        el.className += ' ' + cssClass;
      }
    }
  },

  show: function (selectors) {
    this.removeClass(selectors, 'hidden');
  },

  hide: function (selectors) {
    this.addClass(selectors, 'hidden');
  },

  toggle: function (selectors, cssClass) {
    var cssClass = cssClass || "hidden";
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for (i = 0; i < l; i++) {
      var el = nodes[i];
      //el.style.display = (el.style.display != 'none' ? 'none' : '' );
      // Bootstrap compatibility
      if (-1 !== el.className.indexOf(cssClass)) {
        el.className = el.className.replace(cssClass, '');
      } else {
        el.className += ' ' + cssClass;
      }
    }
  }
};

var colormap = ["#c00", "#0c0", "#00c", "#c0c", "#0cc", "#cc0", "#cff", "#ffc", "#cfc", "#ccc", "#ccc", "#ccc", "#333"]

var g = {
  nodes: [],
  edges: []
};

urls.forEach(function (url) {
  sigma.canvas.nodes.image.cache(
    url,
    function () {
      if (++loaded === urls.length) {
        s = new sigma({
          graph: g,
          container: 'graph-container',
          renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
          },
          settings: {
            minNodeSize: 8,
            maxNodeSize: 16,
            enableEdgeHovering: true,
            edgeHoverColor: 'edge',
            defaultEdgeHoverColor: '#000',
            edgeHoverSizeRatio: 1,
            edgeHoverExtremities: true,
          }
        });
        s.bind('clickNode', function (e) {
          $("#minor-pane").hide();
          drawcvco = 0;
          $('#drawcvco').removeAttr("checked");
          node = e.data.node;
          updatePane("#main-pane", node, true);
        });

        s.bind('clickEdge', function (e) {
          nodes = s.graph.nodes();
          edges = s.graph.edges();
          node1 = nodes[e.data.edge.s];
          node2 = nodes[e.data.edge.t];
          updatePane("#main-pane", node1, false);
          updatePane("#minor-pane", node2, false);
          $("#minor-pane").append("<hr>");
          $("#minor-pane").append("<p>" + e.data.edge.desc + "</p>");
          drawcvco = 0;
          $('#drawcvco').removeAttr("checked");
          for (j = 0; j < edges.length; j++) {
            if (e.data.edge.id == edges[j].id) {
              edges[j].color = edges[j].defaultcolor;
            } else {
              edges[j].color = '#000';
            }
          }
          s.refresh();
        });

        s.bind('clickStage', function (e) {
          $("#type-pane").hide();
          $("#prop-pane").hide();
          // $("#list-box").val("------请选择------");
          // showMapInfo("mapl", null);
          // showMapInfo("mapr", null);
          clean = true;
          //forceCleanNode(e);
          $("#legend-pane").hide();
          if (mobile_dev) {
            $('#search-box').val('');
          }
          else {
            $('#search-box').focus().val('');
          }
          offset = 0;
          cur_node = null;
          cur_neig = null;
          $('#' + 'mapr' + '-relmap').html("");
          $('#' + 'mapr' + '-rel').html("");
          $('#' + 'mapr' + '-reldiv').hide();
        });

        sigma.parsers.json(
          'maps.json',
          s,
          function () {
            filter = new sigma.plugins.filter(s);

            // this is needed in case the original JSON doesn't have color / size / x-y attributes 
            var i,
              nodes = s.graph.nodes(),
              len = nodes.length;

            for (i = 0; i < len; i++) {
              nodes[i].cat1viz = true;
              nodes[i].cat2viz = true;
              nodes[i].yearviz = true;
            }

            for (i = 0; i < len; i++) {
              nodes[i].color = nodes[i].center ? '#333' : '#666';
            }

            var j,
              edges = s.graph.edges(),
              lene = edges.length;

            for (j = 0; j < lene; j++) {
              edges[j].type = 'curve';
              edges[j].defaultcolor = edges[j].color;
            }

            $('#uselent').change();

            // Refresh the display:
            s.refresh();

            for (j = 0; j < lene; j++) {
              if (edges[j].attributes[0] == "curved") {
                edges[j].type = 'curvedArrow';
              }
            }

            // Refresh the display:
            s.refresh();

            updateCountinfo(102);

            nolegendfornodes();

          }
        );

      }
    }
  );
});

var type_append = false;

var prop_append = false;

offset = 0;
cur_node = null;
cur_neig = null;

var clean = true;

var nextptr = 1;
var ptrlen = 0;
var neighbor;

function updatePane(pane, node, rel) {
  nodes = s.graph.nodes();
  edges = s.graph.edges();
  $(pane).empty();
  if (mobile_dev)
    $(pane).css({ 'top': parseInt($('#cat-l1').css('height')) + 20 + 'px' });
  if (node.name)
    $(pane).append("<h3 class=\"underline\">" + node.name + "</h3>");
  else
    $(pane).append("<h3 class=\"underline\">" + node.label + " projection</h3>");
  if (node.alias)
    $(pane).append("<p>Alias: " + node.alias + "</p>");
  if (node.crby)
    if (node.year)
      $(pane).append("<p>Created by " + node.crby + " in " + node.year + "</p>");
    else
      $(pane).append("<p>Created by " + node.crby + "</p>");
  var group = "";
  var attr = "";
  for (i = 0; i < Object.values(node.attributes).length; i++) {
    if (node.attributes[i] == "conformal" || node.attributes[i] == "equal-area" ||
      node.attributes[i] == "equidistant" || node.attributes[i] == "compromise")
      if (attr)
        attr += ", " + node.attributes[i];
      else
        attr += node.attributes[i];
    if (node.attributes[i] == "cylindrical" || node.attributes[i] == "pseudocylindrical" ||
      node.attributes[i] == "conic" || node.attributes[i] == "pseudoconic" ||
      node.attributes[i] == "azimuthal" || node.attributes[i] == "lenticular")
      group += node.attributes[i];
  }
  if (node.img)
    $(pane).append("<img src=\"" + node.img + "\" width=100%></img>");
  if (group)
    $(pane).append("<p>Type: " + group + "</p>");
  if (attr)
    $(pane).append("<p>Properties: " + attr + "</p>");
  $(pane).show();
  if (rel) {
    nextptr = 0;
    // ptrlen = Object.values(node.neighbors).length;
    neighbor = node.neighbors;
    for (j = 0; j < edges.length; j++) {
      edges[j].color = '#000';
    }
    visnb = [];
    visedge = [];
    node.edges.forEach(function (c, id) {
      if (id == 0)
        return;
      edges[c].color = edges[c].defaultcolor;
      vis = nodes[node.neighbors[id]].cat1viz && nodes[node.neighbors[id]].cat2viz &&
        nodes[node.neighbors[id]].yearviz;
      if (vis) {
        visnb.push(node.neighbors[id]);
        visedge.push(node.edges[id]);
      }
    });
    ptrlen = Object.values(visedge).length;
    if (ptrlen == 0)
      return;
    $(pane).append("<hr><div id=\"show-rel\" style=\"text-align:center\"><button id=\"show-btn\">show relations (" + ptrlen + ")</button></div>");
    $(pane).append("<div id=\"rel-area\"</div>");
    // console.log(visedge);
    s.refresh();
    $("#show-btn").click(function () {
      if (ptrlen > 1)
        $("#show-btn").text("next relations");
      else
        $("#show-btn").hide();
      for (j = 0; j < edges.length; j++) {
        edges[j].color = '#000';
      }
      if (nextptr >= ptrlen)
        nextptr = 0;
      edges[visedge[nextptr]].color = edges[visedge[nextptr]].defaultcolor;
      s.refresh();
      $("#rel-area").empty();
      $("#rel-area").append("<p>\<\< see <b>" + nodes[visnb[nextptr]].label +
        " projection</b> (" + (nextptr + 1) + "/" + (ptrlen) + ") in left side panel</p>");
      if (ptrlen > 1)
        $("#rel-area").append("<div style=\"text-align:center\"><button id=\"prev-btn\">prev relations</button></div>");
      $("#prev-btn").click(function () {
        nextptr--;
        nextptr--;
        if (nextptr < 0)
          nextptr = ptrlen - 1;
        $("#show-btn").click();
      });
      updatePane("#minor-pane", nodes[visnb[nextptr]], false);
      $("#minor-pane").append("<hr>");
      $("#minor-pane").append("<p>" + edges[visedge[nextptr]].desc + "</p>");
      nextptr++;
    });
  }
}

function forceCleanNode(e) {
  nodes = s.graph.nodes();
  for (j = 0; j < nodes.length; j++) {
    nodes[j].color = '#666';
  }
  s.refresh();
}

function updateLegendbyNode(e) {
  $("#red-info").html("<b><i>" + e.data.node.name + "</i></b>");
  $("#green-info").html("<b><i>" + e.data.node.name + "</i></b>");
  $("#blue-info").html("与<b><i>" + e.data.node.name + "</i></b> 相关联的其它投影");
}

function updateLegendbyEdge(node1, node2) {
  $("#red-info").html("<b><i>" + node1.name + "</i></b>");
  $("#green-info").html("<b><i>" + node2.name + "</i></b>");
}

function nolegendfornodes() {
  $("#colorinfo-pane").empty();
  if (mobile_dev)
    $("#color-count-info-pane").css({ 'bottom': parseInt($('#drawcvco').css('height')) + 20 + 'px' });
  $("#colorinfo-pane").append("<div id='legend-title'><b>No Legend for Nodes</b></div>");
};

var sub_categories = new Map();
sub_categories.set("developable surfaces", ["cylindrical", "conic", "azimuthal", "pseudocylindrical", "pseudoconic", "polyconic", "lenticular", "miscellaneous"]);
sub_categories.set("distortions", ["conformal", "equal-area", "equidistant", "compromise"]);
sub_categories.set("aspects (partial)", ["normal", "transverse", "oblique"]);
sub_categories.set("same shape", ["2:1 ellipse", "other same shapes"]);
sub_categories.set("similar shape", ["similar shape", "(may be) interrupted", "Bonne group", "cylindrical equal-area family", "stretching"]);
sub_categories.set("form of parallels", ["evenly spaced"]);
sub_categories.set("form of meridians", ["elliptical", "sinusoidal", "quartic", "parabolic", "hyperbolic"]);
sub_categories.set("form of poles", ["as straight lines", "as points"]);
sub_categories.set("combinations", ["fusion", "blending", "construction", "Tobler hyperelliptical family"]);
sub_categories.set("authors (inc. aliases)", ["Eckert", "Kavrayskiy", "Lambert", "McBryde or McBT", "Putniņš", "Siemon", "Strebe", "Tobler", "Wagner", "Werenskiold", "Winkel", "Hufnagel's family"]);

function catReset() {
  $("#main-pane").empty();
  $("#minor-pane").empty();
  filter
    .undo('categories')
    .nodesBy(function (n) {
      n.type = 'def';
      n.color = '#666';
      return true;
    })
    .apply();
  updateCountinfo(102);
  nolegendfornodes();
  $('#cat-l1').val('all categories');
  $("#cat-l2").empty();
  $("#cat-l2").append("<option>no sub-categories</option>");
  $('#cat-l2').val('no sub-categories');
  $('#cat-more').val('== no more filters ==');
}

function catFilter(sel, cat_l2, n) {
  var found = false;
  for (i = 0; i < Object.values(n.attributes).length; i++) {
    Object.values(cat_l2).forEach(function (c, idx) {
      if (sel == "developable surfaces") {
        if (n.attributes[i] == "cylindrical") {
          found = true;
          n.color = colormap[0];
        }
        else if (n.attributes[i] == "conic") {
          found = true;
          n.color = colormap[1];
        }
        else if (n.attributes[i] == "azimuthal") {
          found = true;
          n.color = colormap[2];
        }
        else if (n.attributes[i] == "pseudocylindrical") {
          found = true;
          n.type = 'image';
          n.url = 'img/r,y.png';
        }
        else if (n.attributes[i] == "pseudoconic") {
          found = true;
          n.type = 'image';
          n.url = 'img/g,y.png';
        }
        else if (n.attributes[i] == "pseudoazimuthal") {
          found = true;
          n.type = 'image';
          n.url = 'img/mby.png';
        }
        else if (n.attributes[i] == "miscellaneous") {
          found = true;
          n.color = "#000";
        }
        else if (n.attributes[i] == "polyhedral") {
          found = true;
          n.type = 'image';
          n.url = 'img/icosa.png';
        }
        if (n.label == "Aitoff" || n.label == "Wagner 7" || n.label == "Wagner 8" || n.label == "Wagner 9") {
          found = true;
          n.type = 'image';
          if (uselent)
            n.url = 'img/mbo.png';
          else
            n.url = 'img/b,o.png';
        }
        else if (n.label == "Hammer" || n.label == "Winkel 3") {
          found = true;
          n.type = 'image';
          if (uselent)
            n.url = 'img/mbok.png';
          else
            n.url = 'img/bok.png';
        }
        else if (n.label == "Ortelius Oval" || n.label == "Apian Globular I" || n.label == "Bacon Globular") {
          found = true;
          n.type = 'image';
          n.url = 'img/ryk.png';
        }
        else if (n.label == "Strebe 1995") {
          found = true;
          n.type = 'image';
          n.url = 'img/m-o.png';
        }
        else if (n.label == "Ciric I" || n.label == "A4" || n.label == "Dedistort") {
          found = true;
          n.color = "#F0F";
        }
        return;
      }
      if (sel == "same shape") {
        if (n.attributes[i].startsWith("same shape gp")) {
          val = n.attributes[i].substring(13);
          found = true;
          n.type = 'image';
          n.url = 'img/gp' + val + '.png';
        }
      }
      if (sel == "similar shape") {
        if (n.attributes[i].startsWith("cylindrical equal-area")) {
          found = true;
          n.type = 'image';
          n.url = 'img/c,m.png';
        }
        if (n.label == "Sinusoidal") {
          found = true;
          n.type = 'image';
          n.url = 'img/gpb,g.png';
        }
        if (n.label == "Boggs eumorphic") {
          found = true;
          n.type = 'image';
          n.url = 'img/g-r.png';
        }
        if (n.label == "Siemon IV") {
          found = true;
          n.type = 'image';
          n.url = 'img/g-rk.png';
        }
        if (n.label == "Putniņš P1" || n.label == "Putniņš P2") {
          found = true;
          n.type = 'image';
          n.url = 'img/gray-r.png';
        }
        if (n.label == "Putniņš P3'" || n.label == "Putniņš P4'") {
          found = true;
          n.type = 'image';
          n.url = 'img/gray-ok.png';
        }
        if (n.label == "Wagner 1" || n.label == "Wagner 2" || n.label == "Wagner 3") {
          found = true;
          n.type = 'image';
          n.url = 'img/gray-o.png';
        }
      }
      if (sel == "combinations") {
        if (n.attributes[i] == "fusion-src" || n.attributes[i] == "blending-src" || n.attributes[i] == "const-src") {
          found = true;
          n.type = 'def';
          n.color = colormap[0];
        }
        if (n.label == "Hammer" || n.label == "Aitoff") {
          n.type = 'image';
          n.url = 'img/r,m.png';
        }
        if (n.label == "Mollweide") {
          n.type = 'image';
          n.url = 'img/r,c.png';
        }
        if (n.label == "Collignon") {
          n.type = 'image';
          n.url = 'img/c,r.png';
        }
      }
      if (n.attributes[i] == c) {
        found = true;
        if (sel == "combinations") {
          n.type = 'def';
          n.color = colormap[idx + 1];
        }
        else if (sel == "distortions") {
          if (n.label == "Sinusoidal" || n.label == "Werner") {
            n.type = 'image';
            n.url = 'img/gpb,g.png';
          }
          else {
            n.type = 'def';
            n.color = colormap[idx];
          }
        }
        else {
          n.type = 'def';
          n.color = colormap[idx];
        }
      }
    })
  }
  return {
    found: found,
    type: n.type,
    color: n.color,
    url: n.url
  }
}

function catChange() {
  $("#main-pane").empty();
  $("#minor-pane").empty();

  nodes = s.graph.nodes();
  edges = s.graph.edges();

  sel = $(this).val();
  for (i = 0; i < nodes.length; i++) {
    nodes[i].cat1viz = true;
  }
  if (sel == "all categories") {
    $("#cat-l2").empty();
    $("#cat-l2").append("<option>no sub-categories</option>");
    filter
      .undo('categories')
      .nodesBy(function (n) {
        return n.cat2viz;
      }, 'categories')
      .apply();
    return;
  }
  var cat_l2 = sub_categories.get(sel);
  $("#cat-l2").empty();
  $("#cat-l2").append("<option>all sub-categories</option>");
  Object.values(cat_l2).forEach(function (c) { $("#cat-l2").append("<option>" + c + "</option>") });
  var viscount = 0;
  filter
    .undo('categories')
    .nodesBy(function (n) {
      var found = false;
      ret = catFilter(sel, cat_l2, n);
      if (ret.found)
        found = true;
      n.type = ret.type;
      n.color = ret.color;
      n.url = ret.url;
      if (!found)
        n.cat1viz = false;
      if (found && n.cat2viz)
        viscount++;
      return found && n.cat2viz && n.yearviz;
    }, 'categories')
    .apply();
  updateCountinfo(viscount);
  updateColorinfo(sel, cat_l2);
}

function subcatChange() {
  $("#main-pane").empty();
  $("#minor-pane").empty();

  sel = $(this).val();
  idx = this.selectedIndex - 1;

  for (i = 0; i < nodes.length; i++) {
    nodes[i].cat1viz = true;
  }
  if (sel == "all sub-categories") {
    parsel = $("#cat-l1").val();
    var cat_l2 = sub_categories.get(parsel);
    var viscount = 0;
    filter
      .undo('categories')
      .nodesBy(function (n) {
        var found = false;
        ret = catFilter(parsel, cat_l2, n);
        if (ret.found)
          found = true;
        n.type = ret.type;
        n.color = ret.color;
        n.url = ret.url;
        if (!found)
          n.cat1viz = false;
        if (found && n.cat2viz)
          viscount++;
        return found && n.cat2viz && n.yearviz;
      }, 'categories')
      .apply();
    updateCountinfo(viscount);
  }
  else {
    var viscount = 0;
    filter
      .undo('categories')
      .nodesBy(function (n) {
        var found = false;
        for (i = 0; i < Object.values(n.attributes).length; i++) {
          if (n.attributes[i] == sel) {
            found = true;
            n.type = 'def';
            n.color = colormap[idx];
            if (sel == "fusion" || sel == "blending" || sel == "construction")
              n.color = colormap[idx + 1];
          }
          if (sel == "cylindrical") {
            n.color = colormap[0];
          }
          if (sel == "conic") {
            n.color = colormap[1];
          }
          if (sel == "azimuthal") {
            n.color = colormap[2];
          }
          if (sel == "pseudocylindrical") {
            n.type = 'image';
            n.url = 'img/r,y.png';
            if (n.label == "Ortelius Oval" || n.label == "Apian Globular I" || n.label == "Bacon Globular") {
              found = true;
              n.type = 'image';
              n.url = 'img/ryk.png';
            }
          }
          if (sel == "pseudoconic") {
            n.type = 'image';
            n.url = 'img/g,y.png';
          }
          if (sel == "polyconic") {
            if (n.label == "Strebe 1995") {
              n.type = 'image';
              n.url = 'img/m-o.png';
            }
          }
          if (sel == "pseudoazimuthal") {
            n.type = 'image';
            n.url = 'img/mby.png';
            if (n.label == "Hammer" || n.label == "Winkel 3") {
              found = true;
              n.type = 'image';
              if (uselent)
                n.url = 'img/mbok.png';
              else
                n.url = 'img/bok.png';
            }
            if (n.label == "Aitoff" || n.label == "Wagner 7" || n.label == "Wagner 8" || n.label == "Wagner 9") {
              n.type = 'image';
              if (uselent)
                n.url = 'img/mbo.png';
              else
                n.url = 'img/b,o.png';
            }
          }
          if (sel == "miscellaneous") {
            n.color = "#000";
            if (n.label == "Hammer" || n.label == "Winkel 3") {
              n.type = 'image';
              if (uselent)
                n.url = 'img/mbok.png';
              else
                n.url = 'img/bok.png';
            }
          }
          if (sel == "polyhedral") {
            n.type = 'image';
            n.url = 'img/icosa.png';
          }
          if (sel == "equal-area" || sel == "equidistant") {
            if (n.label == "Sinusoidal" || n.label == "Werner") {
              n.type = 'image';
              n.url = 'img/gpb,g.png';
            }
          }
          if (sel == "other same shapes" && n.attributes[i].startsWith("same shape gp")) {
            val = n.attributes[i].substring(13);
            found = true;
            n.type = 'image';
            n.url = 'img/gp' + val + '.png';
          }
          if (sel == "similar shape" && (n.label == "Boggs eumorphic" ||
            n.label == "Siemon IV" || n.label == "Putniņš P1" ||
            n.label == "Putniņš P2" || n.label == "Putniņš P3'" ||
            n.label == "Putniņš P4'" || n.label == "Wagner 1" ||
            n.label == "Wagner 2" || n.label == "Wagner 3")) {
            if (n.label == "Boggs eumorphic") {
              found = true;
              n.type = 'image';
              n.url = 'img/g-r.png';
            }
            if (n.label == "Siemon IV") {
              found = true;
              n.type = 'image';
              n.url = 'img/g-rk.png';
            }
            if (n.label == "Putniņš P1" || n.label == "Putniņš P2") {
              found = true;
              n.type = 'image';
              n.url = 'img/gray-r.png';
            }
            if (n.label == "Putniņš P3'" || n.label == "Putniņš P4'") {
              found = true;
              n.type = 'image';
              n.url = 'img/gray-ok.png';
            }
            if (n.label == "Wagner 1" || n.label == "Wagner 2" || n.label == "Wagner 3") {
              found = true;
              n.type = 'image';
              n.url = 'img/gray-o.png';
            }
          }
          if (sel == "(may be) interrupted" || sel == "Bonne group") {
            if (n.label == "Sinusoidal") {
              found = true;
              n.type = 'image';
              n.url = 'img/gpb,g.png';
            }
          }
          if (sel == "cylindrical equal-area family" || sel == "stretching") {
            if (n.attributes[i].startsWith("cylindrical equal-area")) {
              found = true;
              n.type = 'image';
              n.url = 'img/c,m.png';
            }
          }
          if ((sel == "fusion" && n.attributes[i] == "fusion-src") ||
            (sel == "blending" && n.attributes[i] == "blending-src") ||
            (sel == "construction" && n.attributes[i] == "const-src")) {
            if (n.attributes[i] == "fusion-src" || n.attributes[i] == "blending-src" || n.attributes[i] == "const-src") {
              found = true;
              n.type = 'def';
              n.color = colormap[0];
            }
            if (n.label == "Hammer" || n.label == "Aitoff") {
              n.type = 'image';
              n.url = 'img/r,m.png';
            }
            if (n.label == "Mollweide") {
              n.type = 'image';
              n.url = 'img/r,c.png';
            }
            if (n.label == "Collignon") {
              n.type = 'image';
              n.url = 'img/c,r.png';
            }
          }
        }
        if (!found)
          n.cat1viz = false;
        if (found && n.cat2viz)
          viscount++;
        return found && n.cat2viz && n.yearviz;
      }, 'categories')
      .apply();
    updateCountinfo(viscount);
  }
}

function morecatChange() {
  nodes = s.graph.nodes();
  edges = s.graph.edges();
  sel = $(this).val();
  for (i = 0; i < nodes.length; i++) {
    nodes[i].cat2viz = true;
  }
  if (sel == "== no more filters ==") {
    var viscount = 0;
    filter
      .undo('categories')
      .nodesBy(function (n) {
        if (n.cat1viz)
          viscount++;
        return n.cat1viz;
      }, 'categories')
      .apply();
    updateCountinfo(viscount);
  }
  else {
    var viscount = 0;
    filter
      .undo('categories')
      .nodesBy(function (n) {
        var found = false;
        for (i = 0; i < Object.values(n.attributes).length; i++) {
          if (n.attributes[i] == sel)
            found = true;
        }
        if (!found)
          n.cat2viz = false;
        if (found && n.cat1viz)
          viscount++;
        return found && n.cat1viz && n.yearviz;
      }, 'categories')
      .apply();
    updateCountinfo(viscount);
  }
  s.refresh();
}

function search() {
  var context = $(this).val();
  var reg = new RegExp(context, 'i');
  $(this).val('');
  forceCleanNode();

  nodes = s.graph.nodes();
  var found = false;
  for (j = 0; j < nodes.length; j++) {
    if (reg.test(nodes[j].label)) {
      nodes[j].color = '#c00';
      // nodes[j].type = 'image';
      // nodes[j].url = 'img/gp0.png';
      found = true;
    }
  }
  if (found) {
    s.refresh();
  }
  else {
    $(this).val('no result found!').select();
  }
}

$(document).ready(function () {
  $("#red-circle").css("background", "#c00");//.hide();
  $("#blue-circle").css("background", "#00c");//.hide();
  $("#green-circle").css("background", "#0c0");//.hide();
  $("#search-pane").css("left", parseInt($("#search-pane").css("right")) / 2);
  $("#search-box").bind('change', search).focus();
  //$('#red-circle').hide();
  //$('#green-circle').hide();
  $("#legend-pane").hide();
  // $("#left-arrow").click(leftClick);
  // $("#right-arrow").click(rightClick);
  // $("#list-box").change(selChanged);
  $("#cat-l1").change(catChange);
  $("#cat-l2").change(subcatChange);
  $("#cat-more").change(morecatChange);
  $('#reset-all').click(catReset);
  $('#uselent').change(function () {
    uselent = !uselent;
    $('#cat-more').empty();
    $('#cat-more').append('<option>== no more filters ==</option>');
    $('#cat-more').append('<option>cylindrical</option>');
    $('#cat-more').append('<option>pseudocylindrical</option>');
    $('#cat-more').append('<option>conic</option>');
    $('#cat-more').append('<option>pseudoconic</option>');
    $('#cat-more').append('<option>azimuthal</option>');
    if (uselent)
      $('#cat-more').append('<option>lenticular</option>');
    $('#cat-more').append('<option>== no more filters ==</option>');
    $('#cat-more').append('<option>conformal</option>');
    $('#cat-more').append('<option>equal-area</option>');
    $('#cat-more').append('<option>equidistant</option>');
    $('#cat-more').append('<option>compromise</option>');
    $('#reset-all').click();
    if (uselent) {
      sub_categories.set("developable surfaces", ["cylindrical", "conic", "azimuthal", "pseudocylindrical", "pseudoconic", "polyconic", "lenticular", "miscellaneous"]);
    } else {
      sub_categories.set("developable surfaces", ["cylindrical", "conic", "azimuthal", "pseudocylindrical", "pseudoconic", "polyconic", "miscellaneous"]);
    }
  });
  $('#drawcvco').change(function () {
    nodes = s.graph.nodes();
    edges = s.graph.edges();
    drawcvco = !drawcvco;
    if (drawcvco) {
      for (j = 0; j < edges.length; j++) {
        edges[j].color = edges[j].defaultcolor;
      }
      s.refresh();
    } else {
      for (j = 0; j < edges.length; j++) {
        edges[j].color = '#000';
      }
      s.refresh();
    }
  });
  $('.link').mouseover(function (e) {
    // console.log('-------        '+$(this).attr('id'));
    $('.popup-div').not('#' + $(this).attr('id') + '-pane').hide();
    h = parseInt($(this).attr('height'));
    $('#' + $(this).attr('id') + '-pane').css({ 'position': 'absolute', 'top': e.pageY - h * 20, 'left': e.pageX + 10 });
    $('#' + $(this).attr('id') + '-pane').stop().show();
  });
  $('.link').mouseout(function () {
    // console.log('       ------- '+$(this).attr('id'));
    $('#' + $(this).attr('id') + '-pane').stop().fadeOut(3000);
  });
  $('.popup-div').mouseover(function () {
    // console.log('>>>>>>        '+$(this).attr('id'));
    $(this).stop().fadeIn();
    return false;
  });
  $('.popup-div').mouseout(function () {
    // console.log('       >>>>>>'+$(this).attr('id'));
    $(this).stop().fadeOut(3000);
    return false;
  });
  $(window).resize(function () {
    s.refresh();
  });
  var h = $(document).height();
  var w = $(document).width();
  // console.log(h);
  // console.log(w);
  // console.log($('#tipfade').html());
  if (w < h) {
    $('#tipfade').css({ 'height': '150' });
    $('#tipfade').html('<div style="text-align: center;position: relative;top:10%; font-size: 24px; color: #f4f0e4;">Warning: You may view on <span style="border: solid 1px;color: #f4f0e4;">mobile</span> device, some contents may be not optimized appropriately.</div>');
    mobile_dev = true;
    $("#search-box").attr("disabled", "disabled");
    $("#search-text").attr("title", "Search box is disabled temporarily on mobile device.");
    $("<br>").insertBefore("#uselent");
    $("#button-pane").css({ 'right': '10px' });
  }
  else if (w < 1280 || h < 600) {
    $('#tipfade').html('<div style="text-align: center;position: relative;top:10%; font-size: 24px; color: #f4f0e4;">Warning: Screen resolusion may be too <span style="border: solid 1px;color: #f4f0e4;">low</span> to render contents.</div>');
  }
  if ((w == 1360 || w == 1366 || w == 1440 || w == 1536 || w == 1600 || w == 1680) &&
    (h == 768 || h == 800 || h == 864 || h == 900 || h == 1024 || h == 1050)) {
    $('#tipfade').hide();
  }
  else {
    $('#tipfade').hide().fadeIn(2000).delay(3000).fadeOut(3000);
  }
});

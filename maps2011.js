// we need the ons2011 map data.
// we could include this with an amd module or something in the future
if (!ons2011) {
	//if (console && console.error) { console.error("Could not find ons2011 map data"); }
	var ons2011 = {};
}

ons2011.fusionkey = 'AIzaSyB8WOj6_y_qqbIfFJqx8s6RLjzK8yVF7Bc';
ons2011.layersId = "1_aBzanFdcsmGmDOo4xOTCXFpRwB1xlr2XnknqCc";
ons2011.neighbourhoodsId = "1VD9W0XH5VxaVk1eV_WwM1NCQZaLXVXyzeAe7w5U";
/*
 * our default styles for polygons and lines (paths)
 */
ons2011.defaultStyles = { 
		polygonOptions2011 : {
			fillColor : "#319869",
			fillOpacity :  0.5,
			strokeColor : "#326D96",
			highlightFillcolor: "#886D96",
			strokeOpacity: 1,
			strokeWeight: 1
		},
		
		lineOptions2011: {
			strokeColor : "#886D96",
			strokeWeight: 5
		}
};

/*
 * default options for our map
 */
ons2011.goptions= {
	center: new google.maps.LatLng(45.25, -75.80),
	zoom: 9,
	mapTypeId: google.maps.MapTypeId.ROADMAP
}


//Name:	Age of Cons2011truction.csv
//Numeric ID:	2730132

ons2011.cache = {};

//base map
ons2011.mapid = 2721445; //theirs
//ons2011.mapid = 2641354; //mine

/**
 * Shows all the defined markers for a given object.  
 * @see ons2011.markers
 */
ons2011.showMarkers = function (obj, map, inputId) {

	var queryText = "SELECT name, geometry FROM " + obj.mapid;
	queryText = encodeURIComponent(queryText);

	if (dojo.byId(inputId).checked) {
		if (obj.markers != null) {
			dojo.forEach(obj.markers, function(marker) {
				marker.setMap(map);
			});
			return;
		}
		
		if (obj.markers != null) {
			dojo.forEach(obj.markers, function(marker) {
				marker.setMap(map);
			});
			return;
		}
		
		//else just set up a new markers
		obj.markers = [];
	} else {
		if (obj.markers) {
			dojo.forEach(obj.markers, function(marker) {
				marker.setMap(null);
			});
			return;
		}
	}

	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
	var def = new dojo.Deferred();
	
	query.send(function(response) {
		if (!response || !response.getDataTable()) { 
			if (console && console.error) { console.error(response, queryText); }
			return;
		}
		var numRows = response.getDataTable().getNumberOfRows();

		//create the list of lat/long coordinates
		var coordinates = [];
		for (var i=0;i<numRows;i++) {
			var name = response.getDataTable().getValue(i, 0);
			var geometry = response.getDataTable().getValue(i, 1);
			value = ons2011.parseKml(map,geometry);
			
			try {
				if (value.marker) {
					value.marker.setOptions({
						animation: google.maps.Animation.DROP,
						icon: "/wp-content/uploads/2012/01/" + obj.icon,
						title: name,
						map: map
					});
					
					obj.markers.push(value.marker);
					google.maps.event.addListener(value.marker, 'click', function() { return false; });
				} 
				
				if (value.polylines) {
					dojo.forEach(value.polylines, function(p) {
						p.setOptions({
							title: name,
							map: map,
							strokeWeight: ons2011.defaultStyles.lineOptions2011.strokeWeight,
							strokeColor: ons2011.defaultStyles.lineOptions2011.strokeColor
						});
						obj.markers.push(p);
					});
				}

			} catch (e) {
				console.error(e);
			}
		}
	});
}

/**
 * Finds a locally cached neighbourhood by either name or id
 * @return a Deferred object that will contain null or the neighbourhood
 */
ons2011.findNeighbourhood = function(id, name) {
	var ret = ons2011.getAllNeighbourhoods();
	
	ret.addCallback(function(arr) {
		var r = null;
		
		dojo.forEach(arr, function(n) {
			if (id && n.ID == id) {
				r = n;
			} else if (name && n["name"] == name) {
				r = n;
			}
		});
		return r;
	});
	
	return ret;
}


/**
 * queries our fusiontable for the coordinates of the id (or ids) and centers the map around it
 * @param the map
 * @param the id of the neighbourhood to center on
 */
ons2011.fitMap = function(map, id) {
	
	//zoom and reset all of the neighbourhoods fill color
	ons2011.getAllNeighbourhoods().then(function(arr) {
		var bounds = new google.maps.LatLngBounds();
		
		dojo.forEach(arr, function(n) {
			var color = ons2011.defaultStyles.polygonOptions2011.fillColor;
			
			if (parseInt(n.id) === parseInt(id)) {
				color = ons2011.defaultStyles.polygonOptions2011.highlightFillcolor;
				//fit to bounds
				if (n.geometry && n.geometry.bounds) {
					bounds.union(n.geometry.bounds);
				}
			} else if (!id || id == "null") {
				if (n.geometry && n.geometry.bounds) {
					bounds.union(n.geometry.bounds);
				}
			}
			
			if (n.polygons) {
				dojo.forEach(n.polygons, function(p) {
					p.setOptions({fillColor: color});
				});
			}
		});
		
		map.fitBounds(bounds);
		
	});
} 

/**
 * this uses http://geoxml3.googlecode.com/svn/branches/polys/geoxml3.js
 * to parse the kml
 */
ons2011.createGeometry = function(map, geo) {

	var ret = {};
	if (dojo.isObject(geo)) {
		var bounds = new google.maps.LatLngBounds();
		var ltlLngs = [];
			
		if (geo.type == "GeometryCollection") {
			for (var i = 0; i < geo.geometries.length; i++) {
				var lls = [];
				for (var j = 0; j < geo.geometries[i].coordinates[0].length; j++) {
				  var vals = geo.geometries[i].coordinates[0][j];
				  var ll = new google.maps.LatLng(vals[1], vals[0]);
				  lls.push(ll);
				  bounds.extend(ll);
				}
				
				ltlLngs.push(lls);
			}
		}
		else if (geo.geometry && geo.geometry.type == "Polygon") {
			for (var i = 0; i < geo.geometry.coordinates[0].length; i++) {
			  var vals = geo.geometry.coordinates[0][i];
			  var ll = new google.maps.LatLng(vals[1], vals[0]);
			  ltlLngs.push(ll);
			  bounds.extend(ll);
				
			}
		}
			
		ret.position = bounds.getCenter();
		ret.bounds = bounds;
		ret.latLngs = ltlLngs;
		ret.type = geo.type;
	} else {
	
		//try parsing it
		var geoXml = new geoXML3.parser({
                    map: map,
					zoom: false,
					createMarker: function() {}
                    //infoWindow: infoWindow,
                    //singleInfoWindow: true
                });
                
		geoXml.parseKmlString("<Placemark>"+geo+"</Placemark>");
		if (geoXml.docs[0].placemarks[0].Polygon) {
		   geoXml.docs[0].gpolygons[0].setMap(null);
		   ret.position = geoXml.docs[0].gpolygons[0].bounds.getCenter();
		   ret.bounds = geoXml.docs[0].gpolygons[0].bounds;
		   ret.latLngs = geoXml.docs[0].gpolygons[0].latLngs[0];
		} else if (geoXml.docs[0].placemarks[0].LineString) {
		   geoXml.docs[0].gpolylines[0].setMap(null);
		   ret.position = geoXml.docs[0].gpolylines[0].bounds.getCenter();
		   ret.bounds = geoXml.docs[0].gpolylines[0].bounds;
		   ret.latLngs = geoXml.docs[0].gpolylines[0].latLngs[0];
		   ret.polylines = geoXml.docs[0].gpolylines;
		} else if (geoXml.docs[0].placemarks[0].Point) {
			ret.marker = new google.maps.Marker({position: geoXml.docs[0].placemarks[0].latlng});//geoXml.docs[0].placemarks[0].marker;
		}
	}
	
	return ret;
}

/*
 *loads and caches the neighbourhood and category data
 */
ons2011.loadData = function () {
	
	var defLayers = new dojo.Deferred();
	var defNeighbourhood = new dojo.Deferred();
	
	gapi.client.load('fusiontables', 'v1', function(){
	  var retData = {};
	  
	  //Load our layer/categories table
	  var request = gapi.client.fusiontables.query.sqlGet({'sql': "Select Category,Layer,'Polygon Attributes','Attribute Description','Data Table ID','Points of Interest Table ID','Polygon Layer','Point Layer','Choropleth','Proportional Circle' from " + ons2011.layersId});
      request.execute(function(data){
      
      	ons2011.cache["layers"] = data;
      		
      	//set up the category data so we can use it easier
      	var cats = {};
      	dojo.forEach(data.rows, function(row, index) {
      		if (!cats[row[0]]) {
      			cats[row[0]] = {};
      		}      		
      		
      		if (!cats[row[0]][row[1]]) {
      			cats[row[0]][row[1]] = {};
      		}      	
      		
      		if (!cats[row[0]][row[1]][row[3]]) {
      			//create an object
      			var layer = {};
      			dojo.forEach(data.columns, function(column, index) {
      				layer[column] = row[index];
      			})
      			cats[row[0]][row[1]][row[3]] = layer;
      		}      		
      	});
      	
      	ons2011.cache["categories"] = cats;
      	
      	defLayers.resolve();
      });
      
      //load our neighbourhoods and their geometry
      var request = gapi.client.fusiontables.query.sqlGet({'sql': "Select id,name,geometry,\"pageid_en\",\"pageid_fr\" from " + ons2011.neighbourhoodsId});
      request.execute(function(data){
      		ons2011.cache["neighbourhoods"] = [];
      		
      		var numRows = data.rows.length;
			var numCols = data.columns.length;
			var startCol = 0;
			for(row = 0; row < numRows; row++) {
				var retObj = {};
				for(col = 0; col < numCols; col++) {
					var value = data.rows[row][col];
					var key =  data.columns[col];
					if (key == "geometry") {
						console.log(data.rows[row][0], data.rows[row][1], value);
						value = ons2011.createGeometry(ons2011._currentMap,value);
					}
					
					retObj[key] = value;
				}
				ons2011.cache["neighbourhoods"].push(retObj);
			} 
			
      		
			defNeighbourhood.resolve(ons2011.cache["neighbourhoods"]);
      });
    });
    
    return new dojo.DeferredList([defLayers, defNeighbourhood]);
	
}

/**
 * queries our fusiontable for all of the neighbourhoods, and all of the data associated with it
 * @return a dojo.Deferred that will be called with a data object containing all the data
 */
ons2011.getAllNeighbourhoods = function() {

	var def = new dojo.Deferred();
	
	if (ons2011.cache["neighbourhoods"]) {
		def.callback(ons2011.cache["neighbourhoods"]);
		return def;
	}
	
	var def = new dojo.Deferred();
	
	ons2011.loadData().then(function(retArr) {
		def.callback(ons2011.cache["neighbourhoods"]);
	});
	
	return def;
} 

/**
 * Makes a polygon for the given coordinates and the map
  * @param arrCoords, an array of google.maps.LatLng objects
  * @param ons2011map, a google map object
 */
ons2011.makePoly = function(arrCoords, ons2011map, neigh) {
	
	var poly = new google.maps.Polygon({
		path: arrCoords,
		fillColor: ons2011.defaultStyles.polygonOptions2011.fillColor,
		fillOpacity: ons2011.defaultStyles.polygonOptions2011.fillOpacity,
		strokeColor: ons2011.defaultStyles.polygonOptions2011.strokeColor,
		strokeOpacity: ons2011.defaultStyles.polygonOptions2011.strokeOpacity,
		strokeWeight: ons2011.defaultStyles.polygonOptions2011.strokeWeight
	  });
	  
	google.maps.Polygon.prototype.getBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		for (i = 0; i < this.getPath().getArray().length; i++) {
			bounds.extend(this.getPath().getArray()[i]);
		}
		return bounds
	}
	
	var n = dojo.byId("ons2011Tooltip");

	if (!n) {
		n = dojo.create("div", { id: "ons2011Tooltip", className:"tooltip" }, dojo.body());
	} 
		
	if (!ons2011.docc) {
		ons2011.docc = dojo.connect(dojo.doc, "onmousemove", function(event) { 
			var t = dojo.isIe ? event.clientY + dojo.doc.scrollTop : event.pageY;
			var l = dojo.isIe ? event.clientX + dojo.doc.scrollLeft : event.pageX;
			ons2011.docc._w = {t:t-40, l:l+20};
		});
	}
		
	google.maps.event.addListener(poly, 'mouseover', function() {  
		this.origOpac = this.fillOpacity;
		dojo.forEach(neigh.polygons, function(poly) {
			poly.origOpac = poly.fillOpacity;
			poly.setOptions({fillOpacity: poly.fillOpacity+.2}); 
		});
		
		clearTimeout(ons2011.timeout2);
		clearTimeout(ons2011.timeout3);
		var poly = this;
		
		ons2011.timeout1 = setTimeout(function() {
			dojo.style(n, { display: "block" });
			dojo.style(n, {top:ons2011.docc._w.t+"px", left:ons2011.docc._w.l+"px"});
			if (poly._filter) {
				n.innerHTML = "<div class='ttname'>"+ poly._filter.name + "</div><div><span>" + poly._filter.filter + ": </span><span class='ttlabel'>" + poly._filter.value +"</span></div>";
			} else {			
				n.innerHTML = neigh['name'];
			}
			
			ons2011.timeout3 = setTimeout(function() {
				dojo.style(n, { display: "none" });
			},2000);
		},200);
	});
	
	google.maps.event.addListener(poly, 'mouseout', function() { 
		dojo.forEach(neigh.polygons, function(poly) {
			poly.setOptions({fillOpacity: poly.origOpac}); 
		});
		clearTimeout(ons2011.timeout1);
		clearTimeout(ons2011.timeout3);	
		ons2011.timeout2 = setTimeout(function() {
			dojo.style(n, { display: "none" });
		},200);
	});
	
	google.maps.event.addListener(poly, 'mousedown', function() { 
		if (neigh["ID"]) {
			//go to the neighbourhood page when the user clicks on a neighbourhood.
			// this is obviously hacky and should change some day.
			require(["dojo/_base/url","dojo/ready"], function(url, ready){
				ready(function(){
					var query = (new url(window.location)).query;
					if (query) {
						var q = dojo.queryToObject(query || {}); 
						id = q.page_id ? q.page_id: id;
						if (id != 129) { 
							window.location = "/?page_id=" + neigh["ID"];
						}
					} else {
						//main page.. go as well
						window.location = "/?page_id=" + neigh["ID"];
					}
				});
			});
		}
	});
	
	poly.setMap(ons2011map);
	poly._ons2011map = ons2011map;
		
	return poly;
}

/** 
 *  Displays a map  
 * @param mapnodeid the id of the dom node in which to draw the map
 * @param id (optional), if supplied, only show the polygons for the provided id or ids (an array is accepted). If
 *          null, don't show any polygons
 */
ons2011.showMap = function(mapnodeid, id) {

	var gmap = new google.maps.Map(document.getElementById(mapnodeid), ons2011.goptions);
	
	//store these globally
	ons2011._currentMap = gmap;
	
	google.maps.event.addListener(gmap, 'zoom_changed', function() {
		//relay out any highlights/filtering
		ons2011.attributeSelected();
	});
		
	//make polys
	ons2011.getAllNeighbourhoods().then(function(arr) {
	
		//var layer = new google.maps.FusionTablesLayer({ query: query });
		//ons2011._ons2011Layer = layer;
		
		//create a poly for each neighbourhood
		dojo.forEach(arr, function(neigh, index) {
			var geometry = neigh['geometry'];
			if (!geometry || !geometry.latLngs) {
				return;
			}
			
			//we have to do this because there's a bug in google maps (maybe) where it won't draw this correctly
			var bs = geometry.latLngs.b ? geometry.latLngs.b.concat() : geometry.latLngs.concat();
			neigh.polygons = [];
			
			//Geometry Collections are arrays
			if (dojo.isArray(bs[0])) {
				dojo.forEach(bs, function(ll) {
					neigh.polygons.push(ons2011.makePoly(ll, gmap, neigh));
				});
			} else {
				neigh.polygons.push(ons2011.makePoly(bs, gmap, neigh));
			}
			
		});
		
		ons2011.fitMap(gmap, id);
	});
}


/**
 * Returns a deferred containing the data for a specific filler
 */
ons2011.getFilterData = function(data) {
	var def = new dojo.Deferred();
	
	var tableid = data["Data Table ID"];
	var attr = data["Polygon Attributes"];
	var request = gapi.client.fusiontables.query.sqlGet({'sql': "Select id,name," + attr +  " from " + tableid});
    request.execute(function(data){
    		
    		if (!data.rows) {
    			if (console && console.error) { console.error(response, queryText); }
    			def.error();
    		}
    		
			var numRows = data.rows.length;

			//create the list of lat/long coordinates
			var coordinates = [];
			var min = 0;
			var max = 0;
			var values = {};
			for(i = 0; i < numRows; i++) {
				var name = data.rows[i][1];
				var value = data.rows[i][2];
				
				try {
					value = parseFloat(parseFloat(value).toFixed(2));
				} catch (e) {}
				
				if (value > max) {
					max = value;
				}
				values[name] = value;
			};
			var diff = max - min;
			var resolution = 5;
			var add = diff/resolution;
			
			def.callback(values);
		});
		
	return def;
}

/**
 * Paints and filters each neighbourhood's polygons based on choropleth data
 */
ons2011.paintChoropleth = function(data, neighbourhoods, valArray) {
	
	var filterLabel = data["Attribute Description"];
	var legend = dojo.byId("map_legend");
	var legend_container = dojo.byId("legendcontainer");
	
	for(var name in neighbourhoods) {
		ons2011.findNeighbourhood(null, name).then(function(n) {
			if (!n) {
				if (console && console.error) { console.error("Couldn't find neighbourhood for name: \"" + name + "\""); }
				return;
			}
			var value = neighbourhoods[name];
			var rank =0;
			var centiles = 10;
			for (i = 0; i < valArray.length; i++) {
				if (value == valArray[i]) {
					rank = i;
					break;
				}
			};

			var h = 120; //green
			var s = 100;
			var centile = parseInt((rank/valArray.length) * centiles);
			// add 3 to the centile to increase the descrimination
			var l = parseInt ((centiles - (centile + 1)) * (centiles+3));	
			var color = dojox.color.fromHsl(h, s, l);
			dojo.forEach(n.polygons, function(poly) {
				poly.setOptions({fillColor: color.toHex(), fillOpacity: .7});
				poly._filter = {name: n['name'], filter: filterLabel, value: value};
			});
			
		});
	}
	
	//set out our legend
	if (legend) {
		var texts = dojo.query('.legend_text');
		for (var i=0;i<5;i++) {
			var val = max*(.25*i);
			if (texts && texts.length-1 >= i) {
				dojo.attr(texts[i], "innerHTML", Math.round(val));
			}
		}
		dojo.style(legend_container, 'display', 'block');
		dojo.addClass(legend, 'green_gradient');
	}
}

/**
 * Paints circles!
 */
ons2011.paintCircles = function(data, neighbourhoods, valArray) {
	
	var filterLabel = data["Attribute Description"];
	var legend = dojo.byId("map_legend");
	var legend_container = dojo.byId("legendcontainer");
	
	for(var name in neighbourhoods) {
		ons2011.findNeighbourhood(null, name).then(function(n) {
			if (!n) {
				if (console && console.error) { console.error("Couldn't find neighbourhood for name: \"" + name + "\""); }
				return;
			}
			
			var value = neighbourhoods[name];
			dojo.forEach(n.polygons, function(poly) {
				var bounds = poly.getBounds();
				
				poly.circle = new google.maps.Circle({
					strokeWeight: 1,
					strokeColor : "#ffffff",
					map : poly.getMap(),
					center : bounds.getCenter(),
					radius : 1000*value/poly.getMap().getZoom()
				});
			});
			
		});
	}
}

/**
 * filters the map by highlighting or drawing circles 
*/
ons2011.filterMap = function(filterArray) {
	var category = dojo.byId('category_select').value;
	var layer = dojo.byId('layer_select').value;
	
	var legend = dojo.byId("map_legend");
	
	if (legend) {
		dojo.removeClass(legend, 'green_gradient');
		dojo.style(legend_container, 'display', 'none');
	}
	
	//reset all of our polygons
	ons2011.getAllNeighbourhoods().then(function(arr) {
		dojo.forEach(arr, function(n) {
			dojo.forEach(n.polygons, function(poly) {
				poly.setOptions({fillColor: ons2011.defaultStyles.polygonOptions2011.fillColor, fillOpacity: ons2011.defaultStyles.polygonOptions2011.fillOpacity});
				poly._filter = null;
				
				if (poly.circle) {
					poly.circle.setMap(null);
					poly.circle = null;
				}
			});
		});
	});
	
	if (filterArray && filterArray.length > 0) {
		
		dojo.forEach(filterArray, function(filter) {
			var data = ons2011.cache["categories"][category][layer][filter];
			ons2011.getFilterData(data).then(function(values) {
				
				var max = 0;
				var pos = 0;
				var valArray = new Array(values.length);
				for (var name in values) {
					var value = values[name];
					if (value > max) { max = value; }
					valArray[pos++] = value;
				}
				valArray.sort(function(a,b){return a - b});
				
				//if choroplet
				if (data["Choropleth"] == "YES") {
				
					ons2011.paintChoropleth(data, values, valArray);
					
				} else if (data["Proportional Circle"] == "YES") {
					ons2011.paintCircles(data, values, valArray);
				}
			});
		});
	}
}

/**
 * A category has been selected from the dropdown
 */
ons2011.categorySelected = function(category) {
	var layerNode = dojo.byId('layer_select');
		
	if (layerNode) {
		dojo.attr(layerNode, 'disabled', false);
		dojo.empty(layerNode);
		dojo.create('option', {innerHTML:"", value: null}, layerNode);
		//create our options
		for (var layer in ons2011.cache["categories"][category]) {
				dojo.create('option', {innerHTML:layer, value: layer}, layerNode);
		};
	}
	
	if (category && category != "null") {
		dojo.query("label", layerNode.parentNode).forEach(function(node){
			dojo.removeClass(node, 'disabled');
		});
	} else {
		dojo.query("label", layerNode.parentNode).forEach(function(node){
			dojo.addClass(node, 'disabled');
		});
		
		dojo.attr(layerNode, 'disabled', true);
	}
}

/**
 * A layer has been selected from the dropdown
 */
ons2011.layerSelected = function(layer) {
	var catNode = dojo.byId('category_select');
	var attrNode = dojo.byId('attribute_select');
	
	if (attrNode) {
		dojo.attr(attrNode, 'disabled', false);
		dojo.empty(attrNode);
		dojo.create('option', {innerHTML:"", value: null}, attrNode);
		//create our options
		for (var layer in ons2011.cache["categories"][catNode.value][layer]) {
				dojo.create('option', {innerHTML:layer, value: layer}, attrNode);
		};
	}
	
	if (layer && layer != "null") {
		dojo.query("label", attrNode.parentNode).forEach(function(node){
			dojo.removeClass(node, 'disabled');
		});
	} else {
		dojo.query("label", attrNode.parentNode).forEach(function(node){
			dojo.addClass(node, 'disabled');
		});
		dojo.attr(attrNode, 'disabled', attrNode);
	}
}

/**
 * A layer has been selected from the dropdown
 */
ons2011.attributeSelected = function(attribute) {
	var category = dojo.byId('category_select').value;
	var layer = dojo.byId('layer_select').value;
	
	var selected = [];
	var selType = null;
	
	dojo.query("#attribute_select :checked").forEach(function(node){
		var filter = node.value;
		
    	var data = ons2011.cache["categories"][category][layer][filter];
    	
		if (selected.length > 2) {
			node.selected = false;
			return;
		}
    	selType = data["Choropleth"] == "YES" ? "Choropleth" : "Proportional Circle";
		selected.push(filter);
       
    });
    
    if (selected.length == 1) {
		
		//find all the other selects options and disable them
		dojo.query("#attribute_select option").forEach(function(node2){
			if (node2.value == "null") {
				return;
			}
			
			var data2 = ons2011.cache["categories"][category][layer][node2.value];
			var curSelType = data2["Choropleth"] == "YES" ? "Choropleth" : "Proportional Circle";
			if (selected[0] != node2.value && selType == curSelType) {
				dojo.attr(node2, 'disabled', node2);
			}
		});
		
	}	
        
	ons2011.filterMap(selected);
}

/* 
 Shows a chart in the provided id, filtered by the 
*/
ons2011.showChart = function(id,filterSelect) {

	var chartDiv = dojo.byId("chart_div");
	var filterDiv = dojo.byId("chart_filter");
	var messageDiv = dojo.byId("chart_message");
	var neighbourhoodsDiv = dojo.byId("chart_neighbourhoods");
	var chartSort = dojo.byId("chart_sort");

	if (!chartDiv) {
		return;
	}
	
	//in case it's an id
	filterSelect = dojo.byId(filterSelect);
	
	if (!filterSelect || filterSelect.selectedIndex == 0) {
		dojo.style(filterDiv, {display: "none"});
		dojo.style(messageDiv, {display: ""});
		dojo.style(neighbourhoodsDiv, {display: "none"});
		dojo.style(chartDiv, {display: "none"});
		return;
	}

	dojo.style(filterDiv, {display: ""});
	dojo.style(messageDiv, {display: "none"});
	dojo.style(neighbourhoodsDiv, {display: ""});
	dojo.style(chartDiv, {display: ""});
	
	var filter = filterSelect.value;
	var axes = ['Neighbourhood Name', filterSelect.options2011[filterSelect.selectedIndex].innerHTML];
	var data = new google.visualization.DataTable();
	
	data.addColumn('string', axes[0]);
	data.addColumn('number', axes[1]);
	
	//find the selected neighbourhoods
	var neighs = [];
	for (var i=1;i<neighbourhoodsDiv.options2011.length;i++) {
		if (neighbourhoodsDiv.options2011[i].selected) {
        	neighs.push(neighbourhoodsDiv.options2011[i].innerHTML);
    	}
	}
	
	var sort = chartSort.selectedIndex > 0 ? chartSort.options2011[chartSort.selectedIndex] : null;
	
	ons2011.getFilterData(filter).then(function(values) {
		
		var options2011 = {
       		title: axes[1],
			hAxis: {title: axes[0], titleTextStyle: {color: 'black', }}
		};
		
		for (var name in values) {
			if (neighs.length > 0) {
				if (dojo.indexOf(neighs, name) > -1) {
					data.addRow([name, values[name]]);
				}
			} else {
				data.addRow([name, values[name]]);
			}
		}
		
		//sort the data
		if (chartSort.selectedIndex > 0){
			if (chartSort.options2011[chartSort.selectedIndex].value == "asc") {
				data.sort({column: 1, desc: false});
			} else if (chartSort.options2011[chartSort.selectedIndex].value == "desc") {
				data.sort({column: 1, desc: true});
			}
		}

		var chart = new google.visualization.ColumnChart(dojo.byId(id));
		chart.draw(data, options2011);
	});
	
}

/* loading methods */
//google.load('visualization', '1', {packages: ['corechart']});

//add a clear markers method
google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i < this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};


/**
 * Populates a select tag with all of the available categories
 */
ons2011.populateCategorySelect = function(catnode) {	
	if (catnode) {
		var created = {};
		dojo.empty(catnode);
		dojo.create('option', {innerHTML:"", value: null}, catnode);
		for (var category in ons2011.cache["categories"]) {
				dojo.create('option', {innerHTML:category, value: category}, catnode);
		};
	};
}

/**
 * Populates a select node with all of the neighbourhoods
 */
ons2011.populateNeighbourhoodSelect = function(node) {
	if (node) {
		var d = ons2011.getAllNeighbourhoods().then(function(neighbourhoods) {
			dojo.empty(node);
			//add an empty one
			dojo.create('option', {innerHTML:"", value: null}, node);
			dojo.forEach(neighbourhoods, function(n) {
				dojo.create('option', {innerHTML:n["name"], value: n.id}, node);
			});
		});
	}
}

/**
 * creates tabs if the tabs id exists
 */
ons2011.createTabs = function() {
	if (!dojo.byId("tabs")) {
		return;
	}
	
   var tc = new dijit.layout.TabContainer({
        style: "height: 100%; width: 100%;"
    }, "tabs");

    var cp1 = new dijit.layout.ContentPane({
         title: "Maps",
         content: ""
    });
    tc.addChild(cp1);

    var cp2 = new dijit.layout.ContentPane({
         title: "Compare",
         content: ""
    });
    tc.addChild(cp2);

	//update the chart
	dojo.connect(tc, "selectChild", function(page){ 
		if (page == cp2) {
			ons2011.showChart('chart_div', 'filter_select');
		}
	});

    tc.startup();
    dojo.style(dojo.byId("mapTab"), { display: ""});
    dojo.style(dojo.byId("chartTab"), { display: ""});
    dojo.place(dojo.byId("mapTab"), cp1.domNode);
    dojo.place(dojo.byId("chartTab"), cp2.domNode);
}

onGoogleLoad = function() {
	gapi.client.setApiKey('AIzaSyB8WOj6_y_qqbIfFJqx8s6RLjzK8yVF7Bc');

}

ons2011._ready = false;

require(["dojo/_base/url", "dojo/dom", "dojo/ready", "dojox/color", "dojo/DeferredList", "dijit/Dialog", "dijit/layout/TabContainer", "dijit/layout/ContentPane"], function(url, dom, ready, color, deferredlist, Dialog, TextBox, Button){
         ready(function(){
         	
         	//TODO - show a loading dialog thing
			$j = $;
			
			//set up our collapsible headers (faq page)
			//$j.collapsible('.collapsible .header')

			//first thing we do is load all our neighbourhoods so we can cache them
			var d = ons2011.getAllNeighbourhoods().then(function(neighbourhoods) {
				
				//if we have a 'map_canvas', show a map in it
				if (dojo.byId('map_canvas')) {
					var id = undefined;
					var u = new url(window.location);
					if (u.query) {
						var q = dojo.queryToObject(u.query || {}); 
						id = q.page_id ? q.page_id: id;
						if (id == 129) { id = undefined; } //the maps page
					}
					ons2011.showMap('map_canvas', id);
				}

				var catnode = dojo.byId('category_select');
				ons2011.populateCategorySelect(catnode);

				//if we have a 'neighbourhood_select', populate it with neighbourhoods
				if (dojo.byId('neighbourhood_select')) {
					var node = dojo.byId('neighbourhood_select');
					ons2011.populateNeighbourhoodSelect(node);
				}


				var neighbourhoodsDiv = dojo.byId("chart_neighbourhoods");
				if (neighbourhoodsDiv) {
					ons2011.populateNeighbourhoodSelect(neighbourhoodsDiv);
				}
				
				ons2011.createTabs();
			});
		});
});

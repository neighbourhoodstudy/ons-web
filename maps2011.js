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
 * @return a deferred that will be fired when the map has been loaded and will return all of the lat/long
 */
ons2011.fitMap = function(map, id) {
	
	
	var def = new dojo.Deferred();
	/*var queryText = "SELECT geometry FROM " + ons2011.mapid;
	if (id) { queryText += " WHERE ID = " + id; }
	queryText = encodeURIComponent(queryText);

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
		for(i = 0; i < numRows; i++) {
			var geometry = response.getDataTable().getValue(i, 0);
			value = ons2011.parseKml(ons2011._currentMap,geometry);
			dojo.forEach(value.latLngs.getArray(), function(l) {
				try {
					coordinates = coordinates.concat(l.getArray());
				} catch (e) {}
			});
		}  

		var bounds = new google.maps.LatLngBounds();
		if (coordinates.length == 0) {
			return;
		}

		for (var i = 0; i < coordinates.length; i++) {
			bounds.extend(coordinates[i]);
		}
		map.fitBounds(bounds);
	});*/
	
	//reset all of the neighbourhoods fill color
	ons2011.getAllNeighbourhoods().then(function(arr) {
	
		dojo.forEach(arr, function(n) {
			var color = ons2011.defaultStyles.polygonOptions2011.fillColor;
			
			if (parseInt(n.ID) === parseInt(id)) {
				color = ons2011.defaultStyles.polygonOptions2011.highlightFillcolor;
			}
			
			if (n.polygons) {
				dojo.forEach(n.polygons, function(p) {
					p.setOptions({fillColor: color});
				});
			}
		});
		
	});
	
		
	return def;
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

//loads and caches data
ons2011.loadData = function () {
	
	var defLayers = new dojo.Deferred();
	var defNeighbourhood = new dojo.Deferred();
	
	gapi.client.load('fusiontables', 'v1', function(){
	  var retData = {};
	  
	  var request = gapi.client.fusiontables.query.sqlGet({'sql': "Select * from " + ons2011.layersId});
      request.execute(function(DATA){
      	retData["layers"] = DATA;
      	//set up data
      	defLayers.resolve();
      });
      
      var request = gapi.client.fusiontables.query.sqlGet({'sql': "Select id,name,geometry,\"pageid_en\",\"pageid_fr\" from " + ons2011.neighbourhoodsId});
      request.execute(function(data){
      		retData["neighbourhoods"] = data;
			defNeighbourhood.resolve(retData);
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
	
	ons2011.cache["neighbourhoods"] = [];

	var def = new dojo.Deferred();
	
	ons2011.loadData().then(function(retArr) {
		var response = retArr[1][1]["neighbourhoods"];
	
		var numRows = response.rows.length;
		var numCols = response.columns.length;
		var startCol = 0;
		for(row = 0; row < numRows; row++) {
			var retObj = {};
			for(col = 0; col < numCols; col++) {
				var value = response.rows[row][col];
				var key =  response.columns[col];
				if (key == "geometry") {
					console.log(response.rows[row][0], response.rows[row][1], value);
					value = ons2011.createGeometry(ons2011._currentMap,value);
				}
				retObj[key] = value;
			}
			ons2011.cache["neighbourhoods"].push(retObj);
		} 
		
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
	
	var query = {
		select: 'geometry',
		from: ons2011.neighbourhoodsId
		//where: "'Neighbourhood Name' = 'Greenbelt'"
	};
	
	if (typeof id == 'undefined') {
		//all
		/*dojo.forEach(ons2011.maps, function(map) {
			var arrCoords = [];
			dojo.forEach(map.poly, function(poly) {
				var ll = new google.maps.LatLng(poly[1],poly[0]);
				arrCoords.push(ll);
			});
			makePoly(arrCoords, map);
		});*/
		
	}

	//make polys
	ons2011.getAllNeighbourhoods().then(function(arr) {
	
		//var layer = new google.maps.FusionTablesLayer({ query: query });
		//ons2011._ons2011Layer = layer;
		//layer.setMap(gmap);
		
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
	
	
	//return {map: gmap, layers: [layer]};
}


/*
* get the file id from the column table
* @param - column
*/

ons2011.getFileId = function(column) {
	if (column == null) {
		return ons2011.mapid;
	}
	var fileId = ons2011.mapid;
	dojo.forEach(ons2011.columns, function(col) {
		if (col.column == column) {
			fileId = col.table ? col.table : ons2011.mapid;
		}
	});
	return fileId;
}


/**
 * Returns a deferred containing the data for a specific filler
 */
ons2011.getFilterData = function(filter) {
	var def = new dojo.Deferred();
	var queryText = "SELECT '" + filter + "', 'Neighbourhood Name' FROM " + ons2011.getFileId(filter);
	
	queryText = encodeURIComponent(queryText);

	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);

	query.send(function(response) {
			if (!response || !response.getDataTable()) { 
				if (console && console.error) { console.error(response, queryText); }
				return;
			}
			
			var numRows = response.getDataTable().getNumberOfRows();

			//create the list of lat/long coordinates
			var coordinates = [];
			var min = 0;
			var max = 0;
			var values = {};
			for(i = 0; i < numRows; i++) {
				var name = response.getDataTable().getValue(i, 1);
				var value = response.getDataTable().getValue(i, 0);
				
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
 * filters the map by highlighting 
*/
ons2011.filterMap = function(layer, filter) {

	var legend = dojo.byId("map_legend");
	var legend_container = dojo.byId("legendcontainer");
	
	if (filter && filter.length > 0) {
	
		var filterLabel = filter;
		dojo.forEach(ons2011.columns, function(n) {
			if (n.column == filter) {
				filterLabel = n.label;
			}
		});
	
		ons2011.getFilterData(filter).then(function(values) {
			var max = 0;
			var pos = 0;
			var valArray = new Array(values.length);
			for (var name in values) {
				var value = values[name];
				if (value > max) { max = value; }
				valArray[pos++] = value;
			}
			valArray.sort(function(a,b){return a - b});
			
			for(var name in values) {
				ons2011.findNeighbourhood(null, name).then(function(n) {
					if (!n) {
						if (console && console.error) { console.error("Couldn't find neighbourhood for name: \"" + name + "\""); }
						return;
					}
					var value = values[name];
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
							
						poly._filter = {name: n['Neighbourhood Name'], filter: filterLabel, value: value};
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
		});
	} else {
	
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
				});
			});
		});
	}
}

/*
 * Update a filter <select> tag based on the selected category 'category'
 * @param nodeid the id of the select to update
 * @param labelid the id of a label to remove the 'disabled' css class from
 * @param category the new category
 */
ons2011.updateFilter = function(nodeid, labelid, category) {
	var node = dojo.byId(nodeid);
	var label = dojo.byId(labelid);
	
	if (node) {
		dojo.attr(node, 'disabled', false);
		dojo.empty(node);
		dojo.create('option', {innerHTML:"", value: null}, node);
		dojo.forEach(ons2011.columns, function(n) {
			if (n.category && n.category == category) {
					dojo.create('option', {innerHTML:n.label, value: n.column}, node);
			}
		});
	}
	
	if (category) {
		if (label) dojo.removeClass(label, 'disabled');
		ons2011.filterMap(ons2011._ons2011Layer, null);
	} else {
		dojo.attr(node, 'disabled', true);
		if (label) dojo.addClass(label, 'disabled');
		ons2011.filterMap(ons2011._ons2011Layer, null);
	}
}

/*
ons2011.showChartDialog = function() {
	var catnode = dojo.byId('chart_category_select');
	ons2011.populateCategorySelect(catnode);

	var myDialog = new dijit.Dialog({
        	title: "Compare Data",
            	style: "width: 60%; height: 600px; background: white;"
       	});

	dojo.place(dojo.byId("chartDialog"), myDialog.domNode);
	dojo.style(dojo.byId("chartDialog"), {display: ""});
	myDialog.show();
	if (dojo.byId('chart_div')) {
		ons2011.showChart('chart_div');
	} 
}
*/

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
	
	var d = ons2011.getAllNeighbourhoods().then(function(neighbourhoods) {
		
		dojo.forEach(neighbourhoods, function(n) {
		//	data.addRow( [n[axes[0]], n[axes[1]] ] );
		});
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
		dojo.forEach(ons2011.columns, function(n) {
			if (n.category && ! created[n.category]) {
				dojo.create('option', {innerHTML:n.category, value: n.category}, catnode);
				created[n.category] = true;
			}
		});
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
				dojo.create('option', {innerHTML:n["Neighbourhood Name"], value: n.ID}, node);
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

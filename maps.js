// we need the ons map data.
// we could include this with an amd module or something in the future
if (!ons) {
	//if (console && console.error) { console.error("Could not find ons map data"); }
	var ons = {};
}

/*
 * default options for our map
 */
ons.goptions= {
	center: new google.maps.LatLng(45.25, -75.80),
	zoom: 9,
	mapTypeId: google.maps.MapTypeId.ROADMAP
}

/*
 * our default styles for polygons and lines (paths)
 */
ons.defaultStyles = { 
		polygonOptions : {
			fillColor : "#319869",
			fillOpacity :  0.5,
			strokeColor : "#326D96",
			highlightFillcolor: "#886D96",
			strokeOpacity: 1,
			strokeWeight: 1
		},
		
		lineOptions: {
			strokeColor : "#886D96",
			strokeWeight: 5
		}
};


//Name:	Age of Construction.csv
//Numeric ID:	2730132

ons.cache = {};

//base map
ons.mapid = 2721445; //theirs
//ons.mapid = 2641354; //mine

/**
 * Shows all the defined markers for a given object.  
 * @see ons.markers
 */
ons.showMarkers = function (obj, map, inputId) {

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
			value = ons.parseKml(map,geometry);
			
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
							strokeWeight: ons.defaultStyles.lineOptions.strokeWeight,
							strokeColor: ons.defaultStyles.lineOptions.strokeColor
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
ons.findNeighbourhood = function(id, name) {
	var ret = ons.getAllNeighbourhoods();
	
	ret.addCallback(function(arr) {
		var r = null;
		
		dojo.forEach(arr, function(n) {
			if (id && n.ID == id) {
				r = n;
			} else if (name && n["Neighbourhood Name"] == name) {
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
ons.fitMap = function(map, id) {
	
	var queryText = "SELECT geometry FROM " + ons.mapid;
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
			value = ons.parseKml(ons._currentMap,geometry);
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
	});
	
	//reset all of the neighbourhoods fill color
	ons.getAllNeighbourhoods().then(function(arr) {
	
		dojo.forEach(arr, function(n) {
			var color = ons.defaultStyles.polygonOptions.fillColor;
			
			if (parseInt(n.ID) === parseInt(id)) {
				color = ons.defaultStyles.polygonOptions.highlightFillcolor;
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
ons.parseKml = function(map, kml) {

    // create a geoXml3 parser for the click handlers
	var infoWindow = new google.maps.InfoWindow(); 

    var geoXml = new geoXML3.parser({
                    map: map,
					zoom: false,
					createMarker: function() {}
                    //infoWindow: infoWindow,
                    //singleInfoWindow: true
                });

	geoXml.parseKmlString("<Placemark>"+kml+"</Placemark>");
    var ret = {};
	if (geoXml.docs[0].placemarks[0].Polygon) {
       geoXml.docs[0].gpolygons[0].setMap(null);
       ret.position = geoXml.docs[0].gpolygons[0].bounds.getCenter();
       ret.bounds = geoXml.docs[0].gpolygons[0].bounds;
	   ret.latLngs = geoXml.docs[0].gpolygons[0].latLngs;
    } else if (geoXml.docs[0].placemarks[0].LineString) {
       geoXml.docs[0].gpolylines[0].setMap(null);
       ret.position = geoXml.docs[0].gpolylines[0].bounds.getCenter();
       ret.bounds = geoXml.docs[0].gpolylines[0].bounds;
	   ret.latLngs = geoXml.docs[0].gpolylines[0].latLngs;
	   ret.polylines = geoXml.docs[0].gpolylines;
    } else if (geoXml.docs[0].placemarks[0].Point) {
		ret.marker = new google.maps.Marker({position: geoXml.docs[0].placemarks[0].latlng});//geoXml.docs[0].placemarks[0].marker;
	}

    return ret;
}

/*
* array of callbacks used by the deferred list to marshall the returning queries
*/

ons.callbackObjects = new Array();

/*
* create the queries for all the tables used to populate the cache
*/

ons.createQueries = function() {
	var cols = [];
	dojo.forEach(ons.columns, function(col) {
		var tableId  = (col.table ? col.table : ons.mapid) + "";
		if (cols[tableId] == null) {
			cols[tableId] = new Array();
		}
		cols[tableId].push(col.column ? col.column : col.label);
	});
	
	var queries = [];
	for (var id in cols) {
	
		if (id != (ons.mapid + "")) {
			continue;
		}

	
		var queryTextu = "SELECT " 
			+ "'" + cols[id].join("','") + "'" 
			+ " FROM " + id + " ORDER BY 'Neighbourhood Name'";

		queryText = encodeURIComponent(queryTextu);
		queries.push( new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText));
		var def = new dojo.Deferred();
		ons.callbackObjects.length = ons.callbackObjects.length + 1;	
		ons.callbackObjects[ons.callbackObjects.length-1] = def;
	}
	return queries;
}



/**
 * queries our fusiontable for all of the neighbourhoods, and all of the data associated with it
 * @return a dojo.Deferred that will be called with a data object containing all the data
 */
ons.getAllNeighbourhoods = function() {

	var def = new dojo.Deferred();
	
	if (ons.cache["neighbourhoods"]) {
		def.callback(ons.cache["neighbourhoods"]);
		return def;
	}
	
	var arr = [];
	ons.cache["neighbourhoods"] = arr;
	var queries = ons.createQueries();
	
	var dlistObj = new dojo.DeferredList([ons.callbackObjects[0]]);
	dojo.forEach (queries, function(query) {

		query.send(function(response) {
			var def = ons.callbackObjects.pop();
			def.callback(response);
		});
	});
	
	dlistObj.then(function(retVal) {
		
		for(resps = 0; resps < retVal.length; resps++) {
			var response = retVal[resps][1];

			if (!response || !response.getDataTable()) { 
				if (console && console.error) { console.error(response, "", ""); }
				continue;
			}
	
			var numRows = response.getDataTable().getNumberOfRows();
			var numCols = response.getDataTable().getNumberOfColumns();
			var startCol = 0;
			dojo.forEach (ons.dataTables, function(dataTable) {
				if (numCols == dataTable.noColumns) {
					startCol = dataTable.startColumn;
				}
			});
			
			for(i = 0; i < numRows; i++) {
				var retObj = {};
				for(j = 0; j < numCols; j++) {
					var value = response.getDataTable().getValue(i, j);
					var pos = j + startCol;
					var key = ons.columns[pos].column ? ons.columns[pos].column : ons.columns[pos].label;
					if (key == "geometry") {
						value = ons.parseKml(ons._currentMap,value);
					}
					retObj[key] = value;
				}
				ons.cache["neighbourhoods"].push(retObj);
			} 
		}
		def.callback(ons.cache["neighbourhoods"]);
	});


	
	return def;
} 
/**
 * Makes a polygon for the given coordinates and the map
  * @param arrCoords, an array of google.maps.LatLng objects
  * @param onsmap, a google map object
 */
ons.makePoly = function(arrCoords, onsmap, neigh) {
	
	var poly = new google.maps.Polygon({
		path: arrCoords,
		fillColor: ons.defaultStyles.polygonOptions.fillColor,
		fillOpacity: ons.defaultStyles.polygonOptions.fillOpacity,
		strokeColor: ons.defaultStyles.polygonOptions.strokeColor,
		strokeOpacity: ons.defaultStyles.polygonOptions.strokeOpacity,
		strokeWeight: ons.defaultStyles.polygonOptions.strokeWeight
	  });
	
	var n = dojo.byId("onsTooltip");

	if (!n) {
		n = dojo.create("div", { id: "onsTooltip", className:"tooltip" }, dojo.body());
	} 
		
	if (!ons.docc) {
		ons.docc = dojo.connect(dojo.doc, "onmousemove", function(event) { 
			var t = dojo.isIe ? event.clientY + dojo.doc.scrollTop : event.pageY;
			var l = dojo.isIe ? event.clientX + dojo.doc.scrollLeft : event.pageX;
			ons.docc._w = {t:t-40, l:l+20};
		});
	}
		
	google.maps.event.addListener(poly, 'mouseover', function() {  
		this.origOpac = this.fillOpacity;
		dojo.forEach(neigh.polygons, function(poly) {
			poly.origOpac = poly.fillOpacity;
			poly.setOptions({fillOpacity: poly.fillOpacity+.2}); 
		});
		
		clearTimeout(ons.timeout2);
		clearTimeout(ons.timeout3);
		var poly = this;
		
		ons.timeout1 = setTimeout(function() {
			dojo.style(n, { display: "block" });
			dojo.style(n, {top:ons.docc._w.t+"px", left:ons.docc._w.l+"px"});
			if (poly._filter) {
				n.innerHTML = "<div class='ttname'>"+ poly._filter.name + "</div><div><span>" + poly._filter.filter + ": </span><span class='ttlabel'>" + poly._filter.value +"</span></div>";
			} else {			
				n.innerHTML = neigh['Neighbourhood Name'];
			}
			
			ons.timeout3 = setTimeout(function() {
				dojo.style(n, { display: "none" });
			},2000);
		},200);
	});
	
	google.maps.event.addListener(poly, 'mouseout', function() { 
		dojo.forEach(neigh.polygons, function(poly) {
			poly.setOptions({fillOpacity: poly.origOpac}); 
		});
		clearTimeout(ons.timeout1);
		clearTimeout(ons.timeout3);	
		ons.timeout2 = setTimeout(function() {
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
	
	poly.setMap(onsmap);
	poly._onsmap = onsmap;
		
	return poly;
}

/** 
 *  Displays a map  
 * @param mapnodeid the id of the dom node in which to draw the map
 * @param id (optional), if supplied, only show the polygons for the provided id or ids (an array is accepted). If
 *          null, don't show any polygons
 */
ons.showMap = function(mapnodeid, id) {
	
	var gmap = new google.maps.Map(document.getElementById(mapnodeid), ons.goptions);
	
	var query = {
		select: 'geometry',
		from: ons.mapid
		//where: "'Neighbourhood Name' = 'Greenbelt'"
	};
	
	if (typeof id == 'undefined') {
		//all
		/*dojo.forEach(ons.maps, function(map) {
			var arrCoords = [];
			dojo.forEach(map.poly, function(poly) {
				var ll = new google.maps.LatLng(poly[1],poly[0]);
				arrCoords.push(ll);
			});
			makePoly(arrCoords, map);
		});*/
		
	}

	//make polys
	ons.getAllNeighbourhoods().then(function(arr) {
		var layer = new google.maps.FusionTablesLayer({ query: query/*, styles: styles*/ });
		ons._onsLayer = layer;
		
		//create a poly for each neighbourhood
		dojo.forEach(arr, function(neigh, index) {
			var geometry = neigh['geometry'];
						
			//we have to do this because there's a bug in google maps (maybe) where it won't draw this correctly
			var bs = geometry.latLngs.b.concat();
			neigh.polygons = [];
			dojo.forEach(bs, function(b) {
				geometry.latLngs.b = [b];
				neigh.polygons.push(ons.makePoly(geometry.latLngs, gmap, neigh));
			});
		});
		
		ons.fitMap(gmap, id);
		
	});
	
	//store these globally
	ons._currentMap = gmap;
	
	//return {map: gmap, layers: [layer]};
}


/*
* get the file id from the column table
* @param - column
*/

ons.getFileId = function(column) {
	if (column == null) {
		return ons.mapid;
	}
	var fileId = ons.mapid;
	dojo.forEach(ons.columns, function(col) {
		if (col.column == column) {
			fileId = col.table ? col.table : ons.mapid;
		}
	});
	return fileId;
}


/**
 * Returns a deferred containing the data for a specific filter
 */
ons.getFilterData = function(filter) {
	var def = new dojo.Deferred();
	var queryText = "SELECT '" + filter + "', 'Neighbourhood Name' FROM " + ons.getFileId(filter);
	
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
ons.filterMap = function(layer, filter) {

	var legend = dojo.byId("map_legend");
	var legend_container = dojo.byId("legendcontainer");
	
	if (filter && filter.length > 0) {
	
		var filterLabel = filter;
		dojo.forEach(ons.columns, function(n) {
			if (n.column == filter) {
				filterLabel = n.label;
			}
		});
	
		ons.getFilterData(filter).then(function(values) {
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
				ons.findNeighbourhood(null, name).then(function(n) {
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
		ons.getAllNeighbourhoods().then(function(arr) {
			dojo.forEach(arr, function(n) {
				dojo.forEach(n.polygons, function(poly) {
					poly.setOptions({fillColor: ons.defaultStyles.polygonOptions.fillColor, fillOpacity: ons.defaultStyles.polygonOptions.fillOpacity});
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
ons.updateFilter = function(nodeid, labelid, category) {
	var node = dojo.byId(nodeid);
	var label = dojo.byId(labelid);
	
	if (node) {
		dojo.attr(node, 'disabled', false);
		dojo.empty(node);
		dojo.create('option', {innerHTML:"", value: null}, node);
		dojo.forEach(ons.columns, function(n) {
			if (n.category && n.category == category) {
					dojo.create('option', {innerHTML:n.label, value: n.column}, node);
			}
		});
	}
	
	if (category) {
		if (label) dojo.removeClass(label, 'disabled');
		ons.filterMap(ons._onsLayer, null);
	} else {
		dojo.attr(node, 'disabled', true);
		if (label) dojo.addClass(label, 'disabled');
		ons.filterMap(ons._onsLayer, null);
	}
}

/*
ons.showChartDialog = function() {
	var catnode = dojo.byId('chart_category_select');
	ons.populateCategorySelect(catnode);

	var myDialog = new dijit.Dialog({
        	title: "Compare Data",
            	style: "width: 60%; height: 600px; background: white;"
       	});

	dojo.place(dojo.byId("chartDialog"), myDialog.domNode);
	dojo.style(dojo.byId("chartDialog"), {display: ""});
	myDialog.show();
	if (dojo.byId('chart_div')) {
		ons.showChart('chart_div');
	} 
}
*/

/* 
 Shows a chart in the provided id, filtered by the 
*/
ons.showChart = function(id,filterSelect) {

	var chartDiv = dojo.byId("chart_div");
	var filterDiv = dojo.byId("chart_filter");
	var messageDiv = dojo.byId("chart_message");
	var neighbourhoodsDiv = dojo.byId("chart_neighbourhoods");
	var chartSort = dojo.byId("chart_sort");
	
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
	var axes = ['Neighbourhood Name', filterSelect.options[filterSelect.selectedIndex].innerHTML];
	var data = new google.visualization.DataTable();
	
	data.addColumn('string', axes[0]);
	data.addColumn('number', axes[1]);
	
	//find the selected neighbourhoods
	var neighs = [];
	for (var i=1;i<neighbourhoodsDiv.options.length;i++) {
		if (neighbourhoodsDiv.options[i].selected) {
        	neighs.push(neighbourhoodsDiv.options[i].innerHTML);
    	}
	}
	
	var sort = chartSort.selectedIndex > 0 ? chartSort.options[chartSort.selectedIndex] : null;
	
	ons.getFilterData(filter).then(function(values) {
		
		var options = {
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
			if (chartSort.options[chartSort.selectedIndex].value == "asc") {
				data.sort({column: 1, desc: false});
			} else if (chartSort.options[chartSort.selectedIndex].value == "desc") {
				data.sort({column: 1, desc: true});
			}
		}

		var chart = new google.visualization.ColumnChart(dojo.byId(id));
		chart.draw(data, options);
	});
	
	var d = ons.getAllNeighbourhoods().then(function(neighbourhoods) {
		
		dojo.forEach(neighbourhoods, function(n) {
		//	data.addRow( [n[axes[0]], n[axes[1]] ] );
		});
	});
	
	
}

/* loading methods */
google.load('visualization', '1', {packages: ['corechart']});

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
ons.populateCategorySelect = function(catnode) {
	if (catnode) {
		var created = {};
		dojo.empty(catnode);
		dojo.create('option', {innerHTML:"", value: null}, catnode);
		dojo.forEach(ons.columns, function(n) {
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
ons.populateNeighbourhoodSelect = function(node) {
	if (node) {
		var d = ons.getAllNeighbourhoods().then(function(neighbourhoods) {
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
ons.createTabs = function() {
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
			ons.showChart('chart_div', 'filter_select');
		}
	});

    tc.startup();
    dojo.style(dojo.byId("mapTab"), { display: ""});
    dojo.style(dojo.byId("chartTab"), { display: ""});
    dojo.place(dojo.byId("mapTab"), cp1.domNode);
    dojo.place(dojo.byId("chartTab"), cp2.domNode);
}

require(["dojo/_base/url", "dojo/dom", "dojo/ready", "dojox/color", "dojo/DeferredList", "dijit/Dialog", "dijit/layout/TabContainer", "dijit/layout/ContentPane"], function(url, dom, ready, color, deferredlist, Dialog, TextBox, Button){
         ready(function(){
			if (typeof $j == "undefined") { $j = $; }
			//set up our collapsible headers (faq page)
			$j.collapsible('.collapsible .header')

			//first thing we do is load all our neighbourhoods so we can cache them
			var d = ons.getAllNeighbourhoods().then(function(neighbourhoods) {
				//if we have a 'map_canvas', show a map in it
				if (dojo.byId('map_canvas')) {
					var id = undefined;
					var u = new url(window.location);
					if (u.query) {
						var q = dojo.queryToObject(u.query || {}); 
						id = q.page_id ? q.page_id: id;
						if (id == 129) { id = undefined; } //the maps page
					}
					ons.showMap('map_canvas', id);
				}

				var catnode = dojo.byId('category_select');
				ons.populateCategorySelect(catnode);

				//if we have a 'neighbourhood_select', populate it with neighbourhoods
				if (dojo.byId('neighbourhood_select')) {
					var node = dojo.byId('neighbourhood_select');
					ons.populateNeighbourhoodSelect(node);
				}


				var neighbourhoodsDiv = dojo.byId("chart_neighbourhoods");
				if (neighbourhoodsDiv) {
					ons.populateNeighbourhoodSelect(neighbourhoodsDiv);
				}
				
				ons.createTabs();
			});
		});
});

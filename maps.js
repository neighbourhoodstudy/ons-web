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

//if you change the fusion table, MAKE SURE you change the columns below
ons.columns = [{
    label: 'Neighbourhood Name',
    column: null
}, {
    label: 'ID',
    column: null
}, {
    label: 'geometry',
    column: null
}, {
    label: 'Population (2006)',
    column: 'POP2006'
}, {
    label: 'Population',
    column: 'Population',
	category: 'Population'
}, {
    label: 'Number of Schools',
    column: 'Schools',
	category: 'Schools'
}, {
    label: 'Number of schools within 500m of fast food outlet',
    column: 'Schools500mfastfood',
	category: 'Schools'
}, {
    label: 'Distance (m) to the closest fast food outlet (only considering schools within 500 m of fast food outlet)',
    column: 'SchoolDistanceToFastFood',
	category: 'Schools'
}, {
    label: '% of schools within 500m of fast food',
    column: '%Schools500mFastFood',
	category: 'Schools'
}, {
    label: 'Distance (m) to closest library',
    column: 'DistanceToLibrary',
	category: 'Libraries'
}, {
    label: 'Total park lands Area (m2)',
    column: 'ParkLandsArea',
	category: 'Parks'
}, {
    label: 'Total park lands area (m2) / person',
    column: 'ParkLandsArea/Person',
	category: 'Parks'
}, {
    label: 'Total Area (m2) of park lands / 1000 people',
    column: 'ParkLandsArea/1k',
	category: 'Parks'
}, {
    label: 'Distance (m) to closest park',
    column: 'DistancePark',
	category: 'Parks'
}, {
    label: 'Number of grocery stores',
    column: 'GroceryStores',
	category: 'Grocery Stores'
}, {
    label: 'Grocery Stores / 1000 people',
    column: 'GroceryStores/1k',
	category: 'Grocery Stores'
}, {
    label: 'Distance (m) to the closest grocery store',
    column: 'DistanceGrocStore',
	category: 'Grocery Stores'
}, {
    label: 'Average distance (m) to the closest 4 grocery stores',
    column: 'AvgDistance4GrocStores',
	category: 'Grocery Stores'
}, {
    label: 'Number of specialty stores',
    column: 'SpecStores',
	category: 'Specialty Stores'
}, {
    label: 'Specialty stores / 1000 people',
    column: 'SpecStores/1k',
	category: 'Specialty Stores'
}, {
    label: 'Distance (m) to the closest specialty store',
    column: 'DistanceSpecStore',
	category: 'Specialty Stores'
}, {
    label: 'Average distance (m) to the closest 4 specialty stores',
    column: 'Distance4SpecStores',
	category: 'Specialty Stores'
}, {
    label: 'Number of convenience stores',
    column: 'ConvienStores',
	category: 'Convenience Stores'
}, {
    label: 'Convenience stores / 1000 people',
    column: 'ConvienStores/1k',
	category: 'Convenience Stores'
}, {
    label: 'Distance (m) to the closest convenience store',
    column: 'DistanceConvienStore',
	category: 'Convenience Stores'
}, {
    label: 'Average distance (m) to the closest 4 convenience stores',
    column: 'Distance4ConvienStores',
	category: 'Convenience Stores'
}, {
    label: 'Number of Religious Organizations',
    column: 'ReligOrgs',
	category: 'Religious Organizations'
}, {
    label: 'Religious Organizations / 1000 people',
    column: 'ReligOrgs/1k',
	category: 'Religious Organizations'
}, {
    label: 'Number of fast food outlets',
    column: 'FastFood',
	category: 'Fast Food'
}, {
    label: 'Fast Food / 1000 people',
    column: 'FastFood/1k',
	category: 'Fast Food'
}, {
    label: 'Distance (m) to the closest fast food outlet',
    column: 'DistanceFastFood',
	category: 'Fast Food'
}, {
    label: 'Average distance (m) to the closest 4 fast food outlets',
    column: 'Distance4FastFoods',
	category: 'Fast Food'
}, {
    label: 'Number of Recreation Facilities',
    column: 'Rec Fac',
	category: 'Recreation Facilities'
}, {
    label: 'Recreation Facilities / person',
    column: 'Rec Fac/person',
	category: 'Recreation Facilities'
}, {
    label: 'Recreation Facilities / 1000 people',
    column: 'Rec Fac/1000',
	category: 'Recreation Facilities'
}, {
    label: 'Number of winter outdoor recreation facilities',
    column: 'WinterOutdoorRecFac',
	category: 'Recreation Facilities'
}, {
    label: 'Winter outdoor recreation facilities / 1000 people',
    column: 'WinterOutdoorRecFac/1k',
	category: 'Recreation Facilities'
}, {
    label: 'Number of summer outdoor recreation facilities',
    column: 'SummerOutdoorRecFac',
	category: 'Recreation Facilities'
}, {
    label: 'Summer outdoor recreation facilities / 1000 people',
    column: 'SummerOutdoorRecFac/1k',
	category: 'Recreation Facilities'
}, {
    label: 'Number of indoor recreation facilities',
    column: 'IndoorRecFac',
	category: 'Recreation Facilities'
}, {
    label: 'Indoor recreation facilities / 1000 people',
    column: 'IndoorRecFac/1k',
	category: 'Recreation Facilities'
}, {
    label: 'Distance(m) to the closest indoor recreation facility',
    column: 'DistanceIndoorRecFac',
	category: 'Recreation Facilities'
}, {
    label: 'Distance(m) to the closest outdoor recreation facility',
    column: 'DistanceOutdoorRecFac',
	category: 'Recreation Facilities'
}, {
    label: 'Number of Restaurants',
    column: 'Restaurants',
	category: 'Restaurants'
}, {
    label: 'Restaurants / 1000 people',
    column: 'Restaurants/1k',
	category: 'Restaurants'
}, {
    label: 'Average distance (m) to the closest 4 restaurants',
    column: '4Restaurants',
	category: 'Restaurants'
}, {
    label: 'Number of pharmacies',
    column: 'Pharmacies',
	category: 'Pharmacies'
}, {
    label: 'Pharmacies / 1000 people',
    column: 'Pharmacies/1k',
	category: 'Pharmacies'
}, {
    label: 'Number of physicians',
    column: 'Physicians',
	category: 'Physicians'
}, {
    label: 'physicians / 1000 people',
    column: 'Physicians/1k',
	category: 'Physicians'
}, {
    label: 'Average Distance to 4 closest physicians',
    column: '4Physicians',
	category: 'Physicians'
}, {
    label: 'Bike/Walking path length (m)',
    column: 'BikePath',
	category: 'Bike Paths'
}, {
    label: 'Bike/Walking path length (km)',
    column: 'BikePathkm',
	category: 'Bike Paths'
}, {
    label: 'Bike/Walking path length (m) / person',
    column: 'BikePath/person',
	category: 'Bike Paths'
}, {
    label: 'Number of healthy financial services',
    column: 'HFinServ',
	category: 'Financial Services'
}, {
    label: 'Healthy financial services / 1000 people',
    column: 'HFinServ/1k',
	category: 'Financial Services'
}, {
    label: 'Number of unhealthy financial services',
    column: 'UHFinServ',
	category: 'Financial Services'
}, {
    label: 'Unhealthy financial services / 1000 people',
    column: 'UHFinServ/1k',
	category: 'Financial Services'
}, {
    label: 'Total greenspace area (m2)',
    column: 'Greenspace',
	category: 'Greenspace'
}, {
    label: 'Total greenspace area (km2)',
    column: 'Greenspacekm2',
	category: 'Greenspace'
}, {
    label: 'Greenspace area (km2) / 1000 people',
    column: 'Greenspace/1k',
	category: 'Greenspace'	
}, {
    label: 'Male 0 to 9 years',
    column: 'M09',
	category: 'Population by Age and Gender'	
}, {
    label: 'Male 10 to 19 years',
    column: 'M1019',
	category: 'Population by Age and Gender'	
}, {
    label: 'Male 20 to 29 years',
    column: 'M2029',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 30 to 39 years',
    column: 'M3039',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 40 to 49 years',
    column: 'M4049',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 50 to 59 years',
    column: 'M5059',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 60 to 69 years',
    column: 'M6069',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 70 to 79 years',
    column: 'M7079',
	category: 'Population by Age and Gender'
}, {
    label: 'Male 80+ years',
    column: 'M80',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 0 to 9 years',
    column: 'F09',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 10 to 19 years',
    column: 'F1019',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 20 to 29 years',
    column: 'F2029',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 30 to 39 years',
    column: 'F3039',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 40 to 49 years',
    column: 'F4049',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 50 to 59 years',
    column: 'F5059',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 60 to 69 years',
    column: 'F6069',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 70 to 79 years',
    column: 'F7079',
	category: 'Population by Age and Gender'
}, {
    label: 'Female 80+ years',
    column: 'F80',
	category: 'Population by Age and Gender'
}, {
    label: '% before 1946',
    column: 'before 1946',
	category: 'Age of Construction',
	table: '1If6m2FXPKVC0vjRnIbeV8MBdBCUKQiHL5znHWZQ'
}];


ons.dataTables = [{
	noColumns: 79,
	startColumn: 0
}, {
	noColumns: 1,
	startColumn: 79
}];


//Name:	Age of Construction.csv
//Numeric ID:	2730132

ons.cache = {};

//base map
ons.mapid = 2721445; //theirs
//ons.mapid = 2641354; //mine

//markers
ons.markers = {};

ons.markers.communityGardens = {
  name: "Community Gardens",
  mapid: 2721645,
  icon: "communityGardens.png",
  markers: null
};
ons.markers.groceryStores = {
  name: "Grocery Stores",
  mapid: 2721648,
  icon: "groceryStores.png",
  markers: null
};
ons.markers.healthyFinancial = {
  name: "Healthy Financial",
  mapid: 2721831,
  icon: "healthyFinancial.png",
  markers: null
};
ons.markers.healthyFinancial = {
  name: "Healthy Financial",
  mapid: 2721831,
  icon: "healthyFinancial.png",
  markers: null
};
ons.markers.libraries = {
  name: "Libraries",
  mapid: 2721652,
  icon: "libraries.png",
  markers: null
};
ons.markers.paths = {
  name: "Paths",
  mapid: 2721745,
  icon: "paths.png",
  markers: null
};
ons.markers.pharmacies = {
  name: "Pharmacies",
  mapid: 2721655,
  icon: "pharmacies.png",
  markers: null
};
ons.markers.physicians = {
  name: "Physicians",
  mapid: 2721747,
  icon: "physicians.png",
  markers: null
};
ons.markers.religion = {
  name: "Religion",
  mapid: 2721656,
  icon: "religion.png",
  markers: null
};
ons.markers.restaurants = {
  name: "Restaurants",
  mapid: 2721839,
  icon: "restaurants.png",
  markers: null
};
ons.markers.schools = {
  name: "Schools",
  mapid: 2721463,
  icon: "schools.png",
  markers: null
};
ons.markers.specialtyStores = {
  name: "Specialty Stores",
  mapid: 2721845,
  icon: "specialtyStores.png",
  markers: null
};
ons.markers.unhealthyFinancial = {
  name: "Unhealthy Financial",
  mapid: 2721660,
  icon: "unhealthyFinancial.png",
  markers: null
};
//2610593; //working


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

	
		var queryTextu = "SELECT " 
			+ "'" + cols[id].join("','") + "'" 
			+ " FROM " + id + " ORDER BY 'Neighbourhood Name'";
	

		queryText = encodeURIComponent(queryTextu);
		queries.push( new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText));
		var def = new dojo.Deferred();
		//def.then(function(response) {alert('in callback ' + response.getDataTable().getNumberOfRows() );});
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
	arr.length = ons.columns.length;
	ons.cache["neighbourhoods"] = arr;
	var queries = ons.createQueries();
	
	var dlistObj = new dojo.DeferredList([ons.callbackObjects[0], ons.callbackObjects[1]]);
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
				if (ons.cache["neighbourhoods"][i]) {
					retObj = ons.cache["neighbourhoods"][i];
				}
				for(j = 0; j < numCols; j++) {
					var value = response.getDataTable().getValue(i, j);
					var pos = j + startCol;
					var key = ons.columns[pos].column ? ons.columns[pos].column : ons.columns[pos].label;
					if (key == "geometry") {
						value = ons.parseKml(ons._currentMap,value);
					}
					retObj[key] = value;
				}
				ons.cache["neighbourhoods"][i] = retObj;
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


ons.filterMap = function(layer, filter) {

	var legend = dojo.byId("map_legend");
	var legend_container = dojo.byId("legendcontainer");
	var queryText = "SELECT '" + filter + "', 'Neighbourhood Name' FROM " + ons.getFileId(filter);
	
	queryText = encodeURIComponent(queryText);

	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
	var def = new dojo.Deferred();
	if (filter && filter.length > 0) {
	
		var filterLabel = filter;
		dojo.forEach(ons.columns, function(n) {
			if (n.column == filter) {
				filterLabel = n.label;
			}
		});
	
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
			
			for(var name in values) {
				var value = values[name];
				ons.findNeighbourhood(null, name).then(function(n) {
					var h = 120; //green
					var s = 100;
					var percent = value/max;
					var l =  parseInt(100-(90*percent));
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
 Shows a chart in the provided id
*/
ons.showChart = function(id) {
	var axes = ['Neighbourhood Name', 'Population'];
	var d = ons.getAllNeighbourhoods().then(function(neighbourhoods) {
		//console.log(axes, neighbourhoods);
		
		var data = new google.visualization.DataTable();
        	data.addColumn('string', axes[0]);
	        data.addColumn('number', axes[1]);
		dojo.forEach(neighbourhoods, function(n) {
			data.addRow( [n[axes[0]], n[axes[1]] ] );
		});

        	var options = {
       			title: axes[1],
			hAxis: {title: axes[0], titleTextStyle: {color: 'red'}}
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		chart.draw(data, options);
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

require(["dojo/_base/url", "dojo/dom", "dojo/ready", "dojox/color", "dojo/DeferredList"], function(url, dom, ready, color, deferredlist){
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

				if (dojo.byId('chart_div')) {
					ons.showChart('chart_div');
				}
				
				//if we have a 'neighbourhood_select', populate it with neighbourhoods
				if (dojo.byId('neighbourhood_select')) {
					var node = dojo.byId('neighbourhood_select');
					if (node) {
						dojo.empty(node);
						//add an empty one
						dojo.create('option', {innerHTML:"", value: null}, node);
						dojo.forEach(neighbourhoods, function(n) {
							dojo.create('option', {innerHTML:n["Neighbourhood Name"], value: n.ID}, node);
						});
					}
					
					var catnode = dojo.byId('category_select');
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
			});
		});
});

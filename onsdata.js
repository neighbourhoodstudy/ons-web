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

//if you change the fusion tables, MAKE SURE you change the columns below
ons.dataTables = [{
	noColumns: 79,
	startColumn: 0
}, {
	noColumns: 51,
	startColumn: 79
}, {
	noColumns: 53,
	startColumn: 130
}, {
	noColumns: 28,
	startColumn: 183
}];


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
	label: 'Total population by citizenship',
	column: 'Total population by citizenship',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Canadian Citizens (% of Total Population)',
	column: '% Canadian Citizens (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Not Canadian Citizens (% of Total Population)',
	column: '% Not Canadian Citizens (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Immigrants (% of Total Population)',
	column: '% Immigrants (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Non-immigrants (% of Total Population)',
	column: '% Non-immigrants (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Born in province of residence (% of Total Population)',
	column: '% Born in province of residence (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: '% Born outside province of residence (% of Total Population)',
	column: '% Born outside province of residence (% of Total Population)',
	category: 'Citzenship',
	table: 4142362
}, {
	label: 'Average income of individuals',
	column: 'Average income of individuals',
	category: 'Average Income',
	table: 4142362
}, {
	label: 'Average Household Income',
	column: 'Average Household Income',
	category: 'Average Income',
	table: 4142362
}, {
	label: '% give unpaid care (including unpaid household)',
	column: '% give unpaid care (including unpaid household)',
	category: 'Care Givers',
	table: 4142362
}, {
	label: 'unpaid care for children and seniors',
	column:  'unpaid care for children and seniors',
	category: 'Care Givers',
	table: 4142362
}, {
	label: '% looking after children without pay',
	column: '% looking after children without pay',
	category: 'Care Givers',
	table: 4142362
}, {
	label: '% Single-detached house',
	column: '% Single-detached house',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Semi-detached house',
	column: '% Semi-detached house',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Row house',
	column: '% Row house',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Apartment',
	column: '% Apartment',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label:  'duplex',
	column:  'duplex',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Apartment building that has five or more storeys',
	column: '% Apartment building that has five or more storeys',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Apartment building that has fewer than five storeys',
	column: '% Apartment building that has fewer than five storeys',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% other single-attached house',
	column: '% other single-attached house',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Renter Occupied',
	column: '% Renter Occupied',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: '% Owner Occupied',
	column: '% Owner Occupied',
	category: 'Dwelling Type',
	table: 4142362
}, {
	label: 'Number of dwellings',
	column: 'Number of dwellings',
	category: 'Dwellings',
	table: 4142362
}, {
	label: 'Average number of persons per room',
	column: 'Average number of persons per room',
	category: 'Dwellings',
	table: 4142362
}, {
	label: '% of dwellings needing major repairs',
	column: '% of dwellings needing major repairs',
	category: 'Dwellings',
	table: 4142362
}, {
	label: '% needing regular maintenance only',
	column: '% needing regular maintenance only',
	category: 'Dwellings',
	table: 4142362
}, {
	label: '% of dwellings needing minor repairs',
	column: '% of dwellings needing minor repairs',
	category: 'Dwellings',
	table: 4142362
}, {
	label: 'Average value of dwelling (owener occupied private non-farm)',
	column: 'Average value of dwelling (owener occupied private non-farm)',
	category: 'Dwellings',
	table: 4142362
}, {
	label:  'non-reserve dwellings',
	column:  'non-reserve dwellings',
	category: 'Dwellings',
	table: 4142362
}, {
	label: '% No certificate',
	column: '% No certificate',
	category: 'Dwellings',
	table: 4142362
}, {
	label:  'diploma or degree',
	column:  'diploma or degree',
	category: 'Education',
	table: 4142362
}, {
	label: '% High school certificate or equivalent',
	column: '% High school certificate or equivalent',
	category: 'Education',
	table: 4142362
}, {
	label: '% Apprenticeship or trades certificate or diploma',
	column: '% Apprenticeship or trades certificate or diploma',
	category: 'Education',
	table: 4142362
}, {
	label: '% College',
	column: '% College',
	category: 'Education',
	table: 4142362
}, {
	label: '% Full time or full year',
	column: '% Full time or full year',
	category: 'Employment Type',
	table: 4142362
}, {
	label: '% Part time or part year',
	column: '% Part time or part year',
	category: 'Employment Type',
	table: 4142362
}, {
	label: '% Did not work in 2005',
	column: '% Did not work in 2005',
	category: 'Employment Type',
	table: 4142362
}, {
	label: '% with aboriginal identity',
	column: '% with aboriginal identity',
	category: 'First Nations',
	table: 4142362
}, {
	label: '% married couples (out of total number of census families in private households)',
	column: '% married couples (out of total number of census families in private households)',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% common-law couples(out of total number of census families in private households)',
	column: '% common-law couples(out of total number of census families in private households)',
	category: 'Household Type',
	table: 4142362
}, {
	label:  '% lone parent families(out of total number of census families in private households)',
	column: '% lone parent families(out of total number of census families in private households)',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% Persons in private households living alone',
	column: '% Persons in private households living alone',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% members of a family household (including one-family and multiple-family households)',
	column: '% members of a family household (including one-family and multiple-family households)',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% members of one-family household',
	column: '% members of one-family household',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% members of multiple-family household',
	column: '% members of multiple-family household',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% members of a non-family household',
	column: '% members of a non-family household',
	category: 'Household Type',
	table: 4142362
}, {
	label: '% Under 5 years',
	column: '% Under 5 years',
	category: 'Imigration by Age',
	table: 4142362
}, {
	label: '% 5 to 14 years',
	column: '% 5 to 14 years',
	category: 'Imigration by Age',
	table: 4142362
}, {
	label: '% 15 to 24 years',
	column: '% 15 to 24 years',
	category: 'Imigration by Age',
	table: 4142362
}, {
	label: '% 25 to 44 years',
	column: '% 25 to 44 years',
	category: 'Imigration by Age',
	table: 4142362
}, {
	label: '% 45 years and over',
	column: '% 45 years and over',
	category: 'Imigration by Age',
	table: 4142362
}, {
	label: '% before 1946',
	column: '% before 1946',
	category: 'Age of Construction',
	table: 4142834
}, {
	label: '% 1946 to 1960',
	column: '% 1946 to 1960',
	category:  'Age of Construction',
	table: 4142834
}, {
	label: '% 1961 to 1970',
	column: '% 1961 to 1970',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1971 to 1980',
	column: '% 1971 to 1980',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1981 to 1985',
	column: '% 1981 to 1985',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1986 to 1990',
	column: '% 1986 to 1990',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1991 to 1995',
	column: '% 1991 to 1995',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1996 to 2000',
	column: '% 1996 to 2000',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 2001 to 2006',
	column: '% 2001 to 2006',
	category: 'Age of Construction', 
	table: 4142834
}, {
	label: '% 1st generation',
	column: '% 1st generation',
	category: 'Immigration',
	table: 4142834
}, {
	label: '% 2nd generation',
	column: '% 2nd generation',
	category: 'Immigration', 
	table: 4142834
}, {
	label: '% 3rd generation',
	column: '% 3rd generation',
	category: 'Immigration', 
	table: 4142834
}, {
	label: '% Immigrated from 1996 to 2000',
	column: '% Immigrated from 1996 to 2000',
	category:  'Immigration',
	table: 4142834
}, {
	label: '% Immigrated from 2001 to 2006',
	column: '% Immigrated from 2001 to 2006',
	category: 'Immigration', 
	table: 4142834
}, {
	label: 'Not in the labour force',
	column: 'Not in the labour force',
	category: 'Labour', 
	table: 4142834
}, {
	label: 'Participation rate',
	column: 'Participation rate',
	category:  'Labour', 
	table: 4142834
}, {
	label: '% Employed',
	column: '% Employed',
	category:  'Labour', 
	table: 4142834
}, {
	label: '% Unemployed',
	column: '% Unemployed',
	category:  'Labour', 
	table: 4142834
}, {
	label: 'Total population',
	column: 'Total population',
	category: 'Language Spoken',
	table: 4142834
}, {
	label: '% English',
	column: '% English',
	category:  'Language Spoken',
	table: 4142834
}, {
	label: '% French',
	column: '% French',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: '% Non-Official Languages',
	column: '% Non-Official Languages',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: 'English',
	column: 'English',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: 'French',
	column: 'French',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: 'Non-Official Languages',
	column: 'Non-Official Languages',
	category:  'Language Spoken',
	table: 4142834
}, {
	label: '% English vs Ottawa Avg',
	column: '% English vs Ottawa Avg',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: '% French vs Ottawa Avg',
	column: '% French vs Ottawa Avg',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: '% Non-Official Languages vs Ottawa Avg',
	column: '% Non-Official Languages vs Ottawa Avg',
	category: 'Language Spoken', 
	table: 4142834
}, {
	label: 'Prevalence of low income before tax',
	column: 'Prevalence of low income before tax',
	category: 'Low Income',
	table: 4142834
}, {
	label: 'Prevalence of low income after tax',
	column: 'Prevalence of low income after tax',
	category:  'Low Income',
	table: 4142834
}, {
	label: '% of Economic Families living under the LICO (before tax)',
	column: '% of Economic Families living under the LICO (before tax)',
	category:  'Low Income',
	table: 4142834
}, {
	label: '% of Economic Families living under the LICO (after tax)',
	column: '% of Economic Families living under the LICO (after tax)',
	category: 'Low Income', 
	table: 4142834
}, {
	label: 'Children living under LICO (before tax)',
	column: 'Children living under LICO (before tax)',
	category:  'Low Income',
	table: 4142834
}, {
	label: 'Children living under LICO (after tax)',
	column: 'Children living under LICO (after tax)',
	category:  'Low Income',
	table: 4142834
}, {
	label: 'Seniors living under LICO (before tax)',
	column: 'Seniors living under LICO (before tax)',
	category: 'Low Income', 
	table: 4142834
}, {
	label: 'Seniors living under LICO (after tax)',
	column: 'Seniors living under LICO (after tax)',
	category:  'Low Income',
	table: 4142834
}, {
	label: '% Non-movers (1 Year Ago)',
	column: '% Non-movers (1 Year Ago)',
	category: 'Mobility',
	table: 4142834
}, {
	label: '% Movers (1 Year Ago)',
	column: '% Movers (1 Year Ago)',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% Non-migrants (% of the population of movers (1 Year Ago))',
	column: '% Non-migrants (% of the population of movers (1 Year Ago))',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% Migrants (% of the population of movers (1 Year Ago))',
	column: '% Migrants (% of the population of movers (1 Year Ago))',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% Interprovincial (% of the population of migrants (1 Year Ago))',
	column: '% Interprovincial (% of the population of migrants (1 Year Ago))',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% External migrants (% of the population of migrants (1 Year Ago))',
	column: '% External migrants (% of the population of migrants (1 Year Ago))',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% Non-movers (5 years ago)',
	column: '% Non-movers (5 years ago)',
	category:  'Mobility',
	table: 4142834
}, {
	label: '% Movers (5 years ago)',
	column: '% Movers (5 years ago)',
	category:  'Mobility',
	table: 4142834
}, {
	label: 'Total experienced labour force 15 years and over',
	column: 'Total experienced labour force 15 years and over',
	category: 'Occupation',
	table: 4142834
}, {
	label: '% Total experienced labour force 15 years and over (% of Total Labour Force)',
	column: '% Total experienced labour force 15 years and over (% of Total Labour Force)',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Management ',
	column: '% Management ',
	category: 'Occupation', 
	table: 4142834
}, {
	label: '% Business',
	column: '% Business',
	category: 'Occupation', 
	table: 4142834
}, {
	label: ' finance and administration ',
	column: ' finance and administration ',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Natural and applied sciences and related',
	column: '% Natural and applied sciences and related',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Health occupations',
	column: '% Health occupations',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Construction industries',
	column: '% Construction industries',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Retail trade',
	column: '% Retail trade',
	category:  'Occupation',
	table: 4142834
}, {
	label: '% Other services (except public administration)',
	column: '% Other services (except public administration)',
	category:  'Occupation',
	table: 4142834
}, {
	label: 'Total population ',
	column: 'Total population ',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% English only',
	column: '% English only',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% French only',
	column: '% French only',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% English and French',
	column: '% English and French',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% neither English nor French',
	column: '% neither English nor French',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: 'English only',
	column: 'English only',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: 'French only',
	column: 'French only',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: 'English and French',
	column: 'English and French',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: 'Neither English nor French',
	column: 'Neither English nor French',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% English only vs Ottawa Avg',
	column: '% English only vs Ottawa Avg',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% French only vs Ottawa Avg',
	column: '% French only vs Ottawa Avg',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% English and French vs Ottawa Avg',
	column: '% English and French vs Ottawa Avg',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% Neither English nor French vs Ottawa Avg',
	column: '% Neither English nor French vs Ottawa Avg',
	category: 'Official Language Knowledge',
	table: 4142553
}, {
	label: '% Seniors Living Alone (% of Total Population of Seniors)',
	column: '% Seniors Living Alone (% of Total Population of Seniors)',
	category: 'Seniors',
	table: 4142553
}, {
	label: '% Seniors Living Alone (% of Total Population)',
	column: '% Seniors Living Alone (% of Total Population)',
	category: 'Seniors',
	table: 4142553
}, {
	label: 'Total Response - Mode of transportation',
	column: 'Total Response - Mode of transportation',
	category: 'Seniors',
	table: 4142553
}, {
	label: '% Car driver',
	column: '% Car driver',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'truck driver',
	column:  'truck driver',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'van driver',
	column:  'van driver',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'as driver',
	column:  'as driver',
	category: 'Transportation',
	table: 4142553
}, {
	label: '% Car passenger',
	column: '% Car passenger',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'truck passenger',
	column:  'truck passenger',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'van passenger',
	column:  'van passenger',
	category: 'Transportation',
	table: 4142553
}, {
	label:  'as passenger',
	column:  'as passenger',
	category: 'Transportation',
	table: 4142553
}, {
	label: '% Visible minority population',
	column: '% Visible minority population',
	category: 'Visible Minorities',
	table: 4142553
}, {
	label: 'Number of Youth in the Labour Force',
	column: 'Number of Youth in the Labour Force',
	category: 'Youth Employment',
	table: 4142553
}, {
	label: '% Youth employment',
	column: '% Youth employment',
	category: 'Youth Employment',
	table: 4142553
}, {
	label: '% Youth unemployment',
	column: '% Youth unemployment',
	category: 'Youth Employment',
	table: 4142553
}];

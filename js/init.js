let collection = {
    'type': 'FeatureCollection',
    'features': []
};

let otherCategories = new Set();

let map = L.map('map').setView([49.8397, 24.0297], 8);
var loader;

let wantedSheets = [
    {
        type: "sheetsForMapping",
        data: []
    },
    {
        type: "configSheets",
        data: []
    }
];

$( document ).init(function() {

    $("#control-bar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#control-barCollapse').on('click', function () {
        $('#control-bar').toggleClass('active');
    });

    $("#sidebar").mCustomScrollbar({
        theme: "dark-2"
    });

    ///Hide breadcrumb dropdown on map click
    map.on('click', function(e) {
        $('.breadcrumbs-dropdown-content').collapse();
        $(".info.legend.leaflet-control").hide();
    });

    ///Handling click event for the Clear Filter button inside Bootstrap control sidebar START
     $('.parent').on('click', function(e) {
      // Do not trigger if target elm or it's child has `no-orange` class
      if(!treeHasClass(e.target, "no-orange", this)) {
        $(this).css('backgroundColor', 'darkorange');
      }
    });

    $('.no-collapse').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $('.original-dropper .dropdown-toggle').dropdown("toggle");
    });
    /**
     * Checks if any of parent nodes of elm has a class name
     * @param {HTMLElement} elm the starting node
     * @param {string} className
     * @param {HTMLElement} stopAtElm if this parent is reached, search stops
    **/
    function treeHasClass(elm, className, stopAtElm) {
      while(elm != null && elm != stopAtElm) {
        if(elm.classList.contains(className)) {
          return true;
        }
        elm = elm.parentNode;
      }
      return false;
    }
    ///Handling click event for the Clear Filter button inside Bootstrap control sidebar END

    // This is the Carto Positron basemap
    let basemap = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    basemap.addTo(map);

    //Map loader
    loader = L.control.loader();
    loader.addTo(map);

    let layerControl = new L.Control.Custom(null, null, {collapsed: true});
    map.layerControl = layerControl;
    layerControl.addTo(map);

    ///map legend START  
    let legend = new L.Control.Legend();
    legend.addTo(map);

    map.on('overlayadd', e => $(`.legend > span:contains(${e.name})`).toggle() );
    map.on('overlayremove', e => $(`.legend > span:contains(${e.name})`).toggle() );
    $(".info.legend.leaflet-control").hide();
    
    createUserLocationBtn(map);
    getUserGeolocation(map);

    let sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'right'
    });
    map.addControl(sidebar);
    map.sidebar = sidebar;

    map.on('click', function () {
        map.sidebar.hide();
    });

    init(map, sidebar);

});

function getFilteredMarkers(markers) {
    let checkboxStates = updateCheckboxStates();

    let checkboxIsChecked = false;

    filtersSectionBinding.forEach(binding => {
        checkboxIsChecked = checkboxIsChecked | checkboxStates[binding.arrayName].length > 0;
    });

    let filteredMarkers;

    //If at least one filtering checkbox is checked, filter by the selected feature property is applied
    if(checkboxIsChecked) {
        filteredMarkers = markers.filter(marker => {
            let selectedCategoryMatch = true;

            if (checkboxStates.serviceCategories.length > 0) {
                selectedCategoryMatch &= checkboxStates.serviceCategories
                    .includes(marker.feature.properties.ac1);
            }

            if (checkboxStates.facilityTypes.length > 0) {
                selectedCategoryMatch &= checkboxStates.facilityTypes
                    .includes(marker.feature.properties.facilitytype);
            }

            let otherCategoryMatch = true;
            let otherCategoryChecked = false;

            Object.keys(otherCategories).forEach(category => {
                let categoryCanonicalName = category.replace(/ /g, "");
                if (checkboxStates[categoryCanonicalName].length > 0) {
                    otherCategoryChecked = true;
                    let categoryMatch = false;
                    checkboxStates[categoryCanonicalName].forEach(valueName => {
                        categoryMatch |= marker.feature.properties.hasOwnProperty(`F_${category}_${valueName}`) &&
                            marker.feature.properties[`F_${category}_${valueName}`].filterValue === "Yes";
                    });
                    otherCategoryMatch &= categoryMatch;
                }
            });

            if (otherCategoryChecked) {
                selectedCategoryMatch &= otherCategoryMatch;
            }

            return selectedCategoryMatch; //true if either of variables is true
        });
    }
    //If no filter checkbox is checked, return all the features in the array.
    else {
        filteredMarkers = markers;
    }

    if (map.breadcrumbs.length > 1) {
        filteredMarkers = getMarkersByRegion(filteredMarkers, map.breadcrumbs[1].DisplayName);
    }
    if (map.breadcrumbs.length > 2) {
        filteredMarkers = getMarkersByDistrict(filteredMarkers, map.breadcrumbs[2].DisplayName);
    }

    return filteredMarkers;
}

function getMarkersByDistrict(filteredMarkers, district) {
    if (district && district !== "") {
        return filteredMarkers.filter(element => element.feature.properties.district === district);
    } else {
        return filteredMarkers;
    }
}

function getMarkersByRegion(filteredMarkers, region) {
    if (region && region !== "") {
        return filteredMarkers.filter(element => element.feature.properties.region === region);
    } else {
        return filteredMarkers;
    }
}

// init() is called as soon as the page loads
function init(map, sidebar) {
    Tabletop.init({

        key: dataURL,
        callback: (data, tabletop, mappingData) => {        
            initData(tabletop);
            let mappingSheets = getFacilitiesData();

            createFacilitiesArray(mappingSheets);
            let codes = mergeCodes(collection, dataTypesTemplate);

            //Create marker cluster layer group.
            let markerCluster = L.markerClusterGroup({
                showCoverageOnHover: true,
                zoomToBoundsOnClick: true,
            }).addTo(map);
            map.markerCluster = markerCluster;
            let categoriesRoot = $("#filterCategoriesUL");
            buildServiceCategory(categoriesRoot, codes);
            buildFacilityTypeCategory(categoriesRoot);
            buildOtherCategories(categoriesRoot);

            let overlays = createOverlays(codes);
            let markers = createMarkers (map.sidebar, collection.features);
            map.markers = markers;
            createLayers(markerCluster, collection, markers, overlays, dataTypesTemplate);
            createFilters(markers);
            initializeEvents(markerCluster, map.sidebar, markers);
            addMarkerSearch(markerCluster);
            initBreadcrumbs(map.rootAdministrativeUnit);

            //When all the map controls are initialized, hide map loader
            loader.hide();
        },
    });
}

function initializeEvents(layers, sidebar, markers) {
    buttonsJson.forEach(element => bindClearFilter(element.buttonId, element.className, layers, sidebar, markers));
}

function bindClearFilter(buttonId, className, layers, sidebar, markers) {
    var btn = document.getElementById(buttonId);
    if (btn) {
        btn.onclick = function (e) {
            clearCheckboxFilters(className, layers, sidebar, markers);
        }
    }   
}

function updateMarkers(markers) {
    let filteredMarkers = getFilteredMarkers(markers);

    map.markerCluster.subGroups.forEach(subGroup => {
        subGroup.clearLayers();

        let subGroupMarkers = filteredMarkers.filter(marker => marker.subGroup === subGroup);
        subGroupMarkers.forEach(marker => subGroup.addLayer(marker));
    });
}

function createMarkers(sidebar, features) {
    let markers = [];
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
    	let marker = createMarker(feature);
        markers.push(marker);

        let icon;
        // AwesomeMarkers is used to create facility icons. TODO: add icons
        //If 'mh4uCooperation' value equals 'Yes', add a custom icon to the marker
        if (feature.properties.mh4uCooperation == 'Yes') {
                icon = L.AwesomeMarkers.icon({
                // icon: 'star',
                icon: 'certificate',
                prefix: 'fa',
                iconColor: 'orange',
                markerColor: getMarkerColor(feature.properties.ac1),
            });
        }
        else {
            icon = L.AwesomeMarkers.icon({
                icon: 'plus',
                prefix: 'fa',
                markerColor: getMarkerColor(feature.properties.ac1),
        });
        }
        marker.setIcon(icon);

        //Function to open right sidebar with facility description after clicking on marker
        marker.on('click', (e)=> populateInfoSidebar(e, sidebar));
    }

    return markers;
}

function createFacilitiesArray(array) {
    let regions = array.data.forEach(region => {

        //Get region name from the sheet tab name
        let regionTabName = region.name;
        let regionName = regionTabName.replace(/.*?\[.*?\]/, '');

        let rows = region.elements;
        rows.forEach(row => {

            let lat = parseFloat(row.Latitude);
            let lon = parseFloat(row.Longitude);

            // If the showOnMap checkbox is set to true, and
            // if feature has the lat and long property, add feature to the map
            let showOnMap = row["Додати на мапу"];
            if (lat && lon && showOnMap === "TRUE") {
                let coords = [parseFloat(row.Longitude), parseFloat(row.Latitude)];
                let feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coords
                    },
                    'properties': {
                        'officialName': row["Офіційна назва"],
                        'recorddate': row["Інформація актуальна станом на:"],
                        'address': row["Адреса"],
                        'district': row["Район"],
                        'region': regionName,
                        'phonenumber': row["контактний номер"],
                        'email': row["електронна пошта веб сайт"],
                        'mh4uCooperation': row["Співпраця з MH4U"],
                        'patienttype': row["Цільове населення"],
                        'mentalhealthworkers': row["фахівці з психічного здоров'я"],
                        'ac1': row["Activity code 1"],
                        'ac2': row["Activity code 2"],
                        'facilitytype': row["амбулаторна чи стаціонарна"]
                    }
                }

                let customFilterCategories = {};

                Object.keys(row)
                    .filter(el => el.includes("F_")).forEach(filterColumn => {
                    let filterName = filterColumn.replace("F_", "");
                    let arr = filterName.split("_");

                    let categoryName = arr[0].trim();
                    let filterValueName = arr[1].trim();

                    if (!customFilterCategories.hasOwnProperty(categoryName)) {
                        customFilterCategories[categoryName] = [];
                    }

                    let filterObject = {
                        "filterProperty": filterColumn,
                        "filterDisplayName": filterValueName,
                        "filterValueName": filterValueName
                    };

                    customFilterCategories[categoryName].push(filterObject);

                    let filterProperty = {
                        "filterValue": row[filterColumn],
                        "filterAttributes": []
                    };

                    feature["properties"][`${filterColumn}`] = filterProperty;
                    Object.keys(row)
                        .filter(el => el.includes(`A_${filterName}`))
                        .forEach(attributeColumn => {
                            let attributeArray = attributeColumn.split("_");
                            if (attributeArray.length == 4) {
                                filterProperty.filterAttributes.push({
                                    "attributeName": attributeArray[3],
                                    "attributeValue": row[attributeColumn]
                                });
                           };
                        });
                });
                otherCategories = customFilterCategories;

                collection.features.push(feature);
            }
        }) 
    })
    map.rootAdministrativeUnit = new AdministrativeUnit("root", 0, "Всі");
    buildAdministrativeUnitsTree(map.rootAdministrativeUnit, collection.features);
}

function buildAdministrativeUnitsTree(rootAu, features) {
    let childAuTemplate = administrativeUnitsBindingTemplate.find(au => au.auLevel === rootAu.Level + 1);

    if (childAuTemplate !== undefined) {
        let currentLevelAus = [... new Set(features.map(feature => feature.properties[childAuTemplate.auSourceProperty]))];
        currentLevelAus.forEach(auRecord => {
            let childAu = new AdministrativeUnit(childAuTemplate.auId, childAuTemplate.auLevel, auRecord);
            rootAu.addChildAdministrativeUnit(childAu);
            buildAdministrativeUnitsTree(childAu, features.filter(feature => feature.properties[childAuTemplate.auSourceProperty] == auRecord));
        });
    }
}

function createMarker(feature) {
    var marker = null;
    marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
    //Generating features for GeoJSON   
    marker.feature = feature;
    feature.properties.searchby = [];
    //Create a new combined property 'searchby' for searching by multiple features
    searchByMapping.forEach(element => feature.properties.searchby.push(feature.properties[element]));

    return marker;
}

function getMarkerColor(type) {
    if (markerColors.hasOwnProperty(type))
        return markerColors[type];
    else
        return 'blue';
}

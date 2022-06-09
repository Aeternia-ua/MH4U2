let collection = {
    'type': 'FeatureCollection',
    'features': []
};
let otherCategories = new Set();
let map = L.map('map').setView([49.8397, 24.0297], 8);
let loader;

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
        $('.breadcrumbs-dropdown-content').addClass('collapse');
        $('.info.legend.leaflet-control').hide();
    });
    // This is the Carto Positron basemap
    let basemap = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    basemap.addTo(map);
    loader = L.control.loader(); //Map loader
    loader.addTo(map);

    let layerControl = new L.Control.Custom(null, null, {collapsed: true});
    map.layerControl = layerControl;
    layerControl.addTo(map);
    let legend = new L.Control.Legend(); /// Map legend
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

    getSheets();

    $('.breadcrumbs-dropdown').on('click', function () {
        $('.breadcrumbs-dropdown-content').removeClass('collapse');
    });
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

function initializeEvents(layers, sidebar, markers) {
    buttonsJson.forEach(element => bindClearFilter(element.buttonId, element.className, layers, sidebar, markers));

    // Handle click event for the Clear Filter buttons in a category filters sidebar when the buttons are active
    $('.no-collapse').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $('.dropdown-toggle').toggleClass("toggle");
    });

}

function bindClearFilter(buttonId, className, layers, sidebar, markers) {
    let btn = document.getElementById(buttonId);
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

        let icon; // AwesomeMarkers is used to create facility icons.
        if (feature.properties.mh4uCooperation === 'Yes') { // If 'mh4uCooperation' value equals 'Yes', add a custom icon to the marker
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
        // marker.on('click', (e)=> populateInfoSidebar(e, sidebar)); // Open right sidebar with facility description after clicking on marker
        marker.on('click', (e)=> {
            populateInfoSidebar(e, sidebar);
            console.log(marker);
        });
    }
    return markers;
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
    let marker = null;
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

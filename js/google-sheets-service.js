let worksheetUrl;
let sheetData;
let http = new XMLHttpRequest();
let sheets = [];

class Sheet {
    constructor(title, url, values) {
        this.title = title;
        this.url = url;
        this.values = values;
    }
    get Title() {
        return this.title;
    }
    set Title(title) {
        return this.title = title;
    }
    get Url() {
        return this.url;
    }
    set Url(url) {
        return this.url = url;
    }
    get Values() {
        return this.values;
    }
    set Values(values) {
        return this.values = values;
    }
}

    function getSheets() {
        try {
            worksheetUrl = this.getWorksheetUrl(worksheetId, apiKey);
            http.open('GET', worksheetUrl);
            http.send();
            http.onload = async function () {
                if (http.status !== 200) { console.log(`Error ${http.status}: ${http.statusText}`); }
                else {
                    let response = http.response;
                    let jsonSheets = JSON.parse(response).sheets;
                    let sheetsArray = [];
                    let sheetRefArray = [jsonSheets].map(data => data.map(sheetRef => ({
                        title: sheetRef.properties.title,
                        url: getSheetUrl(worksheetId, sheetRef.properties.title, apiKey),
                    })));
                    sheetRefArray.forEach(sheetRef => { // TODO: Check if this can be optimized
                        sheetRef.forEach(e => {
                            sheetsArray.push(e);
                        })
                    })
                    getSheetResults(sheetsArray, processResults, sheets);
                    }
            }
        } catch (err) { document.getElementById('content').innerText = err.message; }
        return sheets;
    }

    function processResults() {
        createDataTypes(dataTypesTemplate, sheets);
        let facilitiesData = getFacilitiesData(sheets);
        createFacilitiesArray(facilitiesData);
        let codes = mergeCodes(collection, dataTypesTemplate);
        console.log("collection ", collection, "codes ", codes);
        let markerCluster = L.markerClusterGroup({ //Create marker cluster layer group.
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

        let mapsRoot = $("#maps-menu");
        createMapsMenu(mapsRoot, mapsData);
        window.addEventListener('hashchange', router); //Routing for 3rd party maps
        window.addEventListener('load', router);
        loader.hide(); // When all the map controls are initialized, hide map loader
    }

    function getSheetResults(sheetRefArray, processResultsFunction, results) {
        if (sheetRefArray.length === 0) {
            processResultsFunction(results);
        } else {
            let sheetRef = sheetRefArray.shift();
            http.open('GET', sheetRef.url);
            http.send();
            http.onload = async function () {
                if (http.status !== 200) {
                    console.log(`Error ${http.status}: ${http.statusText}`);
                } else {
                    sheetData = JSON.parse(http.response); ///Return an array of objects
                    const sheet = new Sheet(sheetRef.title, sheetRef.url, sheetData.values);
                    results.push(sheet);
                    getSheetResults(sheetRefArray, processResultsFunction, results);
                }
            }
        }
    }

  function getWorksheetUrl(worksheetId, apiKey) { // Return a JSON with the IDs of all the tabs
    return 'https://sheets.googleapis.com/v4/spreadsheets/' + worksheetId + '?fields=sheets.properties.title' + '&key='
        + apiKey;
  }

  function getSheetUrl(worksheetId, sheetTitle, apiKey) {
    return 'https://sheets.googleapis.com/v4/spreadsheets/' + worksheetId + '/values/' + sheetTitle
        + '?alt=json&key=' + apiKey;
  }
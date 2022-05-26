    const apiKey = 'AIzaSyBKFgQMpdmaYa6s3ojD_-nyHRekJrrrvKA'; /// TODO: Separate API key and sheet IDs to config file
    const worksheetId = '1XnA5UQX0-vj8_0K3JeKYn6dhFvHvCxPeV6ZdIKY9pG8';
    let worksheetUrl;
    let json;
    let sheetData;
    let http = new XMLHttpRequest();
    const sheets = [];

    async function fetchMarkers() {
        getJson().then(r => {console.log("getJson response ", r)});
        // return getJson().then(response => {
        //     console.log("getJson response ", response);
        //     try {
        //         response.sheets.map(data => data.map(sheetRef => ({
        //             title: sheetRef.properties.title,
        //             url: getSheetUrl(this.worksheetId, sheetRef.properties.title, this.apiKey),
        //         })))
        //     }
        //     catch (err) { document.getElementById('content').innerText = err.message; }
        // })
    }

    async function getSheets() { /// Returns a list of sheet titles
        try {
            worksheetUrl = this.getWorksheetUrl(worksheetId, apiKey);
            http.open('GET', worksheetUrl);
            http.send();
            http.onload = async function () {
                if (http.status !== 200) { console.log(`Error ${http.status}: ${http.statusText}`); }
                else {
                    let response = http.response;
                    let jsonSheets = JSON.parse(response).sheets;
                    // TODO: Move to separate function
                    let sheetRefArray = [jsonSheets].map(data => data.map(sheetRef => ({
                        title: sheetRef.properties.title,
                        url: getSheetUrl(worksheetId, sheetRef.properties.title, apiKey),
                    })));
                    Promise.all(fetchSheetRequests(sheetRefArray)).then(r => {
                        console.log("r ", r);
                    })
                }
            }
        } catch (err) { document.getElementById('content').innerText = err.message; }
        console.log("getJson sheets ", sheets);
        return sheets;
    }

    function fetchSheetRequests(sheetRefArray) {
        let sheetRequestArray = [];
        sheetRefArray.forEach(sheetRef => {
            sheetRef.forEach(e => {
                // Promise.all(getSheetData(e.url)).then(sheetData => { // Returns a promise
                fetch(getSheetData(e.url)).then(sheetData => { sheetRequestArray.push(sheetData); })
            })
        })
        console.log("sheetRequestArray: ", sheetRequestArray);
         return sheetRequestArray;
    }

    function getSheetData(url) {
        let sheetData = null;
        try {
            http.open('GET', url);
            http.send();
            http.onload = async function () {
                if (http.status !== 200) { console.log(`Error ${http.status}: ${http.statusText}`); }
                else {
                    sheetData = JSON.parse(http.response); ///Return an array of objects
                    sheets.push([sheetData]);
                    return [sheetData];
                }
            }
        } catch (err) { document.getElementById('content').innerText = err.message; }
        // console.log('getSheetData sheetData ', [sheetData]);
        return [sheetData];
        // return sheets;
    }

    // async function getSheetData(url) {
    //     return sheetData = http.get<Response>(url)
    //     .pipe(map(response => response));
    // }

  // getSheetData = (url): Observable<Response> => {
  //   return this.sheetData = this.http.get<Response>(url)
  //     .pipe(map(response => response));
  // }

  function getWorksheetUrl(worksheetId, apiKey) { // Return a JSON with the IDs of all the tabs
    return 'https://sheets.googleapis.com/v4/spreadsheets/' + worksheetId + '?fields=sheets.properties.title' + '&key='
        + apiKey;
  }

  function getSheetUrl(worksheetId, sheetTitle, apiKey) {
    return 'https://sheets.googleapis.com/v4/spreadsheets/' + worksheetId + '/values/' + sheetTitle
        + '?alt=json&key=' + apiKey;
  }

  //  function fetchMarkers() {
  //   const sheets: Sheet[] = [];
  //   return this.googleSheetsService.getJson()
  //       .pipe(
  //           map(data => data['sheets'].map(sheetRef => ({
  //                   title: sheetRef.properties.title,
  //                   url: this.googleSheetsService.getSheetUrl(this.worksheetId, sheetRef.properties.title, this.apiKey),
  //           }))),
  //           map(sheetRef => sheetRef.map(sheet => (
  //               this.googleSheetsService.getSheetData(sheet.url)
  //                   .pipe(map(response => { sheet.data = response; return sheet; } ))
  //           ))),
  //       ).pipe(
  //      switchMap(observables => forkJoin(observables))).pipe(map(sheetObjects => {
  //       this.markerProviderService.MarkersCache = [];
  //       // Find user configuration sheet and get lists of user sheets and filters
  //       // TODO: Move functions to separate service.
  //       // TODO: Catch exception
  //       const userConfigSheet = sheetObjects.find(sheetObject =>  sheetObject['title'] === 'Map Config');
  //       const userFilters = this.userConfigService.getUserFilters(userConfigSheet);
  //       const userMarkerFilters = userFilters.find(userFilter => userFilter.Type === 'User Filters');
  //       //  Get sheets that user selected to add to the map
  //       const userSheetsFilter = userFilters.find(userFilter => userFilter.Type === 'User Sheets');
  //       userSheetsFilter.Values.forEach(userSheet => {
  //           // Find sheetObject by name that matches sheet that user selected to add to the map
  //           const filteredSheetObject = sheetObjects.find(sheetObject => sheetObject['title'] === userSheet);
  //           const [, ...values] = filteredSheetObject['data']['values']; // Get all rows except header row
  //           const nonEmptyValues = values.filter(e => e.length !== 0); // Remove empty rows
  //           const sheet = new Sheet(filteredSheetObject['title'], filteredSheetObject['url'], nonEmptyValues, filteredSheetObject['data']['values'][0], userMarkerFilters.Values);
  //           sheets.push(sheet);
  //       });
  //
  //       return this.markerProviderService.MarkersCache = this.createMarkers(sheets);
  //   }), share()); // Make an observable shareable between components
  // }
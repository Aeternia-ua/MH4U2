const dataURL = 'https://docs.google.com/spreadsheets/d/1owqbO4TlfVq3dw-Zyp-DxrooyCB0m1Hohstlha_o800/edit?usp=sharing';
const acCodesURL = 'https://docs.google.com/spreadsheets/d/1jX20bMaNFLYijteEGjJBDNzpkVqTC_YP0mA2B1zpED4/edit?usp=sharing';

// function initData(tabletop) {
//     let sheets = (tabletop.sheets());
//     createDataTypes(dataTypesTemplate, sheets);
// } // TODO: Rewrite for data fetched via Google Sheets API 4

function getFacilitiesData(sheets) {
    return dataTypesTemplate.find(sheet => sheet.type === "[Так]");
};


function createRegions(mappingSheets) {
	let regions = [];
    for (let i = 0; i < mappingSheets.length; i++) {
        regions.push(mappingSheets.sheets[i]);
    }
}

function createDataTypes(dataTypesTemplate, sheets) {
    dataTypesTemplate.forEach(dataTemplate => {
        let dataTemplateType = dataTemplate.type;
        let matchedSheets = sheets.filter((sheet) => sheet.Title.includes(dataTemplateType));
        // TODO: Add array of sheets to "data" of each data type object
        let matchedSheetData = matchedSheets.forEach(sheet => {
             dataTemplate.data.push(sheet);
        })
    });
    return dataTypesTemplate;
}

let dataTypesTemplate  = [
    {
        ///Region tab that should be added to map
        type: "[Так]",
        name: "mapping data sheets",
        parse: true,
        addToMap: true,
        data: []
    },
        ///Region tab that should NOT be added to map
        {
        type: "[Ні]",
        name: "hidden mapping data sheets",
        parse: false,
        addToMap: false,
        data: []
    },
    {
        ///Tab with data other than facility locations that should be parsed
        ///(i.e. service coding tab)
        type: "[conf]",
        name: "mapping configuration sheets",
        parse: true,
        addToMap: false,
        data: []
    },
    {
        ///Tab with data other than facility locations that should NOT be parsed (i.e. instructions, spreadsheet validation ranges)
        type: "[info]",
        name: "database info sheets",
        parse: false,
        data: []
    }
];

function getEntries(keys, values) {
    const entries = [];
    values.forEach(value => {
          const entry = [];
          keys.map((key, i) => { entry[key] = value[i]; });
          entries.push(entry);
          });
    return entries;
}

function createFacilitiesArray(facilitiesSheets) {

    facilitiesSheets.data.forEach(region => {
        let regionTabName = region.Title; // Get region name from the sheet tab name
        let regionName = regionTabName.replace(/.*?\[.*?\]/, '');

        const [, ...values] = region['values']; // Get all rows except header row
        const nonEmptyValues = values.filter(e => e.length !== 0); // Remove empty rows
        let headers = region['values'][0];
        const entries = getEntries(headers, nonEmptyValues);
        const displayEntries = entries
            .filter(entry => (entry['Додати на мапу'] === 'TRUE' && entry['Latitude'] && entry['Longitude']));

        displayEntries.forEach(row => {
            let coords = [parseFloat(row['Longitude']), parseFloat(row['Latitude'])];
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
                    'patienttype': [],
                    'mentalhealthworkers': row["фахівці з психічного здоров'я"],
                    'mentalHealthWorkersNum': [],
                    'ac1': row["Activity code 1"],
                    'ac2': row["Activity code 2"],
                    'subac1': row["Subactivity code 1"],
                    'subac2': row["Subactivity code 2"],
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
        })
    })
    map.rootAdministrativeUnit = new AdministrativeUnit("root", 0, "Всі");
    buildAdministrativeUnitsTree(map.rootAdministrativeUnit, collection.features);
}





// function createFacilitiesArray(array) {
//     let regions = array.values.forEach(region => {
//
//         let regionTabName = region.name; // Get region name from the sheet tab name
//         let regionName = regionTabName.replace(/.*?\[.*?\]/, '');
//
//         let rows = region.elements;
//         rows.forEach(row => {
//
//             let lat = parseFloat(row.Latitude);
//             let lon = parseFloat(row.Longitude);
//             // If the showOnMap checkbox is set to true, and if feature has the lat and long property, add feature to the map
//             let showOnMap = row["Додати на мапу"];
//             if (lat && lon && showOnMap === "TRUE") {
//                 let coords = [parseFloat(row.Longitude), parseFloat(row.Latitude)];
//                 let feature = {
//                     'type': 'Feature',
//                     'geometry': {
//                         'type': 'Point',
//                         'coordinates': coords
//                     },
//                     'properties': {
//                         'officialName': row["Офіційна назва"],
//                         'recorddate': row["Інформація актуальна станом на:"],
//                         'address': row["Адреса"],
//                         'district': row["Район"],
//                         'region': regionName,
//                         'phonenumber': row["контактний номер"],
//                         'email': row["електронна пошта веб сайт"],
//                         'mh4uCooperation': row["Співпраця з MH4U"],
//                         'patienttype': [],
//                         'mentalhealthworkers': row["фахівці з психічного здоров'я"],
//                         'mentalHealthWorkersNum': [],
//                         'ac1': row["Activity code 1"],
//                         'ac2': row["Activity code 2"],
//                         'facilitytype': row["амбулаторна чи стаціонарна"]
//                     }
//                 }
//
//                 let customFilterCategories = {};
//
//                 Object.keys(row)
//                     .filter(el => el.includes("F_")).forEach(filterColumn => {
//                     let filterName = filterColumn.replace("F_", "");
//                     let arr = filterName.split("_");
//
//                     let categoryName = arr[0].trim();
//                     let filterValueName = arr[1].trim();
//
//                     if (!customFilterCategories.hasOwnProperty(categoryName)) {
//                         customFilterCategories[categoryName] = [];
//                     }
//
//                     let filterObject = {
//                         "filterProperty": filterColumn,
//                         "filterDisplayName": filterValueName,
//                         "filterValueName": filterValueName
//                     };
//
//                     customFilterCategories[categoryName].push(filterObject);
//
//                     let filterProperty = {
//                         "filterValue": row[filterColumn],
//                         "filterAttributes": []
//                     };
//
//                     feature["properties"][`${filterColumn}`] = filterProperty;
//                     Object.keys(row)
//                         .filter(el => el.includes(`A_${filterName}`))
//                         .forEach(attributeColumn => {
//                             let attributeArray = attributeColumn.split("_");
//                             if (attributeArray.length == 4) {
//                                 filterProperty.filterAttributes.push({
//                                     "attributeName": attributeArray[3],
//                                     "attributeValue": row[attributeColumn]
//                                 });
//                            };
//                         });
//                 });
//                 otherCategories = customFilterCategories;
//
//                 collection.features.push(feature);
//             }
//         })
//     })
//     map.rootAdministrativeUnit = new AdministrativeUnit("root", 0, "Всі");
//     buildAdministrativeUnitsTree(map.rootAdministrativeUnit, collection.features);
// }

// function createFacilitiesArray(array) {
//     let regions = array.data.forEach(region => {
//
//         let regionTabName = region.name; // Get region name from the sheet tab name
//         let regionName = regionTabName.replace(/.*?\[.*?\]/, '');
//
//         let rows = region.elements;
//         rows.forEach(row => {
//
//             let lat = parseFloat(row.Latitude);
//             let lon = parseFloat(row.Longitude);
//             // If the showOnMap checkbox is set to true, and if feature has the lat and long property, add feature to the map
//             let showOnMap = row["Додати на мапу"];
//             if (lat && lon && showOnMap === "TRUE") {
//                 let coords = [parseFloat(row.Longitude), parseFloat(row.Latitude)];
//                 let feature = {
//                     'type': 'Feature',
//                     'geometry': {
//                         'type': 'Point',
//                         'coordinates': coords
//                     },
//                     'properties': {
//                         'officialName': row["Офіційна назва"],
//                         'recorddate': row["Інформація актуальна станом на:"],
//                         'address': row["Адреса"],
//                         'district': row["Район"],
//                         'region': regionName,
//                         'phonenumber': row["контактний номер"],
//                         'email': row["електронна пошта веб сайт"],
//                         'mh4uCooperation': row["Співпраця з MH4U"],
//                         'patienttype': [],
//                         'mentalhealthworkers': row["фахівці з психічного здоров'я"],
//                         'mentalHealthWorkersNum': [],
//                         'ac1': row["Activity code 1"],
//                         'ac2': row["Activity code 2"],
//                         'facilitytype': row["амбулаторна чи стаціонарна"]
//                     }
//                 }
//
//                 let customFilterCategories = {};
//
//                 Object.keys(row)
//                     .filter(el => el.includes("F_")).forEach(filterColumn => {
//                     let filterName = filterColumn.replace("F_", "");
//                     let arr = filterName.split("_");
//
//                     let categoryName = arr[0].trim();
//                     let filterValueName = arr[1].trim();
//
//                     if (!customFilterCategories.hasOwnProperty(categoryName)) {
//                         customFilterCategories[categoryName] = [];
//                     }
//
//                     let filterObject = {
//                         "filterProperty": filterColumn,
//                         "filterDisplayName": filterValueName,
//                         "filterValueName": filterValueName
//                     };
//
//                     customFilterCategories[categoryName].push(filterObject);
//
//                     let filterProperty = {
//                         "filterValue": row[filterColumn],
//                         "filterAttributes": []
//                     };
//
//                     feature["properties"][`${filterColumn}`] = filterProperty;
//                     Object.keys(row)
//                         .filter(el => el.includes(`A_${filterName}`))
//                         .forEach(attributeColumn => {
//                             let attributeArray = attributeColumn.split("_");
//                             if (attributeArray.length == 4) {
//                                 filterProperty.filterAttributes.push({
//                                     "attributeName": attributeArray[3],
//                                     "attributeValue": row[attributeColumn]
//                                 });
//                            };
//                         });
//                 });
//                 otherCategories = customFilterCategories;
//
//                 collection.features.push(feature);
//             }
//         })
//     })
//     map.rootAdministrativeUnit = new AdministrativeUnit("root", 0, "Всі");
//     buildAdministrativeUnitsTree(map.rootAdministrativeUnit, collection.features);
// }
const dataURL = 'https://docs.google.com/spreadsheets/d/1owqbO4TlfVq3dw-Zyp-DxrooyCB0m1Hohstlha_o800/edit?usp=sharing';
const acCodesURL = 'https://docs.google.com/spreadsheets/d/1jX20bMaNFLYijteEGjJBDNzpkVqTC_YP0mA2B1zpED4/edit?usp=sharing';

function initData(tabletop) {
    let sheets = (tabletop.sheets());
    createDataTypes(dataTypesTemplate, sheets);
}

function getFacilitiesData(tabletop) {
    return dataTypesTemplate.find(sheet => sheet.type === "[Так]");
};


function createRegions(mappingSheets) {
	let regions = [];
    for (let i = 0; i < mappingSheets.length; i++) {
        regions.push(mappingSheets.sheets[i]);
    }
}

function createDataTypes(dataTypesTemplate, sheets) {
    //keys are the names of each tab of the spreadsheet
    let keys = Object.keys(sheets);
    dataTypesTemplate.forEach(element => {
        let type = element.type;
        let match = keys.filter((sheet) => sheet.includes(type));

        let matchData = match .map(function(key) { 
            return sheets[key];
        });

        for (let i = 0; i < matchData.length; i++) {
            element.data.push(matchData[i]);
        }
    });
    console.log(dataTypesTemplate);
}

///TODO: tab naming template
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